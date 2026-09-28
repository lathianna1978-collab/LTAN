import { Lesson, Question, Assignment } from '../types';

export const INITIAL_CLASSES = [
  { id: 'c-6a8', code: '6A8' as const, name: 'Lớp 6A8', color: 'border-purple-300 bg-purple-50 text-purple-700' },
  { id: 'c-6a9', code: '6A9' as const, name: 'Lớp 6A9', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { id: 'c-6a10', code: '6A10' as const, name: 'Lớp 6A10', color: 'border-cyan-300 bg-cyan-50 text-cyan-700' },
  { id: 'c-6a11', code: '6A11' as const, name: 'Lớp 6A11', color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  { id: 'c-6a12', code: '6A12' as const, name: 'Lớp 6A12', color: 'border-amber-300 bg-amber-50 text-amber-700' },
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-1',
    lessonNumber: 1,
    title: 'Tự hào về truyền thống gia đình, dòng họ',
    description: 'Tìm hiểu và gìn giữ những nét đẹp văn hóa, nghề truyền thống và tinh thần hiếu học của dòng họ.',
    icon: '🏠',
    color: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'lesson-2',
    lessonNumber: 2,
    title: 'Yêu thương con người',
    description: 'Biết quan tâm, giúp đỡ, sẻ chia với những người xung quanh lúc khó khăn, hoạn nạn.',
    icon: '💖',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'lesson-3',
    lessonNumber: 3,
    title: 'Siêng năng, kiên trì',
    description: 'Hình thành thói quen rèn luyện, không ngại khó khăn để vươn lên đạt thành tích tốt trong học tập.',
    icon: '🌱',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'lesson-4',
    lessonNumber: 4,
    title: 'Tôn trọng sự thật',
    description: 'Luôn trung thực, thẳng thắn, dũng cảm nhận lỗi và bảo vệ lẽ phải trong cuộc sống.',
    icon: '⚖️',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: 'lesson-5',
    lessonNumber: 5,
    title: 'Tự lập',
    description: 'Chủ động làm việc của mình, không ỷ lại hay trông chờ vào người khác.',
    icon: '🎒',
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: 'lesson-6',
    lessonNumber: 6,
    title: 'Tự nhận thức bản thân',
    description: 'Nhận biết điểm mạnh, điểm yếu của bản thân để không ngừng rèn luyện và hoàn thiện mình.',
    icon: '🪞',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'lesson-7',
    lessonNumber: 7,
    title: 'Ứng phó với tình huống nguy hiểm',
    description: 'Kỹ năng thoát hiểm khi gặp hỏa hoạn, đuối nước, thiên tai và phòng ngừa bắt cóc.',
    icon: '🛡️',
    color: 'from-red-500 to-rose-600',
  },
  {
    id: 'lesson-8',
    lessonNumber: 8,
    title: 'Tiết kiệm',
    description: 'Sử dụng hợp lý thời gian, tiền của, sức lực và nguồn tài nguyên thiên nhiên.',
    icon: '🪙',
    color: 'from-yellow-500 to-amber-600',
  },
  {
    id: 'lesson-9',
    lessonNumber: 9,
    title: 'Công dân nước Cộng hòa xã hội chủ nghĩa Việt Nam',
    description: 'Hiểu thế nào là công dân Việt Nam, căn cứ xác định công dân và lòng tự hào dân tộc.',
    icon: '⭐',
    color: 'from-red-600 to-amber-500',
  },
  {
    id: 'lesson-10',
    lessonNumber: 10,
    title: 'Quyền và nghĩa vụ cơ bản của công dân',
    description: 'Nắm rõ các quyền chính trị, dân sự, kinh tế, văn hóa - xã hội và nghĩa vụ tôn trọng pháp luật.',
    icon: '📜',
    color: 'from-sky-500 to-indigo-600',
  },
  {
    id: 'lesson-11',
    lessonNumber: 11,
    title: 'Quyền cơ bản của trẻ em',
    description: 'Nhóm quyền sống còn, quyền bảo vệ, quyền phát triển và quyền tham gia của trẻ em.',
    icon: '🧸',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    id: 'lesson-12',
    lessonNumber: 12,
    title: 'Thực hiện quyền trẻ em',
    description: 'Trách nhiệm của gia đình, nhà trường, xã hội và bản thân học sinh trong việc thực hiện quyền trẻ em.',
    icon: '🤝',
    color: 'from-pink-500 to-purple-600',
  },
];

// Empty assignment slots ready for teacher to paste/upload assignments per lesson
export const INITIAL_ASSIGNMENTS: Assignment[] = [];

// Empty question bank ready for teacher to paste/upload questions per lesson
export const INITIAL_QUESTIONS: Question[] = [];

export const INITIAL_STUDENTS = [
  // Class 6A8
  { id: 'st-6a8-01', studentCode: '6A801', fullName: 'Nguyễn Minh Anh', classCode: '6A8' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a8-02', studentCode: '6A802', fullName: 'Trần Gia Huy', classCode: '6A8' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a8-03', studentCode: '6A803', fullName: 'Lê Hoàng Nam', classCode: '6A8' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a8-04', studentCode: '6A804', fullName: 'Phạm Quỳnh Chi', classCode: '6A8' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a8-05', studentCode: '6A805', fullName: 'Vũ Đức Duy', classCode: '6A8' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },

  // Class 6A9
  { id: 'st-6a9-01', studentCode: '6A901', fullName: 'Đỗ Hải Đăng', classCode: '6A9' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a9-02', studentCode: '6A902', fullName: 'Hoàng Bảo Ngọc', classCode: '6A9' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a9-03', studentCode: '6A903', fullName: 'Bùi Tuấn Kiệt', classCode: '6A9' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },

  // Class 6A10
  { id: 'st-6a10-01', studentCode: '6A1001', fullName: 'Nguyễn Văn An', classCode: '6A10' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a10-02', studentCode: '6A1002', fullName: 'Mai Phương Thảo', classCode: '6A10' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a10-03', studentCode: '6A1003', fullName: 'Lý Quốc Bảo', classCode: '6A10' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a10-04', studentCode: '6A1004', fullName: 'Dương Thùy Linh', classCode: '6A10' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },

  // Class 6A11
  { id: 'st-6a11-01', studentCode: '6A1101', fullName: 'Hà Trọng Nhân', classCode: '6A11' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a11-02', studentCode: '6A1102', fullName: 'Phan Khánh Linh', classCode: '6A11' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },

  // Class 6A12
  { id: 'st-6a12-01', studentCode: '6A1201', fullName: 'Trịnh Tiến Dũng', classCode: '6A12' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
  { id: 'st-6a12-02', studentCode: '6A1202', fullName: 'Võ Ngọc Ánh', classCode: '6A12' as const, isDeleted: false, createdAt: '2026-09-01T08:00:00Z' },
];
