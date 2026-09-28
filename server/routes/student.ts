import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db } from '../db';
import { getSession } from '../middleware/auth';
import { ClassCode, Submission } from '../../src/types';

const router = Router();

// Helper to ensure student can ONLY view/edit their own submission
function verifyStudentOwnership(req: Request, sub: Submission): boolean {
  // 1. Teacher/Admin has authority to view any submission
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const adminToken = authHeader.split(' ')[1];
    const session = getSession(adminToken);
    if (session) return true;
  }

  // 2. Student token verification
  const token = (req.headers['x-student-token'] as string) || 
                (req.body?.studentToken as string) || 
                (req.query?.studentToken as string);

  if (sub.studentToken) {
    return token === sub.studentToken;
  }
  return true;
}

// GET /api/student/classes - returns active class list
router.get('/classes', (req: Request, res: Response) => {
  const classes = db.getClasses();
  res.json(classes);
});

// GET /api/student/active-assignments - returns active assignments for quick reference
router.get('/active-assignments', (req: Request, res: Response) => {
  const assignments = db.getAssignments(undefined, false)
    .map(a => ({
      id: a.id,
      code: a.code,
      title: a.title,
      type: a.type,
      durationMinutes: a.durationMinutes,
      questionCount: a.questionCount,
      isLocked: !!a.isLocked,
    }));
  res.json(assignments);
});

// POST /api/student/verify-assignment - check code before entering
router.post('/verify-assignment', (req: Request, res: Response) => {
  const { code } = req.body;
  if (!code) {
    res.status(400).json({ error: 'MISSING_CODE', message: 'Vui lòng nhập mã bài tập.' });
    return;
  }

  const asg = db.getAssignmentByCode(code);
  if (!asg) {
    res.status(404).json({
      error: 'ASSIGNMENT_NOT_FOUND',
      message: `Mã bài tập "${code}" không tồn tại hoặc đã bị đóng. Vui lòng kiểm tra lại mã cô giáo đã giao!`,
    });
    return;
  }

  if (asg.isLocked) {
    res.status(403).json({
      error: 'ASSIGNMENT_LOCKED',
      message: `🔒 Bài tập "${asg.title}" hiện đang được Cô An Na tạm khóa. Khi nào cô mở khóa thì em mới được vào làm bài nhé!`,
      isLocked: true,
    });
    return;
  }

  res.json({
    id: asg.id,
    code: asg.code,
    title: asg.title,
    durationMinutes: asg.durationMinutes,
    questionCount: asg.questions.length,
    dueDate: asg.dueDate,
    isLocked: false,
  });
});

// POST /api/student/start - start an exam session
router.post('/start', (req: Request, res: Response) => {
  const { fullName, classCode, assignmentCode } = req.body;

  if (!fullName || !fullName.trim()) {
    res.status(400).json({ error: 'MISSING_NAME', message: 'Vui lòng nhập họ và tên của em.' });
    return;
  }

  if (!classCode) {
    res.status(400).json({ error: 'MISSING_CLASS', message: 'Vui lòng chọn lớp học (6A8 - 6A12).' });
    return;
  }

  if (!assignmentCode || !assignmentCode.trim()) {
    res.status(400).json({ error: 'MISSING_CODE', message: 'Vui lòng nhập mã bài tập.' });
    return;
  }

  const asg = db.getAssignmentByCode(assignmentCode);
  if (!asg) {
    res.status(404).json({ error: 'ASSIGNMENT_NOT_FOUND', message: 'Mã bài tập không chính xác.' });
    return;
  }

  if (asg.isLocked) {
    res.status(403).json({
      error: 'ASSIGNMENT_LOCKED',
      message: `🔒 Bài tập "${asg.title}" hiện đang được Cô An Na tạm khóa. Khi nào cô mở khóa thì em mới được vào làm bài nhé!`,
      isLocked: true,
    });
    return;
  }

  // Find or create student record for this class
  let student = db.getStudents(classCode as ClassCode, false)
    .find(s => s.fullName.toLowerCase() === fullName.trim().toLowerCase());

  if (!student) {
    const addResult = db.addStudent(fullName.trim(), classCode as ClassCode);
    if (!addResult.success || !addResult.student) {
      res.status(400).json({ error: 'STUDENT_CREATION_FAILED', message: addResult.message });
      return;
    }
    student = addResult.student;
  }

  try {
    const studentToken = crypto.randomUUID();
    const submission = db.startSubmission(student.id, asg.id, studentToken);

    // SECURITY: Strip correctOption and explanation so student cannot cheat via DevTools
    const safeQuestions = asg.questions.map(q => ({
      id: q.id,
      order: q.order,
      taskName: q.taskName,
      points: q.points,
      content: q.content,
      options: q.options,
    }));

    res.json({
      submissionId: submission.id,
      studentToken: submission.studentToken,
      student: {
        id: student.id,
        fullName: student.fullName,
        classCode: student.classCode,
        studentCode: student.studentCode,
      },
      assignment: {
        id: asg.id,
        code: asg.code,
        title: asg.title,
        durationMinutes: asg.durationMinutes,
        totalQuestions: safeQuestions.length,
      },
      savedAnswers: submission.answers,
      questions: safeQuestions,
      startedAt: submission.startedAt,
    });
  } catch (err: any) {
    res.status(400).json({ error: 'START_FAILED', message: err.message || 'Không thể bắt đầu bài làm.' });
  }
});

// POST /api/student/save-answer - auto-save answer with timestamp
router.post('/save-answer', (req: Request, res: Response) => {
  const { submissionId, questionId, selectedOption } = req.body;

  if (!submissionId || !questionId) {
    res.status(400).json({ error: 'MISSING_FIELDS', message: 'Thiếu thông tin lưu câu trả lời.' });
    return;
  }

  const sub = db.getSubmissionById(submissionId);
  if (!sub) {
    res.status(404).json({ error: 'SUBMISSION_NOT_FOUND', message: 'Không tìm thấy bài làm.' });
    return;
  }

  if (!verifyStudentOwnership(req, sub)) {
    res.status(403).json({ error: 'FORBIDDEN', message: 'Em chỉ có thể làm bài của chính mình, không được can thiệp vào bài của bạn khác.' });
    return;
  }

  try {
    const ok = db.saveQuestionAnswer(submissionId, questionId, selectedOption);
    if (!ok) {
      res.status(404).json({ error: 'SUBMISSION_NOT_FOUND', message: 'Không tìm thấy bài làm.' });
      return;
    }
    res.json({ success: true, savedAt: new Date().toISOString() });
  } catch (err: any) {
    res.status(403).json({ error: 'SAVE_BLOCKED', message: err.message });
  }
});

// POST /api/student/submit - Final submit & IMMEDIATE LOCK
router.post('/submit', (req: Request, res: Response) => {
  const { submissionId, totalTimeSeconds } = req.body;

  if (!submissionId) {
    res.status(400).json({ error: 'MISSING_SUBMISSION_ID', message: 'Thiếu mã bài làm.' });
    return;
  }

  const sub = db.getSubmissionById(submissionId);
  if (!sub) {
    res.status(404).json({ error: 'SUBMISSION_NOT_FOUND', message: 'Không tìm thấy bài làm.' });
    return;
  }

  if (!verifyStudentOwnership(req, sub)) {
    res.status(403).json({ error: 'FORBIDDEN', message: 'Em chỉ có thể nộp bài của chính mình, không được nộp bài của bạn khác.' });
    return;
  }

  try {
    const submission = db.submitAssignment(submissionId, Number(totalTimeSeconds) || 0);

    const mins = Math.floor(submission.totalTimeSeconds / 60);
    const secs = submission.totalTimeSeconds % 60;
    const timeDisplay = `${mins} phút ${secs.toString().padStart(2, '0')} giây`;

    res.json({
      success: true,
      submissionId: submission.id,
      status: submission.status, // SUBMITTED_LOCKED
      score: submission.score,
      pointsEarned: submission.pointsEarned,
      totalMaxPoints: submission.totalMaxPoints,
      rankTitle: submission.rankTitle,
      assignmentCode: submission.assignmentCode,
      assignmentTitle: submission.assignmentTitle,
      totalQuestions: submission.totalQuestions,
      correctCount: submission.correctCount,
      totalTimeFormatted: timeDisplay,
      submittedDate: new Date(submission.submittedAt!).toLocaleDateString('vi-VN'),
      isLocked: true,
      lockNotice: 'Bài làm chi tiết đã được bảo vệ an toàn. Chỉ giáo viên có quyền mở để xem.',
    });
  } catch (err: any) {
    res.status(400).json({ error: 'SUBMIT_FAILED', message: err.message });
  }
});

// GET /api/student/submission/:id - Check completion / review status
router.get('/submission/:id', (req: Request, res: Response) => {
  const sub = db.getSubmissionById(req.params.id);
  if (!sub) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài làm.' });
    return;
  }

  if (!verifyStudentOwnership(req, sub)) {
    res.status(403).json({ error: 'FORBIDDEN', message: 'Bảo mật: Em chỉ được xem bài của chính mình, không được mở xem bài của bạn khác.' });
    return;
  }

  const mins = Math.floor(sub.totalTimeSeconds / 60);
  const secs = sub.totalTimeSeconds % 60;
  const timeDisplay = `${mins} phút ${secs.toString().padStart(2, '0')} giây`;

  // Respect reviewPermission set by Cô An Na
  const permission = sub.reviewPermission;

  const baseResult = {
    submissionId: sub.id,
    studentName: sub.studentName,
    classCode: sub.classCode,
    assignmentTitle: sub.assignmentTitle,
    status: sub.status,
    score: sub.score,
    totalTimeFormatted: timeDisplay,
    submittedDate: sub.submittedAt ? new Date(sub.submittedAt).toLocaleDateString('vi-VN') : '',
    reviewPermission: permission,
    isLocked: true,
    lockNotice: 'Bài làm chi tiết đã được bảo vệ. Chỉ giáo viên có quyền mở để xem.',
  };

  if (permission === 'LOCKED' || permission === 'SCORE_ONLY') {
    // Return NO questions, NO options, NO answers
    res.json(baseResult);
    return;
  }

  const asg = db.getAssignmentById(sub.assignmentId);
  if (!asg) {
    res.json(baseResult);
    return;
  }

  if (permission === 'QUESTIONS_NO_ANSWERS') {
    // Return questions with student's picked option, but NO correctOption and NO explanation
    const questions = asg.questions.map(q => ({
      id: q.id,
      order: q.order,
      content: q.content,
      options: q.options,
      studentChoice: sub.answers[q.id]?.selectedOption || null,
    }));
    res.json({ ...baseResult, questions });
    return;
  }

  if (permission === 'FULL_REVIEW') {
    // Teacher granted full review
    const questions = asg.questions.map(q => ({
      id: q.id,
      order: q.order,
      content: q.content,
      options: q.options,
      correctOption: q.correctOption,
      explanation: q.explanation,
      studentChoice: sub.answers[q.id]?.selectedOption || null,
      isCorrect: sub.answers[q.id]?.isCorrect,
    }));
    res.json({ ...baseResult, questions });
    return;
  }

  res.json(baseResult);
});

export default router;
