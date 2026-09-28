import { Router, Response } from 'express';
import * as XLSX from 'xlsx';
import { db } from '../db';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth';
import { ClassCode, ReviewPermission } from '../../src/types';

const router = Router();

// Protect ALL routes in this router with requireAdmin
router.use(requireAdmin);

// GET /api/admin/overview
router.get('/overview', (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getOverviewStats();
  const topErrors = db.getTopErrorQuestions();
  res.json({
    stats,
    topErrors: topErrors.slice(0, 10), // Top 10 error questions
  });
});

// GET /api/admin/classes
router.get('/classes', (req: AuthenticatedRequest, res: Response) => {
  const classes = db.getClasses();
  res.json(classes);
});

// PUT /api/admin/classes/:id
router.put('/classes/:id', (req: AuthenticatedRequest, res: Response) => {
  const { name } = req.body;
  const updated = db.updateClass(req.params.id, name);
  if (!updated) {
    res.status(404).json({ error: 'CLASS_NOT_FOUND', message: 'Không tìm thấy lớp học.' });
    return;
  }
  res.json(updated);
});

// GET /api/admin/students
router.get('/students', (req: AuthenticatedRequest, res: Response) => {
  const classCode = req.query.classCode as ClassCode | undefined;
  const includeDeleted = req.query.includeDeleted === 'true';
  const search = (req.query.search as string) || '';

  const students = db.getStudents(classCode, includeDeleted, search);
  res.json(students);
});

// POST /api/admin/students
router.post('/students', (req: AuthenticatedRequest, res: Response) => {
  const { fullName, classCode } = req.body;
  if (!fullName || !classCode) {
    res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng cung cấp họ tên và lớp học.' });
    return;
  }

  const result = db.addStudent(fullName, classCode as ClassCode);
  if (!result.success) {
    res.status(400).json({ error: 'ADD_STUDENT_FAILED', message: result.message });
    return;
  }

  res.json(result.student);
});

// PUT /api/admin/students/:id
router.put('/students/:id', (req: AuthenticatedRequest, res: Response) => {
  const { fullName, classCode } = req.body;
  if (!fullName) {
    res.status(400).json({ error: 'MISSING_NAME', message: 'Vui lòng nhập họ và tên mới.' });
    return;
  }

  const result = db.updateStudent(req.params.id, fullName, classCode as ClassCode);
  if (!result.success) {
    res.status(400).json({ error: 'UPDATE_FAILED', message: result.message });
    return;
  }

  res.json(result.student);
});

// DELETE /api/admin/students/:id (Soft Delete)
router.delete('/students/:id', (req: AuthenticatedRequest, res: Response) => {
  const result = db.softDeleteStudent(req.params.id);
  if (!result.success) {
    res.status(404).json({ error: 'STUDENT_NOT_FOUND', message: result.message });
    return;
  }
  res.json(result);
});

// POST /api/admin/students/:id/restore
router.post('/students/:id/restore', (req: AuthenticatedRequest, res: Response) => {
  const result = db.restoreStudent(req.params.id);
  if (!result.success) {
    res.status(404).json({ error: 'STUDENT_NOT_FOUND', message: result.message });
    return;
  }
  res.json(result);
});

// DELETE /api/admin/students/:id/permanent
router.delete('/students/:id/permanent', (req: AuthenticatedRequest, res: Response) => {
  const result = db.permanentDeleteStudent(req.params.id);
  if (!result.success) {
    res.status(404).json({ error: 'STUDENT_NOT_FOUND', message: result.message });
    return;
  }
  res.json(result);
});

// POST /api/admin/students/import
router.post('/students/import', (req: AuthenticatedRequest, res: Response) => {
  const { classCode, students, replaceExisting } = req.body;
  if (!classCode || !Array.isArray(students)) {
    res.status(400).json({ error: 'INVALID_PAYLOAD', message: 'Dữ liệu nhập danh sách không hợp lệ.' });
    return;
  }

  const result = db.importStudents(classCode as ClassCode, students, !!replaceExisting);
  res.json(result);
});

// POST /api/admin/students/reset-all (Wipe all students, submissions, and history to start fresh)
router.post('/students/reset-all', (req: AuthenticatedRequest, res: Response) => {
  const result = db.resetAllStudentsAndSubmissions();
  res.json(result);
});

// GET /api/admin/gradebook (Get students roster with Bài 1 to 12 scores)
router.get('/gradebook', (req: AuthenticatedRequest, res: Response) => {
  const classCode = req.query.classCode as ClassCode | undefined;
  const gradebook = db.getGradebook(classCode);
  res.json(gradebook);
});

// GET /api/admin/lessons
router.get('/lessons', (req: AuthenticatedRequest, res: Response) => {
  const lessons = db.getLessons();
  res.json(lessons);
});

// PUT /api/admin/lessons/:id
router.put('/lessons/:id', (req: AuthenticatedRequest, res: Response) => {
  const { title, description } = req.body;
  const updated = db.updateLesson(req.params.id, title, description);
  if (!updated) {
    res.status(404).json({ error: 'LESSON_NOT_FOUND', message: 'Không tìm thấy bài học.' });
    return;
  }
  res.json(updated);
});

// GET /api/admin/assignments
router.get('/assignments', (req: AuthenticatedRequest, res: Response) => {
  const lessonId = req.query.lessonId as string | undefined;
  const assignments = db.getAssignments(lessonId);
  res.json(assignments);
});

// GET /api/admin/assignments/:id
router.get('/assignments/:id', (req: AuthenticatedRequest, res: Response) => {
  const asg = db.getAssignmentById(req.params.id);
  if (!asg) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài tập.' });
    return;
  }
  res.json(asg);
});

// POST /api/admin/assignments
router.post('/assignments', (req: AuthenticatedRequest, res: Response) => {
  const { lessonId, code, title, type, durationMinutes, dueDate, questions } = req.body;
  if (!lessonId || !code || !title) {
    res.status(400).json({ error: 'MISSING_FIELDS', message: 'Vui lòng cung cấp bài học, mã bài và tiêu đề.' });
    return;
  }

  const created = db.createAssignment({
    lessonId,
    code,
    title,
    type,
    durationMinutes: Number(durationMinutes) || 15,
    dueDate,
    questions,
  });

  res.json(created);
});

// PUT /api/admin/assignments/:id
router.put('/assignments/:id', (req: AuthenticatedRequest, res: Response) => {
  const { code, title, type, durationMinutes, dueDate, questions } = req.body;
  const updated = db.updateAssignment(
    req.params.id,
    {
      code: code ? code.trim().toUpperCase() : undefined,
      title: title ? title.trim() : undefined,
      type,
      durationMinutes: durationMinutes ? Number(durationMinutes) : undefined,
      dueDate,
    },
    questions
  );

  if (!updated) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài tập để cập nhật.' });
    return;
  }

  res.json(updated);
});

// POST /api/admin/assignments/:id/duplicate
router.post('/assignments/:id/duplicate', (req: AuthenticatedRequest, res: Response) => {
  const cloned = db.duplicateAssignment(req.params.id);
  if (!cloned) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không thể nhân bản bài tập.' });
    return;
  }
  res.json(cloned);
});

// POST /api/admin/assignments/:id/toggle-lock
router.post('/assignments/:id/toggle-lock', (req: AuthenticatedRequest, res: Response) => {
  const locked = db.toggleLockAssignment(req.params.id);
  if (locked === null) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài tập.' });
    return;
  }
  res.json({ isLocked: locked });
});

// POST /api/admin/assignments/:id/set-lock
router.post('/assignments/:id/set-lock', (req: AuthenticatedRequest, res: Response) => {
  const { isLocked } = req.body;
  const locked = db.setAssignmentLock(req.params.id, !!isLocked);
  if (locked === null) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài tập.' });
    return;
  }
  res.json({ isLocked: locked });
});

// POST /api/admin/assignments/lock-all (Lock all 12 lessons)
router.post('/assignments/lock-all', (req: AuthenticatedRequest, res: Response) => {
  const result = db.lockAllAssignments();
  res.json(result);
});

// POST /api/admin/assignments/unlock-all (Unlock all 12 lessons)
router.post('/assignments/unlock-all', (req: AuthenticatedRequest, res: Response) => {
  const result = db.unlockAllAssignments();
  res.json(result);
});

// DELETE /api/admin/assignments/:id
router.delete('/assignments/:id', (req: AuthenticatedRequest, res: Response) => {
  const success = db.deleteAssignment(req.params.id);
  if (!success) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài tập.' });
    return;
  }
  res.json({ success: true, message: 'Đã xóa bài tập vào thùng rác.' });
});

// POST /api/admin/assignments/reset-all (Wipe all assignments & submissions to start fresh)
router.post('/assignments/reset-all', (req: AuthenticatedRequest, res: Response) => {
  const result = db.resetAllAssignments();
  res.json(result);
});

// GET /api/admin/submissions
router.get('/submissions', (req: AuthenticatedRequest, res: Response) => {
  const classCode = req.query.classCode as ClassCode | undefined;
  const assignmentId = req.query.assignmentId as string | undefined;
  const submissions = db.getSubmissions(classCode, assignmentId);
  res.json(submissions);
});

// GET /api/admin/submissions/:id
router.get('/submissions/:id', (req: AuthenticatedRequest, res: Response) => {
  const sub = db.getSubmissionById(req.params.id);
  if (!sub) {
    res.status(404).json({ error: 'SUBMISSION_NOT_FOUND', message: 'Không tìm thấy bài làm.' });
    return;
  }

  const asg = db.getAssignmentById(sub.assignmentId);

  res.json({
    submission: sub,
    assignment: asg,
  });
});

// PUT /api/admin/submissions/:id/review-permission
router.put('/submissions/:id/review-permission', (req: AuthenticatedRequest, res: Response) => {
  const { permission } = req.body;
  const ok = db.updateReviewPermission(req.params.id, permission as ReviewPermission);
  if (!ok) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài làm.' });
    return;
  }
  res.json({ success: true, permission });
});

// DELETE /api/admin/submissions/:id - Delete duplicate or wrong submission
router.delete('/submissions/:id', (req: AuthenticatedRequest, res: Response) => {
  const ok = db.deleteSubmission(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài làm để xóa.' });
    return;
  }
  res.json({ success: true, message: 'Đã xóa bài làm thành công.' });
});

// POST /api/admin/submissions/:id/reset - Allow student to retake if wrong/error
router.post('/submissions/:id/reset', (req: AuthenticatedRequest, res: Response) => {
  const ok = db.resetSubmission(req.params.id);
  if (!ok) {
    res.status(404).json({ error: 'NOT_FOUND', message: 'Không tìm thấy bài làm để đặt lại.' });
    return;
  }
  res.json({ success: true, message: 'Đã đặt lại bài làm. Học sinh có thể làm lại bài mới.' });
});

// GET /api/admin/students/:id/history
router.get('/students/:id/history', (req: AuthenticatedRequest, res: Response) => {
  const history = db.getStudentHistory(req.params.id);
  if (!history) {
    res.status(404).json({ error: 'STUDENT_NOT_FOUND', message: 'Không tìm thấy học sinh.' });
    return;
  }
  res.json(history);
});

// GET /api/admin/export - Excel Export
router.get('/export', (req: AuthenticatedRequest, res: Response) => {
  const classCode = req.query.classCode as ClassCode | 'ALL' | undefined;
  const submissions = db.getSubmissions(classCode && classCode !== 'ALL' ? classCode : undefined);

  // File columns: STT – Họ tên – Lớp – Bài – Bài tập – Điểm – Số câu đúng – Thời gian – Thời điểm bắt đầu – Thời điểm nộp – Trạng thái – Đúng hạn/Quá hạn
  const rows = submissions.map((s, index) => {
    const mins = Math.floor(s.totalTimeSeconds / 60);
    const secs = s.totalTimeSeconds % 60;
    const timeFormatted = `${mins} phút ${secs.toString().padStart(2, '0')} giây`;

    return {
      'STT': index + 1,
      'Họ và tên': s.studentName,
      'Lớp': s.classCode,
      'Bài': `Bài ${s.lessonNumber}: ${s.lessonTitle}`,
      'Bài tập': s.assignmentTitle,
      'Điểm': s.score,
      'Số câu đúng': `${s.correctCount}/${s.totalQuestions}`,
      'Thời gian làm bài': timeFormatted,
      'Thời điểm bắt đầu': s.startedAt ? new Date(s.startedAt).toLocaleString('vi-VN') : '',
      'Thời điểm nộp': s.submittedAt ? new Date(s.submittedAt).toLocaleString('vi-VN') : '',
      'Trạng thái': s.status === 'SUBMITTED_LOCKED' ? 'Đã hoàn thành & Khóa' : 'Đang làm',
      'Đúng hạn/Quá hạn': s.isOntime ? 'Đúng hạn' : 'Quá hạn',
    };
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'KetQuaLamBai');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  const filename = `KetQua_GDCD6_${classCode || 'ALL'}_${Date.now()}.xlsx`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

// GET /api/admin/export/history
router.get('/export/history', (req: AuthenticatedRequest, res: Response) => {
  const students = db.getStudents(undefined, false);
  const rows: any[] = [];

  students.forEach((st, idx) => {
    const hist = db.getStudentHistory(st.id);
    if (hist) {
      rows.push({
        'STT': idx + 1,
        'Mã học sinh': st.studentCode,
        'Họ và tên': st.fullName,
        'Lớp': st.classCode,
        'Số bài đã làm': hist.completedCount,
        'Điểm trung bình': hist.averageScore,
        'Số bài đúng hạn': hist.onTimeCount,
        'Số bài quá hạn': hist.lateCount,
        'Tiến độ': `${hist.progressPercent}%`,
      });
    }
  });

  const ws = XLSX.utils.json_to_sheet(rows);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'LichSuHocTap');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  const filename = `LichSuHocTap_GDCD6_${Date.now()}.xlsx`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

// GET /api/admin/audit-logs
router.get('/audit-logs', (req: AuthenticatedRequest, res: Response) => {
  const logs = db.getAuditLogs();
  res.json(logs);
});

// GET /api/admin/settings
router.get('/settings', (req: AuthenticatedRequest, res: Response) => {
  const settings = db.getSettings();
  res.json(settings);
});

// PUT /api/admin/settings
router.put('/settings', (req: AuthenticatedRequest, res: Response) => {
  const updated = db.updateSettings(req.body);
  res.json(updated);
});

// GET /api/admin/trash
router.get('/trash', (req: AuthenticatedRequest, res: Response) => {
  const trash = db.getTrash();
  res.json(trash);
});

// POST /api/admin/reset-test-data
router.post('/reset-test-data', (req: AuthenticatedRequest, res: Response) => {
  db.resetTestData();
  res.json({ success: true, message: 'Đã thiết lập lại dữ liệu chuẩn.' });
});

export default router;
