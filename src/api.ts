import {
  ClassCode,
  ClassItem,
  Student,
  Assignment,
  Lesson,
  Submission,
  SystemSettings,
  AuditLog,
  QuestionErrorStat,
  StudentHistorySummary,
  ReviewPermission,
  GradebookEntry
} from './types';

const TOKEN_KEY = 'gdcd6_coanna_token';
const STUDENT_TOKEN_KEY = 'gdcd6_student_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeAdminToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

export function getStudentToken(): string | null {
  return sessionStorage.getItem(STUDENT_TOKEN_KEY) || localStorage.getItem(STUDENT_TOKEN_KEY);
}

export function setStudentToken(token: string): void {
  sessionStorage.setItem(STUDENT_TOKEN_KEY, token);
  localStorage.setItem(STUDENT_TOKEN_KEY, token);
}

export function removeStudentToken(): void {
  sessionStorage.removeItem(STUDENT_TOKEN_KEY);
  localStorage.removeItem(STUDENT_TOKEN_KEY);
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const adminToken = getAdminToken();
  const studentToken = getStudentToken();
  const headers = new Headers(options.headers || {});
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (adminToken) {
    headers.set('Authorization', `Bearer ${adminToken}`);
  }

  if (studentToken) {
    headers.set('x-student-token', studentToken);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || data.error || `Yêu cầu thất bại (${response.status})`);
  }

  return data as T;
}

// AUTH API
export const apiAuth = {
  login: (username: string, password: string) =>
    request<{ token: string; user: any; welcomeMessage: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getMe: () => request<{ user: any }>('/api/auth/me'),
  logout: () =>
    request<{ success: boolean; message: string }>('/api/auth/logout', { method: 'POST' }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request<{ success: boolean; message: string }>('/api/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// STUDENT API
export const apiStudent = {
  getClasses: () => request<ClassItem[]>('/api/student/classes'),
  getActiveAssignments: () =>
    request<Array<{ id: string; code: string; title: string; type: string; durationMinutes: number; questionCount: number; isLocked?: boolean }>>(
      '/api/student/active-assignments'
    ),
  verifyAssignment: (code: string) =>
    request<{ id: string; code: string; title: string; durationMinutes: number; questionCount: number; dueDate: string }>(
      '/api/student/verify-assignment',
      {
        method: 'POST',
        body: JSON.stringify({ code }),
      }
    ),
  start: async (fullName: string, classCode: ClassCode, assignmentCode: string) => {
    const res = await request<{
      submissionId: string;
      studentToken?: string;
      student: Student;
      assignment: { id: string; code: string; title: string; durationMinutes: number; totalQuestions: number };
      savedAnswers: Record<string, { questionId: string; selectedOption: 'A' | 'B' | 'C' | 'D' | null; savedAt: string }>;
      questions: Array<{ id: string; order: number; content: string; options: { A: string; B: string; C: string; D: string } }>;
      startedAt: string;
    }>('/api/student/start', {
      method: 'POST',
      body: JSON.stringify({ fullName, classCode, assignmentCode }),
    });
    if (res.studentToken) {
      setStudentToken(res.studentToken);
    }
    return res;
  },
  saveAnswer: (submissionId: string, questionId: string, selectedOption: 'A' | 'B' | 'C' | 'D' | null) =>
    request<{ success: boolean; savedAt: string }>('/api/student/save-answer', {
      method: 'POST',
      body: JSON.stringify({ submissionId, questionId, selectedOption }),
    }),
  submit: (submissionId: string, totalTimeSeconds: number) =>
    request<{
      success: boolean;
      submissionId: string;
      status: string;
      score: number;
      totalQuestions: number;
      correctCount: number;
      totalTimeFormatted: string;
      submittedDate: string;
      isLocked: boolean;
      lockNotice: string;
    }>('/api/student/submit', {
      method: 'POST',
      body: JSON.stringify({ submissionId, totalTimeSeconds }),
    }),
  getSubmission: (id: string) =>
    request<{
      submissionId: string;
      studentName: string;
      classCode: ClassCode;
      assignmentTitle: string;
      status: string;
      score: number;
      totalTimeFormatted: string;
      submittedDate: string;
      reviewPermission: ReviewPermission;
      isLocked: boolean;
      lockNotice: string;
      questions?: any[];
    }>(`/api/student/submission/${id}`),
};

// ADMIN API
export const apiAdmin = {
  getOverview: () =>
    request<{
      stats: {
        totalStudents: number;
        assignmentsGiven: number;
        completedCount: number;
        inProgressCount: number;
        averageScore: number;
        completionRate: number;
      };
      topErrors: QuestionErrorStat[];
    }>('/api/admin/overview'),
  getClasses: () => request<ClassItem[]>('/api/admin/classes'),
  updateClass: (id: string, name: string) =>
    request<ClassItem>(`/api/admin/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  getStudents: (classCode?: ClassCode, includeDeleted = false, search = '') =>
    request<Student[]>(
      `/api/admin/students?${classCode ? `classCode=${classCode}&` : ''}includeDeleted=${includeDeleted}&search=${encodeURIComponent(
        search
      )}`
    ),
  addStudent: (fullName: string, classCode: ClassCode) =>
    request<Student>('/api/admin/students', {
      method: 'POST',
      body: JSON.stringify({ fullName, classCode }),
    }),
  updateStudent: (id: string, fullName: string, classCode?: ClassCode) =>
    request<Student>(`/api/admin/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ fullName, classCode }),
    }),
  deleteStudent: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/students/${id}`, {
      method: 'DELETE',
    }),
  restoreStudent: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/students/${id}/restore`, {
      method: 'POST',
    }),
  permanentDeleteStudent: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/students/${id}/permanent`, {
      method: 'DELETE',
    }),
  importStudents: (classCode: ClassCode, students: Array<{ stt?: number; fullName: string; classCode?: string }>, replaceExisting?: boolean) =>
    request<{ importedCount: number; errors: string[] }>('/api/admin/students/import', {
      method: 'POST',
      body: JSON.stringify({ classCode, students, replaceExisting }),
    }),
  resetStudentsAndSubmissions: () =>
    request<{ success: boolean; message: string }>('/api/admin/students/reset-all', {
      method: 'POST',
    }),
  getGradebook: (classCode?: ClassCode) =>
    request<GradebookEntry[]>(`/api/admin/gradebook${classCode ? `?classCode=${classCode}` : ''}`),
  getLessons: () => request<Lesson[]>('/api/admin/lessons'),
  updateLesson: (id: string, title: string, description: string) =>
    request<Lesson>(`/api/admin/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description }),
    }),
  getAssignments: (lessonId?: string) =>
    request<Assignment[]>(`/api/admin/assignments${lessonId ? `?lessonId=${lessonId}` : ''}`),
  getAssignmentById: (id: string) => request<Assignment>(`/api/admin/assignments/${id}`),
  createAssignment: (data: any) =>
    request<Assignment>('/api/admin/assignments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateAssignment: (id: string, data: any) =>
    request<Assignment>(`/api/admin/assignments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  duplicateAssignment: (id: string) =>
    request<Assignment>(`/api/admin/assignments/${id}/duplicate`, {
      method: 'POST',
    }),
  toggleLockAssignment: (id: string) =>
    request<{ isLocked: boolean }>(`/api/admin/assignments/${id}/toggle-lock`, {
      method: 'POST',
    }),
  lockAllAssignments: () =>
    request<{ success: boolean; lockedCount: number }>('/api/admin/assignments/lock-all', {
      method: 'POST',
    }),
  unlockAllAssignments: () =>
    request<{ success: boolean; unlockedCount: number }>('/api/admin/assignments/unlock-all', {
      method: 'POST',
    }),
  deleteAssignment: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/assignments/${id}`, {
      method: 'DELETE',
    }),
  resetAllAssignments: () =>
    request<{ success: boolean; message: string }>('/api/admin/assignments/reset-all', {
      method: 'POST',
    }),
  getSubmissions: (classCode?: ClassCode, assignmentId?: string) =>
    request<Submission[]>(
      `/api/admin/submissions?${classCode ? `classCode=${classCode}&` : ''}${assignmentId ? `assignmentId=${assignmentId}` : ''}`
    ),
  getSubmissionById: (id: string) =>
    request<{ submission: Submission; assignment: Assignment }>(`/api/admin/submissions/${id}`),
  updateReviewPermission: (id: string, permission: ReviewPermission) =>
    request<{ success: boolean; permission: ReviewPermission }>(`/api/admin/submissions/${id}/review-permission`, {
      method: 'PUT',
      body: JSON.stringify({ permission }),
    }),
  deleteSubmission: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/submissions/${id}`, {
      method: 'DELETE',
    }),
  resetSubmission: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/admin/submissions/${id}/reset`, {
      method: 'POST',
    }),
  getStudentHistory: (studentId: string) => request<StudentHistorySummary>(`/api/admin/students/${studentId}/history`),
  getAuditLogs: () => request<AuditLog[]>('/api/admin/audit-logs'),
  getSettings: () => request<SystemSettings>('/api/admin/settings'),
  updateSettings: (settings: Partial<SystemSettings>) =>
    request<SystemSettings>('/api/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    }),
  getTrash: () => request<{ deletedStudents: Student[]; deletedAssignments: Assignment[] }>('/api/admin/trash'),
  resetTestData: () => request<{ success: boolean; message: string }>('/api/admin/reset-test-data', { method: 'POST' }),
  
  // Excel export URLs
  getExportUrl: (classCode: ClassCode | 'ALL') => {
    return `/api/admin/export?classCode=${classCode}`;
  },
  getHistoryExportUrl: () => {
    return `/api/admin/export/history`;
  },
};
