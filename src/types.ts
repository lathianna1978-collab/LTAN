export type ClassCode = '6A8' | '6A9' | '6A10' | '6A11' | '6A12';

export interface ClassItem {
  id: string;
  code: ClassCode;
  name: string;
  color: string;
  studentCount?: number;
}

export interface Student {
  id: string;
  studentCode: string;
  fullName: string;
  classCode: ClassCode;
  isDeleted: boolean;
  createdAt: string;
  deletedAt?: string | null;
}

export interface Question {
  id: string;
  assignmentId?: string;
  order: number;
  taskName?: string; // e.g. "NHIỆM VỤ 1 — AI CÙNG BẢO VỆ EM?"
  points?: number; // e.g. 10, 15 (total 100)
  content: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption?: 'A' | 'B' | 'C' | 'D'; // Hidden from student until teacher allows
  explanation?: string;
}

export type AssignmentType = 'bài_tập' | 'luyện_tập' | 'tình_huống' | 'vận_dụng' | 'phiếu_củng_cố';

export interface Assignment {
  id: string;
  lessonId: string;
  code: string; // e.g. "CD6-B1-01"
  title: string;
  type: AssignmentType;
  durationMinutes: number;
  dueDate: string;
  isLocked: boolean;
  isDeleted: boolean;
  order: number;
  hideAnswersAfterSubmit?: boolean;
  questions?: Question[];
  questionCount?: number;
}

export interface Lesson {
  id: string;
  lessonNumber: number;
  order?: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  assignments?: Assignment[];
  assignmentCount?: number;
}

export interface GradebookEntry {
  stt: number;
  studentId: string;
  studentCode: string;
  fullName: string;
  classCode: ClassCode;
  scores: Record<number, { score: number; submissionId: string; submittedAt: string }>;
  averageScore: number | null;
  completedCount: number;
}

export type SubmissionStatus = 'IN_PROGRESS' | 'SUBMITTED_LOCKED';
export type ReviewPermission = 'LOCKED' | 'SCORE_ONLY' | 'QUESTIONS_NO_ANSWERS' | 'FULL_REVIEW';

export interface StudentAnswer {
  questionId: string;
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  savedAt: string;
  isCorrect?: boolean;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName: string;
  classCode: ClassCode;
  assignmentId: string;
  assignmentCode: string;
  assignmentTitle: string;
  lessonNumber: number;
  lessonTitle: string;
  status: SubmissionStatus;
  startedAt: string;
  submittedAt?: string;
  totalTimeSeconds: number;
  score: number; // Scale of 10, e.g. 8.5
  pointsEarned?: number; // Scale of 100, e.g. 85 / 100
  totalMaxPoints?: number; // e.g. 100
  rankTitle?: string; // e.g. "🏆 Lá chắn quyền trẻ em"
  totalQuestions: number;
  correctCount: number;
  isOntime: boolean;
  reviewPermission: ReviewPermission;
  isDeleted: boolean;
  studentToken?: string;
  answers: Record<string, StudentAnswer>; // questionId -> answer
}

export interface SystemSettings {
  appName: string;
  slogan: string;
  adminDisplayName: string;
  autoLockAfterSubmit?: boolean;
  lockImmediatelyOnSubmit: boolean;
  showScoreAfterSubmit: boolean;
  showScoreImmediately?: boolean;
  showTimeAfterSubmit: boolean;
  showCorrectCountAfterSubmit: boolean;
  showAnswersAfterSubmit: boolean;
  hideAnswersByDefault?: boolean;
  allowStudentReview: boolean;
  defaultReviewPermission: ReviewPermission;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor?: string;
  performedBy?: string;
  action: string;
  details: string;
}

export interface StudentHistorySummary {
  student: Student;
  completedCount: number;
  averageScore: number;
  onTimeCount: number;
  lateCount: number;
  progressPercent: number;
  stats?: {
    completedCount: number;
    averageScore: number;
    onTimeCount: number;
    lateCount: number;
    progressPercent: number;
  };
  timeline: {
    lessonNumber: number;
    lessonTitle: string;
    assignmentId: string;
    assignmentTitle: string;
    assignmentCode?: string;
    submissionId?: string;
    status: 'COMPLETED' | 'NOT_STARTED' | 'IN_PROGRESS' | 'DONE' | 'NOT_DONE' | 'LATE';
    score?: number;
    totalTimeSeconds?: number;
    completedAt?: string;
    completedDate?: string;
    isOnTime?: boolean;
    isLate?: boolean;
    dueDate?: string;
  }[];
  scoreProgress: {
    label: string;
    score: number;
    lessonNumber: number;
    assignmentTitle?: string;
  }[];
  progressPoints?: {
    label: string;
    score: number;
    assignmentTitle: string;
  }[];
}

export interface QuestionErrorStat {
  questionId: string;
  assignmentTitle: string;
  questionOrder: number;
  content: string;
  errorPercentage: number;
  wrongRate?: number;
  totalAttempts: number;
  totalResponses?: number;
  wrongAttempts: number;
  optionDistribution: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  distribution?: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  mostErrorClass: ClassCode;
  worstClass?: ClassCode | string;
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption?: 'A' | 'B' | 'C' | 'D';
  explanation?: string;
}
