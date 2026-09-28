import React from 'react';
import { X, AlertTriangle, CheckCircle2, TrendingDown, Users, BarChart3, HelpCircle } from 'lucide-react';
import { QuestionErrorStat } from '../../types';

interface TopErrorQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorStats: QuestionErrorStat[];
  selectedStat: QuestionErrorStat | null;
  onSelectStat: (stat: QuestionErrorStat) => void;
}

export const TopErrorQuestionsModal: React.FC<TopErrorQuestionsModalProps> = ({
  isOpen,
  onClose,
  errorStats,
  selectedStat,
  onSelectStat,
}) => {
  if (!isOpen) return null;

  const current = selectedStat || (errorStats.length > 0 ? errorStats[0] : null);

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
            <AlertTriangle className="w-6 h-6 text-rose-500" />
            <h2 className="text-2xl font-black text-slate-800">
              CÂU HỎI HỌC SINH SAI NHIỀU
            </h2>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Phân tích tự động để cô nắm bắt lỗ hổng kiến thức và củng cố trên lớp
          </p>
        </div>

        {errorStats.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-bold">
            Chưa ghi nhận câu hỏi nào có tỷ lệ sai đáng chú ý. Các em học sinh đang làm bài rất tốt! 🎉
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* Horizontal quick selector for top error questions */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {errorStats.map((stat, idx) => {
                const isSelected = current?.questionId === stat.questionId;
                const wrong = stat.wrongRate ?? stat.errorPercentage ?? 0;
                const badgeColor =
                  wrong >= 60
                    ? 'border-rose-500 bg-rose-50 text-rose-900'
                    : wrong >= 45
                    ? 'border-amber-500 bg-amber-50 text-amber-900'
                    : 'border-yellow-400 bg-yellow-50 text-yellow-900';

                return (
                  <button
                    key={stat.questionId || idx}
                    type="button"
                    onClick={() => onSelectStat(stat)}
                    className={`py-2 px-3.5 rounded-2xl border-2 shrink-0 font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-4 ring-purple-100 border-purple-600 bg-purple-600 text-white shadow-md scale-105'
                        : badgeColor
                    }`}
                  >
                    <span>
                      {wrong >= 60 ? '🔴' : wrong >= 45 ? '🟠' : '🟡'} Câu {stat.questionOrder}
                    </span>
                    <span className="opacity-90">{wrong}% sai</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Question Deep Analysis Card */}
            {current && (() => {
              const wrongRate = current.wrongRate ?? current.errorPercentage ?? 0;
              const totalResp = current.totalResponses ?? current.totalAttempts ?? 0;
              const worstClass = current.worstClass || current.mostErrorClass || '6A8';
              const dist = current.distribution || current.optionDistribution || { A: 0, B: 0, C: 0, D: 0 };

              return (
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-soft space-y-5">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-black text-rose-700 bg-rose-100 px-3 py-1 rounded-full uppercase tracking-wider">
                        ⚠️ TỶ LỆ SAI CAO: {wrongRate}%
                      </span>
                      <span className="text-xs font-bold text-slate-500">
                        {current.assignmentTitle}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-slate-800 leading-snug">
                      Câu {current.questionOrder}: {current.content}
                    </h3>
                  </div>

                  {/* Metrics Summary Row */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                      <span className="text-[11px] font-bold text-slate-500 block">Số học sinh đã làm</span>
                      <span className="text-lg font-black text-slate-800">{totalResp} em</span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                      <span className="text-[11px] font-bold text-slate-500 block">Tỷ lệ trả lời đúng</span>
                      <span className="text-lg font-black text-emerald-600">
                        {Math.max(0, 100 - wrongRate)}%
                      </span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                      <span className="text-[11px] font-bold text-slate-500 block">Tỷ lệ trả lời sai</span>
                      <span className="text-lg font-black text-rose-600">{wrongRate}%</span>
                    </div>

                    <div className="p-3 bg-white rounded-2xl border border-slate-200 text-center">
                      <span className="text-[11px] font-bold text-slate-500 block">Lớp sai nhiều nhất</span>
                      <span className="text-lg font-black text-purple-700">{worstClass}</span>
                    </div>
                  </div>

                  {/* Option Distribution Bars (A, B, C, D) */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <BarChart3 className="w-4 h-4 text-purple-600" />
                      <span>TỶ LỆ CHỌN CÁC ĐÁP ÁN:</span>
                    </h4>

                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                      const pct = dist[opt] || 0;
                      const isCorrect = current.correctOption === opt;
                      const isCommonMistake = !isCorrect && pct >= 40;
                      const optText = current.options ? current.options[opt] : opt;

                      return (
                        <div key={opt} className="bg-white p-3 rounded-2xl border border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center font-black">
                                {opt}
                              </span>
                              <span className="text-slate-700">{optText}</span>
                            </span>

                            <span className="flex items-center gap-2">
                              {isCorrect && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-black">
                                  ✅ Đáp án đúng
                                </span>
                              )}
                              {isCommonMistake && (
                                <span className="text-[10px] bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full font-black">
                                  ❌ Bẫy phổ biến ({pct}%)
                                </span>
                              )}
                              <span className="text-slate-800 font-mono font-black">{pct}%</span>
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCorrect ? 'bg-emerald-500' : isCommonMistake ? 'bg-rose-500' : 'bg-purple-300'
                              }`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation note */}
                  {current.explanation && (
                    <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-xs font-semibold text-purple-900 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Gợi ý hướng dẫn học sinh:</strong> {current.explanation}
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
