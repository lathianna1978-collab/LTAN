import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FolderOpen,
  Edit3,
  Plus,
  Lock,
  Unlock,
  Trash2,
  Eye,
  FileText,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  Laptop,
  ArrowRight,
  ClipboardPaste,
} from 'lucide-react';
import { Lesson, Assignment } from '../../types';
import { apiAdmin } from '../../api';
import { parseAssignmentText } from '../../utils/assignmentParser';

interface LessonJourneyProps {
  lessons: Lesson[];
  onOpenAssignmentEditor: (lessonId: string, assignment?: Assignment) => void;
  onPreviewAssignment: (assignment: Assignment) => void;
  onOpenSmartImport?: (lessonId: string) => void;
}

export const LessonJourney: React.FC<LessonJourneyProps> = ({
  lessons,
  onOpenAssignmentEditor,
  onPreviewAssignment,
  onOpenSmartImport,
}) => {
  // Store all assignments mapped by lessonId (strictly 1 assignment per lesson)
  const [assignmentsByLesson, setAssignmentsByLesson] = useState<Record<string, Assignment>>({});
  const [loading, setLoading] = useState(true);

  // Edit Lesson title modal
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');

  // Inline Quick Paste state: which lesson card has inline paste open
  const [quickPasteLessonId, setQuickPasteLessonId] = useState<string | null>(null);
  const [quickPasteText, setQuickPasteText] = useState('');
  const [quickPasteLoading, setQuickPasteLoading] = useState(false);

  // Reset all modal state
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchAllAssignments = async () => {
    setLoading(true);
    try {
      const allAsg = await apiAdmin.getAssignments();
      const map: Record<string, Assignment> = {};
      for (const asg of allAsg) {
        if (!asg.isDeleted) {
          // Keep active assignment for each lesson
          map[asg.lessonId] = asg;
        }
      }
      setAssignmentsByLesson(map);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài tập:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllAssignments();
  }, []);

  const handleToggleLock = async (asgId: string) => {
    try {
      const res = await apiAdmin.toggleLockAssignment(asgId);
      // Update state
      setAssignmentsByLesson((prev) => {
        const updated = { ...prev };
        for (const lesId of Object.keys(updated)) {
          if (updated[lesId]?.id === asgId) {
            updated[lesId] = { ...updated[lesId], isLocked: res.isLocked };
          }
        }
        return updated;
      });
    } catch (err: any) {
      alert(err.message || 'Lỗi khi khóa/mở khóa bài tập');
    }
  };

  const handleLockAll = async () => {
    if (!confirm('Cô có chắc chắn muốn KHÓA TẤT CẢ 12 bài tập không?\n\nSau khi khóa, học sinh sẽ KHÔNG THỂ vào làm bất kỳ bài nào cho đến khi cô bấm mở.')) {
      return;
    }
    try {
      await apiAdmin.lockAllAssignments();
      await fetchAllAssignments();
      alert('🔒 Đã KHÓA toàn bộ 12 bài tập! Học sinh sẽ bị chặn không thể vào làm bài.');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi khóa tất cả bài tập');
    }
  };

  const handleUnlockAll = async () => {
    if (!confirm('Cô có muốn MỞ KHÓA TẤT CẢ 12 bài tập không?\n\nHọc sinh các lớp sẽ có thể chọn và làm bài ngay lập tức.')) {
      return;
    }
    try {
      await apiAdmin.unlockAllAssignments();
      await fetchAllAssignments();
      alert('🔓 Đã MỞ KHÓA toàn bộ 12 bài tập! Học sinh hiện đã có thể vào làm bài.');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi mở khóa tất cả bài tập');
    }
  };

  const handleDeleteAssignment = async (asgId: string, lessonOrder: number) => {
    if (!confirm(`Cô có chắc chắn muốn xóa bài tập của BÀI ${lessonOrder} để làm trống ô dán bài mới?`)) {
      return;
    }
    try {
      await apiAdmin.deleteAssignment(asgId);
      fetchAllAssignments();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa bài tập');
    }
  };

  const handleResetAllAssignments = async () => {
    setResetting(true);
    try {
      await apiAdmin.resetAllAssignments();
      setShowResetConfirm(false);
      await fetchAllAssignments();
      alert('🎉 Đã xóa sạch toàn bộ bài tập có sẵn. 12 ô bài học đã sẵn sàng để cô dán bài tập mới!');
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa toàn bộ bài tập');
    } finally {
      setResetting(false);
    }
  };

  const handleQuickPasteSubmit = async (lesson: Lesson) => {
    if (!quickPasteText.trim()) {
      alert('Vui lòng dán nội dung bài tập vào ô trước khi nhấn Tải lên!');
      return;
    }

    setQuickPasteLoading(true);
    try {
      const parsed = parseAssignmentText(quickPasteText, lesson.id, lessons);
      if (parsed.questions.length === 0) {
        alert('Không tìm thấy câu hỏi nào trong nội dung dán vào. Vui lòng kiểm tra lại văn bản đề bài.');
        setQuickPasteLoading(false);
        return;
      }

      await apiAdmin.createAssignment({
        title: parsed.title,
        code: `CD6-B${lesson.order}`,
        lessonId: lesson.id,
        durationMinutes: parsed.durationMinutes || 15,
        type: parsed.type || 'phiếu_củng_cố',
        isLocked: false,
        questions: parsed.questions,
      });

      setQuickPasteLessonId(null);
      setQuickPasteText('');
      await fetchAllAssignments();
      alert(`🎉 Đã tải lên và tạo bài tập cho BÀI ${lesson.order} thành công! Học sinh có thể làm ngay bằng mã CD6-B${lesson.order}.`);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xử lý và lưu bài tập');
    } finally {
      setQuickPasteLoading(false);
    }
  };

  const handleSaveLesson = async () => {
    if (!editingLesson || !editTitle.trim()) return;
    try {
      await apiAdmin.updateLesson(editingLesson.id, editTitle.trim(), editDesc.trim());
      setEditingLesson(null);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu bài học');
    }
  };

  // Count how many lessons have assignments
  const filledCount = Object.keys(assignmentsByLesson).length;
  const lockedCount = Object.values(assignmentsByLesson).filter((a) => a.isLocked).length;
  const unlockedCount = filledCount - lockedCount;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* HEADER BANNER */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-purple-100 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black mb-2">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>12 BÀI HỌC GDCD 6 • MỖI BÀI 1 Ô DÁN BÀI TẬP</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
              📚 12 Ô BÀI TẬP THEO TỪNG BÀI HỌC
            </h2>
            <p className="text-sm font-semibold text-slate-500 mt-1">
              Mỗi bài chỉ có đúng 1 ô bài tập. Cô chỉ cần dán đề bài từ Word, Zalo, hệ thống sẽ tự động phân loại nhiệm vụ cho học sinh làm trực tiếp trên điện thoại & máy tính!
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-4 py-2 rounded-2xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-black flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-purple-600" />
              <span>ĐÃ CÓ ĐỀ: {filledCount}/12 BÀI</span>
            </div>

            <button
              type="button"
              id="btn-smart-import-global"
              onClick={() => onOpenSmartImport && onOpenSmartImport('lesson-1')}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>📋 DÁN BÀI TẬP (TỰ ĐỘNG NHẬN DIỆN BÀI)</span>
            </button>

            <button
              type="button"
              id="btn-reset-all-assignments"
              onClick={() => setShowResetConfirm(true)}
              className="py-3 px-4 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xóa toàn bộ bài tập để làm mới 12 ô"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Xóa hết để tải mới</span>
            </button>
          </div>
        </div>
      </div>

      {/* 🔐 BẢNG ĐIỀU KHIỂN KHÓA - MỞ TOÀN BỘ BÀI TẬP */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-purple-800 flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔐</span>
            <h3 className="text-lg font-black tracking-tight uppercase">
              BẢNG ĐIỀU KHIỂN KHÓA - MỞ BÀI TẬP
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
              GDCD 6
            </span>
          </div>
          <p className="text-xs sm:text-sm text-purple-200 font-medium">
            Chỉ khi <strong>Cô An Na mở khóa</strong> thì học sinh mới được phép vào làm bài. Cô có thể khóa/mở riêng từng bài hoặc chọn thao tác nhanh cho toàn bộ khối 6 bên dưới:
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 text-emerald-300 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/40">
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Đang MỞ cho học sinh làm: {unlockedCount} / {filledCount} bài</span>
            </span>
            <span className="inline-flex items-center gap-1.5 text-rose-300 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/40">
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>Đang KHÓA (chặn học sinh): {lockedCount} / {filledCount} bài</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 shrink-0 w-full md:w-auto">
          <button
            type="button"
            onClick={handleLockAll}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all border border-rose-400"
            title="Khóa toàn bộ 12 bài, học sinh sẽ không thể bấm làm bài"
          >
            <Lock className="w-4 h-4" />
            <span>🔒 KHÓA TẤT CẢ 12 BÀI</span>
          </button>
          <button
            type="button"
            onClick={handleUnlockAll}
            className="w-full sm:w-auto py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all border border-emerald-400"
            title="Mở toàn bộ 12 bài cho học sinh vào làm bài"
          >
            <Unlock className="w-4 h-4" />
            <span>🔓 MỞ TẤT CẢ 12 BÀI</span>
          </button>
        </div>
      </div>

      {/* 12 LESSONS GRID */}
      {loading ? (
        <div className="text-center py-16 font-bold text-slate-400">
          <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <span>Đang tải 12 ô bài tập...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {lessons.map((ls) => {
            const lessonNumber = ls.lessonNumber || ls.order || 1;
            const assignment = assignmentsByLesson[ls.id];
            const isFilled = !!assignment;
            const standardCode = `CD6-B${lessonNumber}`;
            const isQuickPasteOpen = quickPasteLessonId === ls.id;

            return (
              <div
                key={ls.id}
                className={`rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                  isFilled
                    ? 'bg-white border-purple-200 shadow-soft hover:shadow-card-hover'
                    : 'bg-white/80 border-dashed border-slate-300 hover:border-purple-300 hover:bg-white shadow-2xs'
                }`}
              >
                {/* LESSON CARD HEADER */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {lessonNumber}
                      </span>
                      <div>
                        <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider block">
                          BÀI {lessonNumber} • GDCD 6
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-500">
                          Mã chuẩn: <strong className="text-purple-700">{standardCode}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {isFilled ? (
                        <span className="text-[11px] font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Đã có bài</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                          Ô trống
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingLesson(ls);
                          setEditTitle(ls.title);
                          setEditDesc(ls.description || '');
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Sửa tên bài học"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-800 mb-1 leading-snug line-clamp-2">
                    {ls.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium line-clamp-1 mb-4">
                    {ls.description || 'Chủ đề rèn luyện nhân cách, phẩm chất công dân.'}
                  </p>
                </div>

                {/* THE SINGLE DEDICATED ASSIGNMENT SLOT */}
                <div className="mt-2">
                  {isFilled ? (
                    /* CASE 1: LESSON ALREADY HAS ITS 1 ASSIGNMENT */
                    <div className="rounded-2xl p-4 bg-gradient-to-br from-purple-50/70 via-indigo-50/40 to-slate-50 border border-purple-200">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono text-xs font-black px-2.5 py-1 rounded-xl bg-purple-600 text-white shadow-2xs">
                          🔑 {assignment.code}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            assignment.isLocked
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {assignment.isLocked ? (
                            <>
                              <Lock className="w-3 h-3" /> Đang khóa
                            </>
                          ) : (
                            <>
                              <Unlock className="w-3 h-3" /> Đang mở
                            </>
                          )}
                        </span>
                      </div>

                      {/* PROMINENT 1-CLICK LOCK / UNLOCK TOGGLE BUTTON */}
                      <div className="mb-3">
                        <button
                          type="button"
                          onClick={() => handleToggleLock(assignment.id)}
                          className={`w-full py-2.5 px-3 rounded-2xl font-black text-xs flex items-center justify-between shadow-xs transition-all cursor-pointer ${
                            assignment.isLocked
                              ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                          }`}
                          title={assignment.isLocked ? 'Bấm để MỞ KHÓA cho học sinh vào làm' : 'Bấm để KHÓA LẠI (chặn học sinh)'}
                        >
                          <span className="flex items-center gap-1.5">
                            {assignment.isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            <span>{assignment.isLocked ? '🔒 ĐANG KHÓA (HS không vào được)' : '🟢 ĐANG MỞ (HS được vào làm)'}</span>
                          </span>
                          <span className="text-[10px] bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-lg uppercase tracking-wider font-extrabold">
                            {assignment.isLocked ? 'Bấm để Mở ➔' : 'Bấm để Khóa ✕'}
                          </span>
                        </button>
                      </div>

                      <h4 className="text-sm font-black text-slate-800 mb-2 line-clamp-2 leading-snug">
                        {assignment.title}
                      </h4>

                      <div className="flex items-center gap-3 text-xs font-bold text-slate-600 mb-3.5">
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-purple-600" />
                          {assignment.questionCount || assignment.questions?.length || 0} nhiệm vụ
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          {assignment.durationMinutes} phút
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="grid grid-cols-2 gap-1.5 pt-2.5 border-t border-purple-100 text-xs font-black">
                        <button
                          type="button"
                          onClick={() => onPreviewAssignment(assignment)}
                          className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
                          title="Xem thử giao diện học sinh trên máy tính & điện thoại"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Xem thử (HS)</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenSmartImport && onOpenSmartImport(ls.id)}
                          className="py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
                          title="Dán bài mới đè lên ô này"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Dán bài mới</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => onOpenAssignmentEditor(ls.id, assignment)}
                          className="py-1.5 px-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Chỉnh sửa chi tiết"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                          <span>Sửa câu hỏi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteAssignment(assignment.id, lessonNumber)}
                          className="py-1.5 px-2 rounded-xl bg-white border border-rose-200 hover:bg-rose-50 text-rose-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                          title="Xóa bài tập này để ô trống"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                          <span>Xóa ô này</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* CASE 2: EMPTY SLOT READY FOR TEACHER TO PASTE ASSIGNMENT */
                    <div className="rounded-2xl p-4 bg-slate-50/80 border-2 border-dashed border-purple-200 text-center flex flex-col justify-between min-h-[180px]">
                      {isQuickPasteOpen ? (
                        /* Quick inline paste expander */
                        <div className="space-y-2 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-purple-700 flex items-center gap-1">
                              <ClipboardPaste className="w-3.5 h-3.5" />
                              <span>DÁN ĐỀ BÀI VÀO BÀI {lessonNumber}</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setQuickPasteLessonId(null);
                                setQuickPasteText('');
                              }}
                              className="text-xs font-bold text-slate-400 hover:text-slate-600"
                            >
                              ✕ Đóng
                            </button>
                          </div>

                          <textarea
                            value={quickPasteText}
                            onChange={(e) => setQuickPasteText(e.target.value)}
                            placeholder="Dán nội dung bài tập từ Word/Zalo vào đây..."
                            rows={4}
                            className="w-full p-2.5 rounded-xl border border-purple-300 bg-white font-mono text-xs focus:ring-2 focus:ring-purple-200 outline-hidden"
                            autoFocus
                          />

                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setQuickPasteLessonId(null);
                                setQuickPasteText('');
                              }}
                              className="py-1.5 px-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                            >
                              Hủy
                            </button>
                            <button
                              type="button"
                              disabled={quickPasteLoading}
                              onClick={() => handleQuickPasteSubmit(ls)}
                              className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs flex items-center gap-1.5"
                            >
                              {quickPasteLoading ? 'Đang phân loại...' : '🚀 Tải lên ngay'}
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Default empty state */
                        <>
                          <div>
                            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl mx-auto mb-2">
                              📋
                            </div>
                            <h4 className="text-xs font-black text-purple-900 uppercase tracking-wide mb-1">
                              Ô DÁN BÀI TẬP BÀI {lessonNumber}
                            </h4>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-3">
                              Chưa có bài tập. Dán văn bản để hệ thống tự động phân loại trắc nghiệm, kéo thả, nối cột!
                            </p>
                          </div>

                          <div className="space-y-1.5">
                            <button
                              type="button"
                              id={`btn-open-smart-import-${ls.id}`}
                              onClick={() => onOpenSmartImport && onOpenSmartImport(ls.id)}
                              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                              <span>📋 DÁN BÀI TẬP VÀO ĐÂY</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setQuickPasteLessonId(ls.id);
                                setQuickPasteText('');
                              }}
                              className="w-full py-1.5 px-3 rounded-xl bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                            >
                              <span>Dán nhanh trực tiếp</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRM RESET ALL MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-rose-100">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center text-2xl mx-auto mb-3">
              🗑️
            </div>

            <h3 className="text-xl font-black text-slate-800 text-center mb-2">
              XÓA TOÀN BỘ BÀI TẬP ĐỂ TẢI BÀI MỚI?
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 text-center font-medium leading-relaxed mb-6">
              Hành động này sẽ xóa tất cả các bài tập cũ và làm trống 12 ô bài học để cô có thể dán nội dung bài tập mới vào từ đầu.
            </p>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={resetting}
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 font-bold text-xs sm:text-sm text-slate-700 cursor-pointer"
              >
                HỦY
              </button>

              <button
                type="button"
                disabled={resetting}
                onClick={handleResetAllAssignments}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {resetting ? (
                  <span>ĐANG XÓA...</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>XÁC NHẬN XÓA HẾT</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT LESSON TITLE MODAL */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100">
            <h3 className="text-lg font-black text-slate-800 mb-4">
              ✏️ SỬA TÊN BÀI {editingLesson.lessonNumber || editingLesson.order || 1}
            </h3>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Tên bài học
                </label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 outline-hidden font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Mô tả bài học
                </label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 outline-hidden text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingLesson(null)}
                className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-600"
              >
                HỦY
              </button>
              <button
                type="button"
                onClick={handleSaveLesson}
                className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-xs"
              >
                💾 LƯU THAY ĐỔI
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
