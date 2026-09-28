import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Clock, Calendar, ShieldCheck, Home, CheckCircle2, Sparkles, Star } from 'lucide-react';

interface StudentCompletionScreenProps {
  result: {
    submissionId: string;
    assignmentCode?: string;
    assignmentTitle?: string;
    score: number;
    pointsEarned?: number;
    totalMaxPoints?: number;
    rankTitle?: string;
    totalQuestions: number;
    correctCount: number;
    totalTimeFormatted: string;
    submittedDate: string;
    isLocked: boolean;
    lockNotice: string;
  };
  onReturnHome: () => void;
}

export const StudentCompletionScreen: React.FC<StudentCompletionScreenProps> = ({
  result,
  onReturnHome,
}) => {
  useEffect(() => {
    // Trigger confetti burst 2-3 seconds as specified
    const end = Date.now() + 2500;
    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#f43f5e'];

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-purple-100 text-center relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 inset-x-0 h-3 bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500"></div>

        {/* Celebration Trophy Badge */}
        <div className="relative inline-block mb-4 mt-2">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-5xl mx-auto shadow-lg animate-bounce">
            🎉
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Header Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight leading-tight mb-2">
          TUYỆT VỜI!
        </h1>
        <p className="text-base font-extrabold text-purple-700 mb-4">
          EM ĐÃ HOÀN THÀNH MỘT CHẶNG HÀNH TRÌNH!
        </p>

        {/* Rank / Achievement Badge */}
        {result.rankTitle && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-100 via-orange-100 to-amber-200 border-2 border-amber-300 text-amber-950 font-black text-sm sm:text-base shadow-sm mb-5">
            <Sparkles className="w-5 h-5 text-amber-600 animate-spin" />
            <span>{result.rankTitle}</span>
          </div>
        )}

        {/* STATS CARD */}
        <div className="bg-gradient-card-lavender rounded-3xl p-5 border border-purple-100 shadow-soft mb-6 space-y-3.5 text-left">
          {/* Điểm số */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-purple-100 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Star className="w-5 h-5 fill-amber-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-700">Điểm số đạt được</div>
                {result.pointsEarned !== undefined && (
                  <div className="text-xs font-semibold text-amber-700">
                    ⭐ {result.pointsEarned}/{result.totalMaxPoints || 100} điểm nhiệm vụ
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl sm:text-2xl font-black text-purple-700">
                {result.score}/10
              </span>
              <div className="text-[11px] font-bold text-slate-500">
                {result.correctCount}/{result.totalQuestions} câu đúng
              </div>
            </div>
          </div>

          {/* Thời gian */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-purple-100 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-700">Thời gian làm bài</span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-slate-800">
              {result.totalTimeFormatted}
            </span>
          </div>

          {/* Ngày nộp */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-white border border-purple-100 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-700">Ngày hoàn thành</span>
            </div>
            <span className="text-sm sm:text-base font-extrabold text-slate-800">
              {result.submittedDate || new Date().toLocaleDateString('vi-VN')}
            </span>
          </div>
        </div>

        {/* LOCKED STATUS CARD (MANDATORY REQUIREMENT) */}
        <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 mb-4 flex items-start gap-3 text-left">
          <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-purple-800 uppercase tracking-wider mb-0.5">
              🔐 Bài làm đã được khóa an toàn
            </div>
            <p className="text-xs font-semibold text-purple-700 leading-relaxed">
              {result.lockNotice || 'Bài làm chi tiết đã được bảo vệ. Chỉ giáo viên có quyền mở để xem.'}
            </p>
          </div>
        </div>

        {/* CHỐT BÀI TRONG 20 GIÂY (5 Chìa khóa vàng Bài 1) */}
        {(result.assignmentCode?.includes('B1') || result.assignmentTitle?.toLowerCase().includes('truyền thống')) && (
          <div className="p-4 rounded-2xl bg-amber-50/90 border-2 border-amber-200 text-amber-950 mb-6 text-left shadow-xs">
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-800 mb-2">
              <span>🔐 CHỐT BÀI TRONG 20 GIÂY — 5 CHÌA KHÓA VÀNG</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 font-bold text-xs sm:text-sm text-amber-900 mb-2">
              <span className="px-2 py-0.5 rounded-lg bg-white border border-amber-200">🔎 TÌM HIỂU</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-white border border-amber-200">❤️ TỰ HÀO</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-white border border-amber-200">🙏 TRÂN TRỌNG</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-white border border-amber-200">🌱 GIỮ GÌN</span>
              <span>→</span>
              <span className="px-2 py-0.5 rounded-lg bg-white border border-amber-200">🚀 PHÁT HUY</span>
            </div>
            <p className="text-xs text-amber-800 font-medium italic">
              "Truyền thống tốt đẹp không chỉ để tự hào — mà cần được tiếp nối bằng những việc làm phù hợp."
            </p>
          </div>
        )}

        {/* ACTION BUTTON */}
        <button
          id="btn-return-home"
          onClick={onReturnHome}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Home className="w-5 h-5" />
          <span>QUAY LẠI TRANG CHỦ</span>
        </button>
      </div>
    </div>
  );
};
