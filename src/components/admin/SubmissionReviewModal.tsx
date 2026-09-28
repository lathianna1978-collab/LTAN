import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, CheckCircle2, XCircle, Clock, Calendar, Lock, Unlock, Eye, Star, User, Trash2, RotateCcw } from 'lucide-react';
import { Submission, Assignment, ReviewPermission } from '../../types';
import { apiAdmin } from '../../api';

interface SubmissionReviewModalProps {
  submissionId: string | null;
  onClose: () => void;
  onRefresh?: () => void;
}

export const SubmissionReviewModal: React.FC<SubmissionReviewModalProps> = ({
  submissionId,
  onClose,
  onRefresh,
}) => {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [currentPermission, setCurrentPermission] = useState<ReviewPermission>('LOCKED');
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (submissionId) {
      setLoading(true);
      apiAdmin.getSubmissionById(submissionId)
        .then((res) => {
          setSubmission(res.submission);
          setAssignment(res.assignment);
          setCurrentPermission(res.submission.reviewPermission || 'LOCKED');
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [submissionId]);

  if (!submissionId) return null;

  const handleUpdatePermission = async (perm: ReviewPermission) => {
    setCurrentPermission(perm);
    try {
      await apiAdmin.updateReviewPermission(submissionId, perm);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
      if (onRefresh) onRefresh();
    } catch (err: any) {
      alert(err.message || 'Không thể cập nhật quyền xem lại');
    }
  };

  const handleDeleteSubmission = async () => {
    if (!submission) return;
    const ok = window.confirm(`Cô có chắc chắn muốn XÓA bài làm này của học sinh "${submission.studentName}" (Lớp ${submission.classCode}) không?\n\nThao tác này dùng khi học sinh bị trùng tên hoặc nộp sai thông tin.`);
    if (!ok) return;

    try {
      await apiAdmin.deleteSubmission(submission.id);
      alert('Đã xóa bài làm thành công!');
      if (onRefresh) onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Không thể xóa bài làm');
    }
  };

  const handleResetSubmission = async () => {
    if (!submission) return;
    const ok = window.confirm(`Cô có muốn ĐẶT LẠI bài làm để học sinh "${submission.studentName}" (Lớp ${submission.classCode}) có thể đăng nhập LÀM LẠI bài này không?`);
    if (!ok) return;

    try {
      await apiAdmin.resetSubmission(submission.id);
      alert('Đã đặt lại bài làm thành công! Học sinh có thể làm lại bài mới.');
      if (onRefresh) onRefresh();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Không thể đặt lại bài làm');
    }
  };

  const formatDuration = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins} phút ${secs.toString().padStart(2, '0')} giây`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-black text-slate-800">
              CHI TIẾT BÀI LÀM HỌC SINH
            </h2>
          </div>
          <p className="text-xs font-bold text-slate-500">
            Dữ liệu đã khóa an toàn phía máy chủ • Chỉ giáo viên có quyền kiểm duyệt
          </p>
        </div>

        {loading || !submission || !assignment ? (
          <div className="py-16 text-center text-slate-400 font-bold">Đang tải chi tiết bài làm...</div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-5 pr-2">
            {/* STUDENT & METRICS CARD */}
            <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-blue-50 to-pink-50 border border-purple-100 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Học sinh
                </span>
                <span className="text-sm sm:text-base font-black text-slate-800">
                  {submission.studentName}
                </span>
                <span className="block text-xs font-bold text-purple-700">Lớp {submission.classCode}</span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Điểm số
                </span>
                <span className="text-xl font-black text-purple-700">
                  ⭐ {submission.score}/10
                </span>
                {submission.pointsEarned !== undefined && (
                  <span className="block text-xs font-bold text-amber-700">
                    ⭐ {submission.pointsEarned}/{submission.totalMaxPoints || 100} điểm
                  </span>
                )}
                {submission.rankTitle && (
                  <span className="block text-[11px] font-extrabold text-purple-700">
                    {submission.rankTitle}
                  </span>
                )}
                <span className="block text-[11px] text-slate-500 font-semibold">
                  Đúng {submission.correctCount}/{submission.totalQuestions} câu
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Thời gian làm
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {formatDuration(submission.totalTimeSeconds)}
                </span>
                <span className="block text-[10px] text-slate-500">
                  Bắt đầu: {new Date(submission.startedAt).toLocaleTimeString('vi-VN')}
                </span>
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Thời điểm nộp
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800">
                  {submission.submittedAt ? new Date(submission.submittedAt).toLocaleTimeString('vi-VN') : '--:--'}
                </span>
                <span className="block text-[10px] text-slate-500">
                  {submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('vi-VN') : ''}
                </span>
              </div>
            </div>

            {/* TEACHER MANAGEMENT ACTIONS FOR SUBMISSION */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black text-slate-800 block">
                  🛠️ QUẢN TRỊ DỮ LIỆU BÀI LÀM
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Xóa khi học sinh bị trùng tên/sai thông tin hoặc cho phép làm lại bài
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetSubmission}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cho làm lại</span>
                </button>
                <button
                  type="button"
                  onClick={handleDeleteSubmission}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa bài làm</span>
                </button>
              </div>
            </div>

            {/* REVIEW PERMISSION SETTING (SPEC REQUIREMENT) */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>QUYỀN XEM LẠI BÀI CHO HỌC SINH NÀY:</span>
                </span>
                {saveSuccess && (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Đã cập nhật quyền
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { key: 'LOCKED', label: '🔒 Không cho xem (mặc định)' },
                  { key: 'SCORE_ONLY', label: '⭐ Chỉ cho xem điểm' },
                  { key: 'QUESTIONS_NO_ANSWERS', label: '📝 Xem câu hỏi nhưng ẩn đáp án đúng' },
                  { key: 'FULL_REVIEW', label: '🔓 Cho xem lại toàn bộ bài làm' },
                ].map((opt) => (
                  <label
                    key={opt.key}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      currentPermission === opt.key
                        ? 'bg-white border-purple-500 text-purple-900 shadow-xs'
                        : 'border-transparent text-slate-700 hover:bg-white/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reviewPerm"
                      checked={currentPermission === opt.key}
                      onChange={() => handleUpdatePermission(opt.key as ReviewPermission)}
                      className="text-purple-600"
                    />
                    <span>{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* FULL QUESTIONS & STUDENT ANSWERS INSPECTION */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                CHI TIẾT CÂU TRẢ LỜI:
              </h3>

              {(assignment.questions || []).map((q, idx) => {
                const answerRecord = submission.answers[q.id];
                const selectedOpt = answerRecord?.selectedOption;
                const isCorrect = answerRecord?.isCorrect;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border ${
                      isCorrect
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black text-slate-700">
                          CÂU {idx + 1}
                        </span>
                        {q.taskName && (
                          <span className="text-[11px] font-extrabold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                            {q.taskName}
                          </span>
                        )}
                        {q.points && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                            ⭐ {q.points} điểm
                          </span>
                        )}
                      </div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Đúng ✅
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-black text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" /> Sai ❌
                        </span>
                      )}
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-slate-800 mb-3 whitespace-pre-line">
                      {q.content}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-2">
                      {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                        const isStudentChoice = selectedOpt === optKey;
                        const isTheCorrectOpt = q.correctOption === optKey;

                        return (
                          <div
                            key={optKey}
                            className={`p-2.5 rounded-xl border flex items-center justify-between ${
                              isTheCorrectOpt
                                ? 'bg-emerald-100/70 border-emerald-400 font-black text-emerald-950'
                                : isStudentChoice
                                ? 'bg-rose-100/70 border-rose-400 font-black text-rose-950'
                                : 'bg-white border-slate-200 text-slate-600'
                            }`}
                          >
                            <span>
                              <strong>{optKey}.</strong> {q.options[optKey]}
                            </span>
                            {isTheCorrectOpt && (
                              <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">
                                Đáp án đúng
                              </span>
                            )}
                            {isStudentChoice && !isTheCorrectOpt && (
                              <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded font-bold">
                                Em chọn
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <p className="text-[11px] text-slate-600 bg-white/80 p-2 rounded-xl border border-slate-200 mt-2 italic">
                        💡 Giải thích: {q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
