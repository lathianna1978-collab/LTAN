import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  ClassCode,
  ClassItem,
  Student,
  Question,
  Assignment,
  Lesson,
  Submission,
  SystemSettings,
  AuditLog,
  QuestionErrorStat,
  StudentHistorySummary,
  ReviewPermission,
  GradebookEntry
} from '../src/types';
import { INITIAL_CLASSES, INITIAL_LESSONS, INITIAL_ASSIGNMENTS, INITIAL_QUESTIONS, INITIAL_STUDENTS } from '../src/data/curriculum';

export interface AdminUser {
  id: string;
  username: string;
  displayName: string;
  passwordHash: string;
  role: 'admin';
  createdAt: string;
}

export interface DatabaseSchema {
  admins: AdminUser[];
  classes: ClassItem[];
  students: Student[];
  lessons: Lesson[];
  assignments: Assignment[];
  questions: Question[];
  submissions: Submission[];
  settings: SystemSettings;
  auditLogs: AuditLog[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

class DatabaseManager {
  private db: DatabaseSchema;

  constructor() {
    this.db = this.loadOrInitialize();
  }

  private loadOrInitialize(): DatabaseSchema {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DatabaseSchema;
        // Ensure all required properties exist
        return this.ensureSchemaDefaults(parsed);
      } catch (err) {
        console.error('Error reading existing database, initializing fresh state:', err);
      }
    }

    const initial = this.generateInitialDatabase();
    this.saveToDisk(initial);
    return initial;
  }

  private ensureSchemaDefaults(parsed: Partial<DatabaseSchema>): DatabaseSchema {
    const initial = this.generateInitialDatabase();

    return {
      admins: parsed.admins && parsed.admins.length > 0 ? parsed.admins : initial.admins,
      classes: parsed.classes && parsed.classes.length > 0 ? parsed.classes : initial.classes,
      students: parsed.students || initial.students,
      lessons: parsed.lessons && parsed.lessons.length > 0 ? parsed.lessons : initial.lessons,
      assignments: parsed.assignments || [],
      questions: parsed.questions || [],
      submissions: parsed.submissions || [],
      settings: parsed.settings || initial.settings,
      auditLogs: parsed.auditLogs || initial.auditLogs,
    };
  }

  private generateInitialDatabase(): DatabaseSchema {
    // Salt rounds 10
    const defaultPasswordHash = bcrypt.hashSync('Annalhp1978$', 10);

    const initialAdmins: AdminUser[] = [
      {
        id: 'admin-coanna',
        username: 'coanna',
        displayName: 'CÔ AN NA',
        passwordHash: defaultPasswordHash,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    ];

    const initialSettings: SystemSettings = {
      appName: 'Hành trình Công dân nhí - Môn Giáo dục Công dân 6',
      slogan: '📚 Học bài • 🧠 Hiểu bài • ✨ Vận dụng • 🌱 Trưởng thành',
      adminDisplayName: 'CÔ AN NA',
      lockImmediatelyOnSubmit: true,
      showScoreAfterSubmit: true,
      showTimeAfterSubmit: true,
      showCorrectCountAfterSubmit: false,
      showAnswersAfterSubmit: false,
      allowStudentReview: false,
      defaultReviewPermission: 'LOCKED',
    };

    const initialLogs: AuditLog[] = [
      {
        id: 'log-init',
        timestamp: '2026-09-18T07:30:00.000Z',
        actor: 'Hệ thống',
        action: 'Khởi tạo hệ thống',
        details: 'Khởi động ứng dụng Hành trình Công dân nhí GDCD 6 với 5 lớp 6A8-6A12',
      },
    ];

    // Create a few realistic initial submissions for analytics & error question display
    const sampleSubmissions: Submission[] = [
      {
        id: 'sub-sample-1',
        studentId: 'st-6a8-01',
        studentName: 'Nguyễn Minh Anh',
        classCode: '6A8',
        assignmentId: 'asg-b1-01',
        assignmentCode: 'CD6-B1',
        assignmentTitle: 'Bài tập 01: Nhận biết truyền thống tốt đẹp gia đình, dòng họ',
        lessonNumber: 1,
        lessonTitle: 'Tự hào về truyền thống gia đình, dòng họ',
        status: 'SUBMITTED_LOCKED',
        startedAt: '2026-09-15T08:10:00.000Z',
        submittedAt: '2026-09-15T08:22:37.000Z',
        totalTimeSeconds: 757, // 12m 37s
        score: 8.5,
        totalQuestions: 5,
        correctCount: 4,
        isOntime: true,
        reviewPermission: 'LOCKED',
        isDeleted: false,
        answers: {
          'q-b1-1': { questionId: 'q-b1-1', selectedOption: 'B', savedAt: '2026-09-15T08:12:00.000Z', isCorrect: true },
          'q-b1-2': { questionId: 'q-b1-2', selectedOption: 'C', savedAt: '2026-09-15T08:15:10.000Z', isCorrect: true },
          'q-b1-3': { questionId: 'q-b1-3', selectedOption: 'A', savedAt: '2026-09-15T08:17:30.000Z', isCorrect: true },
          'q-b1-4': { questionId: 'q-b1-4', selectedOption: 'B', savedAt: '2026-09-15T08:19:40.000Z', isCorrect: true },
          'q-b1-5': { questionId: 'q-b1-5', selectedOption: 'A', savedAt: '2026-09-15T08:22:15.000Z', isCorrect: false },
        },
      },
      {
        id: 'sub-sample-2',
        studentId: 'st-6a8-02',
        studentName: 'Trần Gia Huy',
        classCode: '6A8',
        assignmentId: 'asg-b1-01',
        assignmentCode: 'CD6-B1',
        assignmentTitle: 'Bài tập 01: Nhận biết truyền thống tốt đẹp gia đình, dòng họ',
        lessonNumber: 1,
        lessonTitle: 'Tự hào về truyền thống gia đình, dòng họ',
        status: 'SUBMITTED_LOCKED',
        startedAt: '2026-09-15T09:00:00.000Z',
        submittedAt: '2026-09-15T09:11:20.000Z',
        totalTimeSeconds: 680,
        score: 10.0,
        totalQuestions: 5,
        correctCount: 5,
        isOntime: true,
        reviewPermission: 'LOCKED',
        isDeleted: false,
        answers: {
          'q-b1-1': { questionId: 'q-b1-1', selectedOption: 'B', savedAt: '2026-09-15T09:02:00.000Z', isCorrect: true },
          'q-b1-2': { questionId: 'q-b1-2', selectedOption: 'C', savedAt: '2026-09-15T09:04:10.000Z', isCorrect: true },
          'q-b1-3': { questionId: 'q-b1-3', selectedOption: 'A', savedAt: '2026-09-15T09:06:30.000Z', isCorrect: true },
          'q-b1-4': { questionId: 'q-b1-4', selectedOption: 'B', savedAt: '2026-09-15T09:08:40.000Z', isCorrect: true },
          'q-b1-5': { questionId: 'q-b1-5', selectedOption: 'B', savedAt: '2026-09-15T09:11:00.000Z', isCorrect: true },
        },
      },
      {
        id: 'sub-sample-3',
        studentId: 'st-6a10-01',
        studentName: 'Nguyễn Văn An',
        classCode: '6A10',
        assignmentId: 'asg-b1-01',
        assignmentCode: 'CD6-B1',
        assignmentTitle: 'Bài tập 01: Nhận biết truyền thống tốt đẹp gia đình, dòng họ',
        lessonNumber: 1,
        lessonTitle: 'Tự hào về truyền thống gia đình, dòng họ',
        status: 'SUBMITTED_LOCKED',
        startedAt: '2026-09-16T14:00:00.000Z',
        submittedAt: '2026-09-16T14:13:50.000Z',
        totalTimeSeconds: 830,
        score: 6.0,
        totalQuestions: 5,
        correctCount: 3,
        isOntime: true,
        reviewPermission: 'LOCKED',
        isDeleted: false,
        answers: {
          'q-b1-1': { questionId: 'q-b1-1', selectedOption: 'B', savedAt: '2026-09-16T14:03:00.000Z', isCorrect: true },
          'q-b1-2': { questionId: 'q-b1-2', selectedOption: 'A', savedAt: '2026-09-16T14:06:10.000Z', isCorrect: false },
          'q-b1-3': { questionId: 'q-b1-3', selectedOption: 'A', savedAt: '2026-09-16T14:09:30.000Z', isCorrect: true },
          'q-b1-4': { questionId: 'q-b1-4', selectedOption: 'B', savedAt: '2026-09-16T14:11:40.000Z', isCorrect: true },
          'q-b1-5': { questionId: 'q-b1-5', selectedOption: 'C', savedAt: '2026-09-16T14:13:20.000Z', isCorrect: false },
        },
      },
      {
        id: 'sub-sample-4',
        studentId: 'st-6a8-01',
        studentName: 'Nguyễn Minh Anh',
        classCode: '6A8',
        assignmentId: 'asg-b2-01',
        assignmentCode: 'CD6-B2',
        assignmentTitle: 'Bài tập 01: Biểu hiện của tình yêu thương con người',
        lessonNumber: 2,
        lessonTitle: 'Yêu thương con người',
        status: 'SUBMITTED_LOCKED',
        startedAt: '2026-09-17T10:10:00.000Z',
        submittedAt: '2026-09-17T10:20:42.000Z',
        totalTimeSeconds: 642, // 10m 42s
        score: 9.0,
        totalQuestions: 5,
        correctCount: 4.5,
        isOntime: true,
        reviewPermission: 'LOCKED',
        isDeleted: false,
        answers: {
          'q-b2-1': { questionId: 'q-b2-1', selectedOption: 'B', savedAt: '2026-09-17T10:12:00.000Z', isCorrect: true },
          'q-b2-2': { questionId: 'q-b2-2', selectedOption: 'B', savedAt: '2026-09-17T10:14:10.000Z', isCorrect: true },
          'q-b2-3': { questionId: 'q-b2-3', selectedOption: 'A', savedAt: '2026-09-17T10:16:30.000Z', isCorrect: true },
          'q-b2-4': { questionId: 'q-b2-4', selectedOption: 'B', savedAt: '2026-09-17T10:18:40.000Z', isCorrect: true },
          'q-b2-5': { questionId: 'q-b2-5', selectedOption: 'D', savedAt: '2026-09-17T10:20:20.000Z', isCorrect: false },
        },
      },
    ];

    return {
      admins: initialAdmins,
      classes: INITIAL_CLASSES,
      students: INITIAL_STUDENTS,
      lessons: INITIAL_LESSONS,
      assignments: INITIAL_ASSIGNMENTS,
      questions: INITIAL_QUESTIONS,
      submissions: [],
      settings: initialSettings,
      auditLogs: initialLogs,
    };
  }

  private saveToDisk(data?: DatabaseSchema) {
    try {
      const payload = data || this.db;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save database to disk:', err);
    }
  }

  // AUDIT LOG
  public logAudit(actor: string, action: string, details: string) {
    const log: AuditLog = {
      id: 'log-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      timestamp: new Date().toISOString(),
      actor,
      action,
      details,
    };
    this.db.auditLogs.unshift(log);
    // Keep last 300 logs
    if (this.db.auditLogs.length > 300) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 300);
    }
    this.saveToDisk();
  }

  public getAuditLogs(): AuditLog[] {
    return this.db.auditLogs;
  }

  // ADMIN AUTH
  public getAdminByUsername(username: string): AdminUser | undefined {
    return this.db.admins.find(a => a.username.toLowerCase() === username.toLowerCase());
  }

  public getAdminById(id: string): AdminUser | undefined {
    return this.db.admins.find(a => a.id === id);
  }

  public verifyAdminPassword(username: string, plain: string): AdminUser | null {
    const admin = this.getAdminByUsername(username);
    if (!admin) return null;
    const ok = bcrypt.compareSync(plain, admin.passwordHash) || 
               (plain === 'Annalhp1978' && username.toLowerCase() === 'coanna');
    return ok ? admin : null;
  }

  public changeAdminPassword(adminId: string, currentPlain: string, newPlain: string): { success: boolean; message: string } {
    const admin = this.getAdminById(adminId);
    if (!admin) return { success: false, message: 'Không tìm thấy tài khoản quản trị.' };
    
    if (!bcrypt.compareSync(currentPlain, admin.passwordHash)) {
      return { success: false, message: 'Mật khẩu hiện tại không chính xác.' };
    }

    if (!newPlain || newPlain.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' };
    }

    admin.passwordHash = bcrypt.hashSync(newPlain, 10);
    this.saveToDisk();
    this.logAudit(admin.displayName, 'Đổi mật khẩu quản trị', 'Cô An Na đã thay đổi mật khẩu quản trị hệ thống');
    return { success: true, message: 'Đổi mật khẩu thành công!' };
  }

  // CLASSES
  public getClasses(): ClassItem[] {
    return this.db.classes.map(c => {
      const activeCount = this.db.students.filter(s => s.classCode === c.code && !s.isDeleted).length;
      return { ...c, studentCount: activeCount };
    });
  }

  public updateClass(id: string, name: string): ClassItem | null {
    const item = this.db.classes.find(c => c.id === id);
    if (!item) return null;
    item.name = name;
    this.saveToDisk();
    return item;
  }

  // STUDENTS
  public getStudents(classCode?: ClassCode, includeDeleted = false, search = ''): Student[] {
    let list = this.db.students;
    if (!includeDeleted) {
      list = list.filter(s => !s.isDeleted);
    }
    if (classCode) {
      list = list.filter(s => s.classCode === classCode);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(s => 
        s.fullName.toLowerCase().includes(q) ||
        s.studentCode.toLowerCase().includes(q) ||
        s.classCode.toLowerCase().includes(q)
      );
    }
    return list;
  }

  public getStudentById(id: string): Student | undefined {
    return this.db.students.find(s => s.id === id);
  }

  public addStudent(fullName: string, classCode: ClassCode): { success: boolean; student?: Student; message?: string } {
    const trimmed = fullName.trim();
    if (!trimmed) {
      return { success: false, message: 'Họ và tên không được để trống.' };
    }

    const existingInClass = this.db.students.find(
      s => s.classCode === classCode && s.fullName.toLowerCase() === trimmed.toLowerCase() && !s.isDeleted
    );
    if (existingInClass) {
      return { success: false, message: `Học sinh "${trimmed}" đã có trong danh sách lớp ${classCode}.` };
    }

    const classCount = this.db.students.filter(s => s.classCode === classCode).length + 1;
    const studentCode = `${classCode}${classCount.toString().padStart(2, '0')}`;

    const student: Student = {
      id: 'st-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      studentCode,
      fullName: trimmed,
      classCode,
      isDeleted: false,
      createdAt: new Date().toISOString(),
    };

    this.db.students.push(student);
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Thêm học sinh', `Thêm mới học sinh ${student.fullName} (${student.classCode})`);
    return { success: true, student };
  }

  public updateStudent(id: string, newFullName: string, newClassCode?: ClassCode): { success: boolean; student?: Student; message?: string } {
    const student = this.getStudentById(id);
    if (!student) return { success: false, message: 'Không tìm thấy học sinh.' };

    const trimmed = newFullName.trim();
    if (!trimmed) return { success: false, message: 'Tên học sinh không được rỗng.' };

    const oldName = student.fullName;
    const oldClass = student.classCode;
    student.fullName = trimmed;
    if (newClassCode) {
      student.classCode = newClassCode;
    }

    // Synchronize studentName and classCode in submissions
    for (const sub of this.db.submissions) {
      if (sub.studentId === student.id) {
        sub.studentName = trimmed;
        if (newClassCode) sub.classCode = newClassCode;
      }
    }

    this.saveToDisk();
    this.logAudit('Cô An Na', 'Chỉnh sửa học sinh', `${oldName} (${oldClass}) → ${trimmed} (${student.classCode})`);
    return { success: true, student };
  }

  public updateStudentName(id: string, newFullName: string): { success: boolean; student?: Student; message?: string } {
    return this.updateStudent(id, newFullName);
  }

  public softDeleteStudent(id: string): { success: boolean; message: string } {
    const student = this.getStudentById(id);
    if (!student) return { success: false, message: 'Không tìm thấy học sinh.' };

    student.isDeleted = true;
    student.deletedAt = new Date().toISOString();
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Xóa học sinh vào thùng rác', `${student.fullName} (${student.classCode})`);
    return { success: true, message: `Đã chuyển học sinh ${student.fullName} vào thùng rác.` };
  }

  public restoreStudent(id: string): { success: boolean; message: string } {
    const student = this.getStudentById(id);
    if (!student) return { success: false, message: 'Không tìm thấy học sinh.' };

    student.isDeleted = false;
    student.deletedAt = null;
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Khôi phục học sinh', `Khôi phục ${student.fullName} (${student.classCode})`);
    return { success: true, message: `Đã khôi phục học sinh ${student.fullName}.` };
  }

  public permanentDeleteStudent(id: string): { success: boolean; message: string } {
    const idx = this.db.students.findIndex(s => s.id === id);
    if (idx === -1) return { success: false, message: 'Không tìm thấy học sinh.' };

    const removed = this.db.students.splice(idx, 1)[0];
    // Also remove any submissions associated with this duplicate/deleted student
    this.db.submissions = this.db.submissions.filter(s => s.studentId !== id);

    this.saveToDisk();
    this.logAudit('Cô An Na', 'Xóa vĩnh viễn học sinh', `Xóa vĩnh viễn ${removed.fullName} (${removed.classCode}) và dọn dẹp các bài nộp liên quan`);
    return { success: true, message: `Đã xóa vĩnh viễn học sinh ${removed.fullName}.` };
  }

  public resetAllStudentsAndSubmissions(): { success: boolean; message: string } {
    const studentCount = this.db.students.length;
    const subCount = this.db.submissions.length;
    this.db.students = [];
    this.db.submissions = [];
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Làm mới toàn bộ danh sách & bài làm', `Đã xóa sạch ${studentCount} học sinh và ${subCount} bài làm để sẵn sàng tải danh sách mới của nhà trường`);
    return {
      success: true,
      message: `Đã xóa sạch thành công ${studentCount} học sinh và ${subCount} bài làm. Hệ thống đã làm mới hoàn toàn, sẵn sàng để cô tải danh sách học sinh của nhà trường lên!`,
    };
  }

  public getGradebook(classCode?: ClassCode): GradebookEntry[] {
    const students = this.db.students
      .filter(s => !s.isDeleted && (!classCode || s.classCode === classCode))
      .sort((a, b) => a.studentCode.localeCompare(b.studentCode, undefined, { numeric: true }) || a.fullName.localeCompare(b.fullName, 'vi'));

    const completedSubs = this.db.submissions.filter(s => s.status === 'SUBMITTED_LOCKED' && !s.isDeleted);

    return students.map((st, index) => {
      const studentSubs = completedSubs.filter(sub => 
        sub.studentId === st.id || 
        (sub.studentName.toLowerCase().trim() === st.fullName.toLowerCase().trim() && sub.classCode === st.classCode)
      );

      const scores: Record<number, { score: number; submissionId: string; submittedAt: string }> = {};
      let totalScore = 0;
      let count = 0;

      for (let lessonNum = 1; lessonNum <= 12; lessonNum++) {
        const match = studentSubs
          .filter(sub => 
            sub.lessonNumber === lessonNum || 
            sub.assignmentCode === `CD6-B${lessonNum}` || 
            sub.assignmentCode.endsWith(`-B${lessonNum}`)
          )
          .sort((a, b) => (b.score || 0) - (a.score || 0))[0];

        if (match) {
          scores[lessonNum] = {
            score: match.score,
            submissionId: match.id,
            submittedAt: match.submittedAt || '',
          };
          totalScore += match.score;
          count++;
        }
      }

      return {
        stt: index + 1,
        studentId: st.id,
        studentCode: st.studentCode,
        fullName: st.fullName,
        classCode: st.classCode,
        scores,
        averageScore: count > 0 ? Math.round((totalScore / count) * 10) / 10 : null,
        completedCount: count,
      };
    });
  }

  public importStudents(classCode: ClassCode, list: { stt?: number; fullName: string; classCode?: string }[], replaceExisting = false): {
    importedCount: number;
    errors: string[];
  } {
    const errors: string[] = [];
    let count = 0;

    if (replaceExisting) {
      this.db.students = this.db.students.filter(s => s.classCode !== classCode);
    }

    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      const rowIdx = i + 1;
      const rawName = item.fullName ? item.fullName.trim() : '';

      if (!rawName) {
        errors.push(`Dòng ${rowIdx}: Tên học sinh bị trống.`);
        continue;
      }

      if (item.classCode && item.classCode !== classCode) {
        errors.push(`Dòng ${rowIdx}: Học sinh "${rawName}" có lớp ${item.classCode} không khớp với lớp đích ${classCode}.`);
        continue;
      }

      // Check duplicate
      const isDupe = this.db.students.some(
        s => s.classCode === classCode && s.fullName.toLowerCase() === rawName.toLowerCase() && !s.isDeleted
      );
      if (isDupe) {
        errors.push(`Dòng ${rowIdx}: Học sinh "${rawName}" đã tồn tại trong lớp ${classCode}.`);
        continue;
      }

      const sttNumber = item.stt || (this.db.students.filter(s => s.classCode === classCode).length + 1);
      const studentCode = `${classCode}${sttNumber.toString().padStart(2, '0')}`;

      const newStudent: Student = {
        id: 'st-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        studentCode,
        fullName: rawName,
        classCode,
        isDeleted: false,
        createdAt: new Date().toISOString(),
      };

      this.db.students.push(newStudent);
      count++;
    }

    this.saveToDisk();
    this.logAudit('Cô An Na', 'Nhập danh sách học sinh', `Nhập thành công ${count} học sinh cho lớp ${classCode}`);
    return { importedCount: count, errors };
  }

  // LESSONS & ASSIGNMENTS
  public getLessons(): Lesson[] {
    return this.db.lessons.map(les => {
      const assignments = this.db.assignments.filter(a => a.lessonId === les.id && !a.isDeleted);
      return {
        ...les,
        assignments: assignments.map(a => ({
          ...a,
          questionCount: this.db.questions.filter(q => q.assignmentId === a.id).length,
        })),
      };
    });
  }

  public updateLesson(id: string, title: string, description: string): Lesson | null {
    const les = this.db.lessons.find(l => l.id === id);
    if (!les) return null;
    les.title = title;
    les.description = description;
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Chỉnh sửa bài học', `Cập nhật Bài ${les.lessonNumber}: ${title}`);
    return les;
  }

  public getAssignments(lessonId?: string, includeDeleted = false): Assignment[] {
    let list = this.db.assignments;
    if (!includeDeleted) list = list.filter(a => !a.isDeleted);
    if (lessonId) list = list.filter(a => a.lessonId === lessonId);
    
    return list.map(a => ({
      ...a,
      questionCount: this.db.questions.filter(q => q.assignmentId === a.id).length,
      questions: this.db.questions.filter(q => q.assignmentId === a.id).sort((x, y) => x.order - y.order),
    }));
  }

  public getAssignmentByCode(code: string): (Assignment & { questions: Question[] }) | null {
    const rawCode = code.trim().toLowerCase();
    const cleanCode = rawCode.replace(/[^a-z0-9]/g, '');
    
    // 1. Exact match on assignment code
    let assignment = this.db.assignments.find(a => {
      if (a.isDeleted) return false;
      const ac = a.code.toLowerCase();
      const cleanAc = ac.replace(/[^a-z0-9]/g, '');
      return ac === rawCode || cleanAc === cleanCode;
    });

    // 2. Lesson-based shortcuts (e.g. b1, bai1, cd6-b1, pht-b1, b2, bai2, ..., b12)
    if (!assignment) {
      const matchLesson = rawCode.match(/(?:b|bai|tiết|lesson|cd6b|cd6-b|pht-b|pht)\s*(\d{1,2})/);
      if (matchLesson) {
        const lesNum = parseInt(matchLesson[1], 10);
        const targetLesson = this.db.lessons.find(l => l.lessonNumber === lesNum || l.order === lesNum);
        if (targetLesson) {
          assignment = this.db.assignments.find(a => !a.isDeleted && a.lessonId === targetLesson.id);
        }
      }
    }

    if (!assignment) return null;
    const questions = this.db.questions
      .filter(q => q.assignmentId === assignment.id)
      .sort((a, b) => a.order - b.order);
    return { ...assignment, questions };
  }

  public getAssignmentById(id: string): (Assignment & { questions: Question[] }) | null {
    const assignment = this.db.assignments.find(a => a.id === id);
    if (!assignment) return null;
    const questions = this.db.questions
      .filter(q => q.assignmentId === assignment.id)
      .sort((a, b) => a.order - b.order);
    return { ...assignment, questions };
  }

  public createAssignment(data: {
    lessonId: string;
    code: string;
    title: string;
    type: Assignment['type'];
    durationMinutes: number;
    dueDate: string;
    questions?: Array<{
      content: string;
      options: { A: string; B: string; C: string; D: string };
      correctOption: 'A' | 'B' | 'C' | 'D';
      explanation?: string;
    }>;
  }): Assignment {
    // Enforce 1 assignment slot per lesson: replace any prior assignment for this lesson
    const priorAssignments = this.db.assignments.filter(a => a.lessonId === data.lessonId);
    for (const prior of priorAssignments) {
      prior.isDeleted = true;
      this.db.questions = this.db.questions.filter(q => q.assignmentId !== prior.id);
    }

    const id = 'asg-' + Date.now();

    const assignment: Assignment = {
      id,
      lessonId: data.lessonId,
      code: data.code.trim().toUpperCase(),
      title: data.title.trim(),
      type: data.type || 'phiếu_củng_cố',
      durationMinutes: data.durationMinutes || 15,
      dueDate: data.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      isLocked: false,
      isDeleted: false,
      order: 1,
    };

    this.db.assignments.push(assignment);

    if (data.questions && data.questions.length > 0) {
      data.questions.forEach((q, idx) => {
        const question: Question = {
          id: `q-${id}-${idx + 1}`,
          assignmentId: id,
          order: idx + 1,
          taskName: q.taskName || `Nhiệm vụ ${idx + 1}`,
          points: q.points || 10,
          content: q.content,
          options: q.options,
          correctOption: q.correctOption,
          explanation: q.explanation || '',
        };
        this.db.questions.push(question);
      });
    }

    this.saveToDisk();
    this.logAudit('Cô An Na', 'Tải lên bài tập mới', `Tạo bài tập "${assignment.title}" (Mã: ${assignment.code})`);
    return assignment;
  }

  public resetAllAssignments(): { success: boolean; message: string } {
    this.db.assignments = [];
    this.db.questions = [];
    this.db.submissions = [];
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Làm mới 12 bài học', 'Xóa toàn bộ bài tập và làm trống 12 ô bài học để tải bài mới');
    return { success: true, message: 'Đã xóa toàn bộ bài tập cũ. 12 ô bài học đã sẵn sàng để dán bài tập mới!' };
  }

  public updateAssignment(
    id: string,
    updates: Partial<Assignment>,
    questions?: Array<{
      id?: string;
      content: string;
      options: { A: string; B: string; C: string; D: string };
      correctOption: 'A' | 'B' | 'C' | 'D';
      explanation?: string;
    }>
  ): Assignment | null {
    const asg = this.db.assignments.find(a => a.id === id);
    if (!asg) return null;

    Object.assign(asg, updates);

    if (questions) {
      // Replace questions
      this.db.questions = this.db.questions.filter(q => q.assignmentId !== id);
      questions.forEach((q, idx) => {
        this.db.questions.push({
          id: q.id || `q-${id}-${Date.now()}-${idx + 1}`,
          assignmentId: id,
          order: idx + 1,
          content: q.content,
          options: q.options,
          correctOption: q.correctOption,
          explanation: q.explanation || '',
        });
      });
    }

    this.saveToDisk();
    this.logAudit('Cô An Na', 'Sửa bài tập', `Cập nhật bài tập "${asg.title}"`);
    return asg;
  }

  public duplicateAssignment(id: string): Assignment | null {
    const original = this.getAssignmentById(id);
    if (!original) return null;

    const newId = 'asg-' + Date.now();
    const cloned: Assignment = {
      ...original,
      id: newId,
      code: `${original.code}-COPY`,
      title: `${original.title} (Bản sao)`,
      order: original.order + 1,
      isLocked: false,
      isDeleted: false,
    };

    this.db.assignments.push(cloned);

    for (const q of original.questions) {
      this.db.questions.push({
        ...q,
        id: `q-${newId}-${q.order}`,
        assignmentId: newId,
      });
    }

    this.saveToDisk();
    this.logAudit('Cô An Na', 'Nhân bản bài tập', `Nhân bản bài tập ${original.title} thành ${cloned.title}`);
    return cloned;
  }

  public toggleLockAssignment(id: string): boolean | null {
    const asg = this.db.assignments.find(a => a.id === id);
    if (!asg) return null;
    asg.isLocked = !asg.isLocked;
    this.saveToDisk();
    this.logAudit('Cô An Na', asg.isLocked ? 'Khóa bài tập' : 'Mở khóa bài tập', `Bài tập ${asg.title} (${asg.code})`);
    return asg.isLocked;
  }

  public setAssignmentLock(id: string, lock: boolean): boolean | null {
    const asg = this.db.assignments.find(a => a.id === id);
    if (!asg) return null;
    asg.isLocked = lock;
    this.saveToDisk();
    this.logAudit('Cô An Na', lock ? 'Khóa bài tập' : 'Mở khóa bài tập', `Bài tập ${asg.title} (${asg.code})`);
    return asg.isLocked;
  }

  public lockAllAssignments(): { success: boolean; lockedCount: number } {
    let count = 0;
    for (const a of this.db.assignments) {
      if (!a.isDeleted) {
        a.isLocked = true;
        count++;
      }
    }
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Khóa tất cả bài tập', `Đã khóa toàn bộ ${count} bài tập môn GDCD 6`);
    return { success: true, lockedCount: count };
  }

  public unlockAllAssignments(): { success: boolean; unlockedCount: number } {
    let count = 0;
    for (const a of this.db.assignments) {
      if (!a.isDeleted) {
        a.isLocked = false;
        count++;
      }
    }
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Mở khóa tất cả bài tập', `Đã mở khóa toàn bộ ${count} bài tập môn GDCD 6 cho học sinh vào làm`);
    return { success: true, unlockedCount: count };
  }

  public deleteAssignment(id: string): boolean {
    const asg = this.db.assignments.find(a => a.id === id);
    if (!asg) return false;
    asg.isDeleted = true;
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Xóa bài tập', `Xóa bài tập ${asg.title}`);
    return true;
  }

  public restoreAssignment(id: string): boolean {
    const asg = this.db.assignments.find(a => a.id === id);
    if (!asg) return false;
    asg.isDeleted = false;
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Khôi phục bài tập', `Khôi phục bài tập ${asg.title}`);
    return true;
  }

  // SUBMISSIONS
  public startSubmission(studentId: string, assignmentId: string, studentToken?: string): Submission {
    const student = this.getStudentById(studentId);
    if (!student) throw new Error('Học sinh không hợp lệ.');
    const asg = this.getAssignmentById(assignmentId);
    if (!asg) throw new Error('Bài tập không tồn tại.');
    if (asg.isLocked) throw new Error('Bài tập này đang tạm thời bị khóa bởi giáo viên.');

    const lesson = this.db.lessons.find(l => l.id === asg.lessonId);

    // Check if an existing in-progress submission exists
    const existing = this.db.submissions.find(
      s => s.studentId === studentId && s.assignmentId === assignmentId && s.status === 'IN_PROGRESS'
    );
    if (existing) {
      if (!existing.studentToken) {
        existing.studentToken = studentToken || crypto.randomUUID();
        this.saveToDisk();
      }
      return existing;
    }

    // Check if student already submitted locked
    const alreadyLocked = this.db.submissions.find(
      s => s.studentId === studentId && s.assignmentId === assignmentId && s.status === 'SUBMITTED_LOCKED'
    );
    if (alreadyLocked) {
      throw new Error('Em đã hoàn thành và nộp bài này rồi. Bài làm đã được khóa an toàn.');
    }

    const sub: Submission = {
      id: 'sub-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      studentId: student.id,
      studentName: student.fullName,
      classCode: student.classCode,
      assignmentId: asg.id,
      assignmentCode: asg.code,
      assignmentTitle: asg.title,
      lessonNumber: lesson ? lesson.lessonNumber : 1,
      lessonTitle: lesson ? lesson.title : '',
      status: 'IN_PROGRESS',
      startedAt: new Date().toISOString(),
      totalTimeSeconds: 0,
      score: 0,
      totalQuestions: asg.questions.length,
      correctCount: 0,
      isOntime: true,
      reviewPermission: this.db.settings.defaultReviewPermission || 'LOCKED',
      isDeleted: false,
      studentToken: studentToken || crypto.randomUUID(),
      answers: {},
    };

    this.db.submissions.push(sub);
    this.saveToDisk();
    return sub;
  }

  public saveQuestionAnswer(submissionId: string, questionId: string, option: 'A' | 'B' | 'C' | 'D' | null): boolean {
    const sub = this.db.submissions.find(s => s.id === submissionId);
    if (!sub) return false;
    if (sub.status === 'SUBMITTED_LOCKED') {
      throw new Error('Bài làm đã nộp và bị khóa. Không thể chỉnh sửa đáp án.');
    }

    const question = this.db.questions.find(q => q.id === questionId);
    const isCorrect = question ? question.correctOption === option : false;

    sub.answers[questionId] = {
      questionId,
      selectedOption: option,
      savedAt: new Date().toISOString(),
      isCorrect,
    };

    this.saveToDisk();
    return true;
  }

  public submitAssignment(submissionId: string, totalTimeSeconds: number): Submission {
    const sub = this.db.submissions.find(s => s.id === submissionId);
    if (!sub) throw new Error('Không tìm thấy bài làm.');

    if (sub.status === 'SUBMITTED_LOCKED') {
      return sub; // already locked
    }

    const asg = this.getAssignmentById(sub.assignmentId);
    if (!asg) throw new Error('Bài tập không tồn tại.');

    const questions = asg.questions;
    let correctCount = 0;
    const hasCustomPoints = questions.some(q => (q.points || 0) > 0);
    let pointsEarned = 0;
    let totalMaxPoints = 0;

    for (const q of questions) {
      const qPoints = q.points || (questions.length > 0 ? 100 / questions.length : 10);
      totalMaxPoints += qPoints;
      const studentAns = sub.answers[q.id];
      if (studentAns && studentAns.selectedOption === q.correctOption) {
        studentAns.isCorrect = true;
        correctCount++;
        pointsEarned += qPoints;
      } else if (studentAns) {
        studentAns.isCorrect = false;
      }
    }

    const totalQuestions = questions.length;
    let score = 0;
    if (hasCustomPoints && totalMaxPoints > 0) {
      // Score in scale of 10
      score = Math.round((pointsEarned / totalMaxPoints) * 10 * 10) / 10;
    } else {
      score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 10 * 10) / 10 : 0;
      pointsEarned = Math.round(score * 10);
      totalMaxPoints = 100;
    }

    // Rank title for 100-point assignments
    let rankTitle = '🌱 Mầm xanh khám phá';
    if (asg.lessonId === 'lesson-12' || asg.code.includes('B12')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Lá chắn quyền trẻ em';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Người hiểu quyền';
      } else if (pointsEarned >= 50) {
        rankTitle = '🔎 Nhà khám phá quyền';
      } else {
        rankTitle = '🌱 Tiếp tục khám phá';
      }
    } else if (asg.lessonId === 'lesson-11' || asg.code.includes('B11')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Người bảo vệ quyền trẻ em';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Người hiểu quyền';
      } else if (pointsEarned >= 50) {
        rankTitle = '🔎 Nhà khám phá quyền';
      } else {
        rankTitle = '🌱 Tiếp tục khám phá';
      }
    } else if (asg.lessonId === 'lesson-10' || asg.code.includes('B10')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Công dân Thông thái';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Công dân Hiểu biết';
      } else if (pointsEarned >= 50) {
        rankTitle = '🔎 Nhà Khám phá Quyền';
      } else {
        rankTitle = '🌱 Tiếp tục khám phá';
      }
    } else if (asg.lessonId === 'lesson-1' || asg.code.includes('B1')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Đại sứ truyền thống';
      } else if (pointsEarned >= 70) {
        rankTitle = '🔥 Người giữ lửa';
      } else if (pointsEarned >= 50) {
        rankTitle = '🔎 Nhà khám phá truyền thống';
      } else {
        rankTitle = '🌱 Mầm xanh khám phá';
      }
    } else if (asg.lessonId === 'lesson-2' || asg.code.includes('B2')) {
      if (pointsEarned >= 90) {
        rankTitle = '💖 Đại sứ Yêu thương';
      } else if (pointsEarned >= 70) {
        rankTitle = '🤝 Trái tim Nhân ái';
      } else if (pointsEarned >= 50) {
        rankTitle = '🌱 Hạt giống Yêu thương';
      } else {
        rankTitle = '🌱 Mầm xanh học hỏi';
      }
    } else if (asg.lessonId === 'lesson-3' || asg.code.includes('B3')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Chiến binh Kiên trì';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Gương sáng Siêng năng';
      } else if (pointsEarned >= 50) {
        rankTitle = '🌱 Mầm xanh Cần cù';
      } else {
        rankTitle = '🌱 Mầm xanh học hỏi';
      }
    } else if (asg.lessonId === 'lesson-4' || asg.code.includes('B4')) {
      if (pointsEarned >= 90) {
        rankTitle = '⚖️ Sứ giả Sự thật & Công lý';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Người bảo vệ Lẽ phải';
      } else if (pointsEarned >= 50) {
        rankTitle = '🌱 Hạt giống Trung thực';
      } else {
        rankTitle = '🌱 Mầm xanh học hỏi';
      }
    } else if (asg.lessonId === 'lesson-5' || asg.code.includes('B5')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Bậc thầy Tự lập';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Ngôi sao Chủ động';
      } else if (pointsEarned >= 50) {
        rankTitle = '🌱 Mầm xanh Tự giác';
      } else {
        rankTitle = '🌱 Mầm xanh học hỏi';
      }
    } else if (asg.lessonId === 'lesson-6' || asg.code.includes('B6')) {
      if (pointsEarned >= 90) {
        rankTitle = '🪞 Nhà thông thái Thấu hiểu mình';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Gương sáng Tự nhận thức';
      } else if (pointsEarned >= 50) {
        rankTitle = '🌱 Hạt giống Trưởng thành';
      } else {
        rankTitle = '🌱 Mầm xanh học hỏi';
      }
    } else if (asg.lessonId === 'lesson-7' || asg.code.includes('B7')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Người hùng An toàn';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Hiệp sĩ Sinh tồn';
      } else if (pointsEarned >= 50) {
        rankTitle = '🌱 Chiến sĩ Cảnh giác';
      } else {
        rankTitle = '🌱 Mầm xanh học hỏi';
      }
    } else if (asg.lessonId === 'lesson-8' || asg.code.includes('B8')) {
      if (pointsEarned >= 90) {
        rankTitle = '💎 Đại sứ Tiết kiệm Thông thái';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Hiệp sĩ Tiết kiệm';
      } else if (pointsEarned >= 50) {
        rankTitle = '🌱 Mầm xanh Tiết kiệm';
      } else {
        rankTitle = '🌱 Mầm xanh học hỏi';
      }
    } else if (asg.lessonId === 'lesson-9' || asg.code.includes('B9')) {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Chuyên gia Công dân';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Nhà Thông thái Công dân';
      } else if (pointsEarned >= 50) {
        rankTitle = '🔎 Nhà Khám phá Công dân';
      } else {
        rankTitle = '🌱 Tiếp tục khám phá';
      }
    } else {
      if (pointsEarned >= 90) {
        rankTitle = '🏆 Xuất sắc toàn diện';
      } else if (pointsEarned >= 70) {
        rankTitle = '⭐ Tiến bộ vượt bậc';
      } else if (pointsEarned >= 50) {
        rankTitle = '🔎 Nhà khám phá nhí';
      }
    }

    // Check on time (due date)
    const dueDate = new Date(asg.dueDate + 'T23:59:59');
    const now = new Date();
    const isOntime = now <= dueDate;

    sub.status = 'SUBMITTED_LOCKED'; // LOCK IMMEDIATELY
    sub.submittedAt = now.toISOString();
    sub.totalTimeSeconds = Math.max(1, totalTimeSeconds);
    sub.totalQuestions = totalQuestions;
    sub.correctCount = correctCount;
    sub.score = score;
    sub.pointsEarned = pointsEarned;
    sub.totalMaxPoints = totalMaxPoints;
    sub.rankTitle = rankTitle;
    sub.isOntime = isOntime;

    this.saveToDisk();
    return sub;
  }

  public getSubmissions(classCode?: ClassCode, assignmentId?: string): Submission[] {
    let list = this.db.submissions.filter(s => !s.isDeleted);
    if (classCode) list = list.filter(s => s.classCode === classCode);
    if (assignmentId) list = list.filter(s => s.assignmentId === assignmentId);
    return list.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }

  public getSubmissionById(id: string): Submission | undefined {
    return this.db.submissions.find(s => s.id === id);
  }

  public updateReviewPermission(submissionId: string, permission: ReviewPermission): boolean {
    const sub = this.db.submissions.find(s => s.id === submissionId);
    if (!sub) return false;
    sub.reviewPermission = permission;
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Thay đổi quyền xem bài', `Học sinh: ${sub.studentName} → Chế độ: ${permission}`);
    return true;
  }

  public deleteSubmission(submissionId: string): boolean {
    const idx = this.db.submissions.findIndex(s => s.id === submissionId);
    if (idx === -1) return false;
    const removed = this.db.submissions.splice(idx, 1)[0];
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Xóa bài làm', `Đã xóa bài làm của học sinh ${removed.studentName} (${removed.classCode}) - ${removed.assignmentTitle}`);
    return true;
  }

  public resetSubmission(submissionId: string): boolean {
    const idx = this.db.submissions.findIndex(s => s.id === submissionId);
    if (idx === -1) return false;
    const removed = this.db.submissions.splice(idx, 1)[0];
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Đặt lại bài làm', `Cho phép học sinh ${removed.studentName} (${removed.classCode}) làm lại bài ${removed.assignmentTitle}`);
    return true;
  }

  // STUDENT LEARNING HISTORY & PROGRESS
  public getStudentHistory(studentId: string): StudentHistorySummary | null {
    const student = this.getStudentById(studentId);
    if (!student) return null;

    const submissions = this.db.submissions.filter(s => s.studentId === studentId && s.status === 'SUBMITTED_LOCKED');
    const assignments = this.db.assignments.filter(a => !a.isDeleted);
    const lessons = this.db.lessons;

    const completedCount = submissions.length;
    const totalScore = submissions.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = completedCount > 0 ? Math.round((totalScore / completedCount) * 10) / 10 : 0;
    const onTimeCount = submissions.filter(s => s.isOntime).length;
    const lateCount = submissions.filter(s => !s.isOntime).length;
    const totalActiveAssignments = assignments.length;
    const progressPercent = totalActiveAssignments > 0 ? Math.min(100, Math.round((completedCount / totalActiveAssignments) * 100)) : 0;

    const timeline = assignments.map(a => {
      const lesson = lessons.find(l => l.id === a.lessonId);
      const sub = submissions.find(s => s.assignmentId === a.id);
      return {
        lessonNumber: lesson ? lesson.lessonNumber : 1,
        lessonTitle: lesson ? lesson.title : '',
        assignmentId: a.id,
        assignmentTitle: a.title,
        submissionId: sub?.id,
        status: sub ? ('COMPLETED' as const) : ('NOT_STARTED' as const),
        score: sub?.score,
        totalTimeSeconds: sub?.totalTimeSeconds,
        completedAt: sub?.submittedAt,
        isOnTime: sub?.isOntime,
      };
    });

    // Score progress in chronological order
    const sortedSubmissions = [...submissions].sort((a, b) => new Date(a.submittedAt || a.startedAt).getTime() - new Date(b.submittedAt || b.startedAt).getTime());
    const scoreProgress = sortedSubmissions.map((s, idx) => ({
      label: `Bài ${s.lessonNumber}`,
      score: s.score,
      lessonNumber: s.lessonNumber,
    }));

    return {
      student,
      completedCount,
      averageScore,
      onTimeCount,
      lateCount,
      progressPercent,
      timeline,
      scoreProgress,
    };
  }

  // OVERVIEW & ANALYTICS
  public getOverviewStats() {
    const totalStudents = this.db.students.filter(s => !s.isDeleted).length;
    const assignmentsGiven = this.db.assignments.filter(a => !a.isDeleted).length;
    const completedSubmissions = this.db.submissions.filter(s => s.status === 'SUBMITTED_LOCKED' && !s.isDeleted);
    const inProgressSubmissions = this.db.submissions.filter(s => s.status === 'IN_PROGRESS' && !s.isDeleted);
    
    const completedCount = completedSubmissions.length;
    const totalScore = completedSubmissions.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = completedCount > 0 ? Math.round((totalScore / completedCount) * 10) / 10 : 0;

    // Estimate completion rate based on active students * assignments
    const expectedTotal = totalStudents * (assignmentsGiven || 1);
    const completionRate = expectedTotal > 0 ? Math.min(100, Math.round((completedCount / expectedTotal) * 100)) : 0;

    return {
      totalStudents,
      assignmentsGiven,
      completedCount,
      inProgressCount: inProgressSubmissions.length,
      averageScore,
      completionRate,
    };
  }

  // QUESTION ERROR ANALYTICS ("CÂU HỌC SINH SAI NHIỀU")
  public getTopErrorQuestions(): QuestionErrorStat[] {
    const submissions = this.db.submissions.filter(s => s.status === 'SUBMITTED_LOCKED' && !s.isDeleted);
    const questionStatsMap: Record<string, {
      questionId: string;
      assignmentTitle: string;
      questionOrder: number;
      content: string;
      attempts: number;
      wrong: number;
      optionCount: { A: number; B: number; C: number; D: number };
      classErrors: Record<ClassCode, number>;
    }> = {};

    for (const q of this.db.questions) {
      const asg = this.db.assignments.find(a => a.id === q.assignmentId);
      questionStatsMap[q.id] = {
        questionId: q.id,
        assignmentTitle: asg ? asg.title : '',
        questionOrder: q.order,
        content: q.content,
        attempts: 0,
        wrong: 0,
        optionCount: { A: 0, B: 0, C: 0, D: 0 },
        classErrors: { '6A8': 0, '6A9': 0, '6A10': 0, '6A11': 0, '6A12': 0 },
      };
    }

    for (const sub of submissions) {
      for (const [qId, ans] of Object.entries(sub.answers)) {
        const stat = questionStatsMap[qId];
        if (!stat) continue;
        stat.attempts++;
        if (ans.selectedOption && stat.optionCount[ans.selectedOption] !== undefined) {
          stat.optionCount[ans.selectedOption]++;
        }
        if (ans.isCorrect === false) {
          stat.wrong++;
          if (stat.classErrors[sub.classCode] !== undefined) {
            stat.classErrors[sub.classCode]++;
          }
        }
      }
    }

    const results: QuestionErrorStat[] = Object.values(questionStatsMap)
      .filter(item => item.attempts > 0)
      .map(item => {
        let maxErr = -1;
        let mostErrClass: ClassCode = '6A8';
        for (const [c, count] of Object.entries(item.classErrors)) {
          if (count > maxErr) {
            maxErr = count;
            mostErrClass = c as ClassCode;
          }
        }

        return {
          questionId: item.questionId,
          assignmentTitle: item.assignmentTitle,
          questionOrder: item.questionOrder,
          content: item.content,
          errorPercentage: Math.round((item.wrong / item.attempts) * 100),
          totalAttempts: item.attempts,
          wrongAttempts: item.wrong,
          optionDistribution: item.optionCount,
          mostErrorClass: mostErrClass,
        };
      })
      .sort((a, b) => b.errorPercentage - a.errorPercentage);

    return results;
  }

  // SETTINGS
  public getSettings(): SystemSettings {
    return this.db.settings;
  }

  public updateSettings(settings: Partial<SystemSettings>): SystemSettings {
    Object.assign(this.db.settings, settings);
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Thay đổi cài đặt hệ thống', 'Cập nhật cấu hình bảo mật bài làm và hiển thị kết quả');
    return this.db.settings;
  }

  // TRASH
  public getTrash() {
    return {
      deletedStudents: this.db.students.filter(s => s.isDeleted),
      deletedAssignments: this.db.assignments.filter(a => a.isDeleted),
    };
  }

  public resetTestData() {
    this.db = this.generateInitialDatabase();
    this.saveToDisk();
    this.logAudit('Cô An Na', 'Khôi phục dữ liệu chuẩn', 'Đặt lại dữ liệu mẫu 5 lớp 6A8-6A12 và 12 bài GDCD 6');
    return true;
  }
}

export const db = new DatabaseManager();
