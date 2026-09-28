import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Save, Sparkles, Check } from 'lucide-react';
import { apiStudent } from '../../api';

interface ExamQuestion {
  id: string;
  order: number;
  content: string;
  taskName?: string;
  points?: number;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface StudentExamScreenProps {
  examData: {
    submissionId: string;
    student: {
      fullName: string;
      classCode: string;
      studentCode: string;
    };
    assignment: {
      id: string;
      code: string;
      title: string;
      durationMinutes: number;
      totalQuestions: number;
    };
    savedAnswers: Record<string, { selectedOption: 'A' | 'B' | 'C' | 'D' | null; savedAt: string }>;
    questions: ExamQuestion[];
    startedAt: string;
  };
  onComplete: (result: any) => void;
}

export const StudentExamScreen: React.FC<StudentExamScreenProps> = ({
  examData,
  onComplete,
}) => {
  const { submissionId, student, assignment, questions, savedAnswers } = examData;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, 'A' | 'B' | 'C' | 'D' | null>>(() => {
    const map: Record<string, 'A' | 'B' | 'C' | 'D' | null> = {};
    for (const q of questions) {
      map[q.id] = savedAnswers[q.id]?.selectedOption || null;
    }
    return map;
  });

  const [saveStatus, setSaveStatus] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Timer logic
  const totalSeconds = (assignment.durationMinutes || 15) * 60;
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const elapsedSecondsRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        elapsedSecondsRef.current += 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAutoSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await apiStudent.submit(submissionId, elapsedSecondsRef.current);
      onComplete(res);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tự động nộp bài');
    }
  };

  const currentQuestion = questions[currentIndex];
  const selectedOption = answers[currentQuestion.id];

  // Save answer handler
  const handleSelectOption = async (option: 'A' | 'B' | 'C' | 'D') => {
    // Optimistic UI update
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));
    setSaveStatus((prev) => ({ ...prev, [currentQuestion.id]: false }));

    try {
      await apiStudent.saveAnswer(submissionId, currentQuestion.id, option);
      setSaveStatus((prev) => ({ ...prev, [currentQuestion.id]: true }));
      // Clear saved notice after 2s
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, [currentQuestion.id]: false }));
      }, 2000);
    } catch (err) {
      console.error('Lỗi khi tự động lưu đáp án:', err);
    }
  };

  const handleManualSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await apiStudent.submit(submissionId, elapsedSecondsRef.current);
      setShowConfirmModal(false);
      onComplete(res);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi nộp bài');
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.values(answers).filter((v) => v !== null).length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);

  // Format timer
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Warning thresholds
  const isUrgent = timeLeft <= 60; // < 1 min
  const isWarning = timeLeft <= 300 && !isUrgent; // < 5 min

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between pb-10">
      {/* MOBILE-FIRST HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-purple-100 shadow-xs px-4 py-3 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌟</span>
            <div>
              <h1 className="text-base sm:text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                CÔNG DÂN NHÍ 6
              </h1>
              <span className="text-xs font-bold text-slate-500">
                {student.fullName} • Lớp {student.classCode}
              </span>
            </div>
          </div>

          {/* TIMER WITH COLOR ALERTS */}
          <div
            id="exam-timer"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-mono font-black text-sm sm:text-base border transition-all ${
              isUrgent
                ? 'bg-rose-500 text-white border-rose-600 animate-bounce shadow-md'
                : isWarning
                ? 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                : 'bg-purple-50 text-purple-800 border-purple-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{timeFormatted}</span>
          </div>
        </div>

        {/* PROGRESS BAR & COUNTER */}
        <div className="max-w-3xl mx-auto mt-2.5">
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-600 mb-1">
            <span>
              CÂU {currentIndex + 1} / {totalQuestions}
            </span>
            <span>
              ĐÃ LÀM {answeredCount}/{totalQuestions} ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
            ></div>
          </div>
        </div>
      </header>

      {/* QUESTION PALETTE DRAWER / QUICK NAV BUTTONS */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
        {questions.map((q, idx) => {
          const isDone = answers[q.id] !== null;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`w-8 h-8 rounded-xl font-bold text-xs shrink-0 flex items-center justify-center border transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-300 scale-105'
                  : isDone
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* QUESTION BODY */}
      <main className="max-w-3xl mx-auto w-full px-4 py-4 flex-1">
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-purple-100 shadow-soft mb-6">
          {/* Question order & Auto-save badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700">
                <span>🎯 CÂU HỎI {currentIndex + 1}</span>
              </span>
              {currentQuestion.points && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-800 border border-amber-200">
                  ⭐ {currentQuestion.points} điểm
                </span>
              )}
            </div>

            {saveStatus[currentQuestion.id] && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 animate-in fade-in duration-200">
                <Check className="w-3.5 h-3.5" />
                <span>💾 Đã lưu</span>
              </span>
            )}
          </div>

          {/* Special Task Name if available */}
          {currentQuestion.taskName && (
            <div className="mb-3 px-3.5 py-2 rounded-2xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/80 text-purple-900 font-extrabold text-xs sm:text-sm flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-purple-600 animate-ping"></span>
              <span>{currentQuestion.taskName}</span>
            </div>
          )}

          {/* Question text */}
          <div className="text-base sm:text-lg font-bold text-slate-800 leading-relaxed mb-6 whitespace-pre-line">
            {currentQuestion.content}
          </div>

          {/* OPTIONS LIST (LARGE CARDS MOBILE-FIRST) */}
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
              const isSelected = selectedOption === optKey;
              return (
                <button
                  type="button"
                  key={optKey}
                  onClick={() => handleSelectOption(optKey)}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all flex items-center justify-between gap-4 cursor-pointer select-none transform active:scale-[0.99] ${
                    isSelected
                      ? 'bg-purple-50/80 border-purple-500 shadow-md ring-4 ring-purple-100 text-purple-950 font-bold'
                      : 'bg-white border-slate-200 hover:border-purple-200 hover:bg-slate-50/70 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3.5 flex-1">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border transition-all ${
                        isSelected
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200'
                      }`}
                    >
                      {optKey}
                    </div>
                    <span className="text-sm sm:text-base leading-snug">{currentQuestion.options[optKey]}</span>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-in zoom-in-75">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER NAVIGATION */}
      <footer className="max-w-3xl mx-auto w-full px-4">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 font-extrabold text-sm sm:text-base text-slate-700 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>← CÂU TRƯỚC</span>
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>CÂU TIẾP →</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              id="btn-open-submit-modal"
              onClick={() => setShowConfirmModal(true)}
              className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>✅ HOÀN THÀNH & NỘP BÀI</span>
            </button>
          )}
        </div>
      </footer>

      {/* CONFIRM SUBMISSION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-purple-100 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
              ⚠️
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">
              XÁC NHẬN NỘP BÀI?
            </h3>

            <p className="text-sm text-slate-600 mb-4 font-medium leading-relaxed">
              Em đã hoàn thành <strong>{answeredCount}/{totalQuestions}</strong> câu hỏi.
              {answeredCount < totalQuestions && (
                <span className="block mt-1 text-rose-600 font-bold">
                  ⚠️ Em còn {totalQuestions - answeredCount} câu chưa chọn đáp án!
                </span>
              )}
            </p>

            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 text-xs font-bold text-purple-800 text-left mb-5">
              🔐 <strong>Lưu ý bảo mật:</strong> Sau khi nộp, bài làm sẽ được <strong>KHÓA NGAY LẬP TỨC</strong>. Em sẽ không thể sửa đổi hoặc xem lại đáp án chi tiết.
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-3 rounded-2xl border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 cursor-pointer"
              >
                HỦY, LÀM TIẾP
              </button>
              <button
                type="button"
                id="btn-confirm-submit"
                disabled={isSubmitting}
                onClick={handleManualSubmit}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? 'ĐANG NỘP...' : 'ĐỒNG Ý NỘP'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
