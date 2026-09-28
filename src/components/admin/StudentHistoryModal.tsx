import React, { useState, useEffect } from 'react';
import { X, History, TrendingUp, Calendar, CheckCircle2, Clock, AlertTriangle, Filter, Award } from 'lucide-react';
import { ClassCode, Student, StudentHistorySummary } from '../../types';
import { apiAdmin } from '../../api';

interface StudentHistoryModalProps {
  isOpen: boolean;
  initialStudentId?: string | null;
  classes: Array<{ code: ClassCode; name: string }>;
  onClose: () => void;
}

export const StudentHistoryModal: React.FC<StudentHistoryModalProps> = ({
  isOpen,
  initialStudentId,
  classes,
  onClose,
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassCode>('6A8');
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [historyData, setHistoryData] = useState<StudentHistorySummary | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'DONE' | 'NOT_DONE' | 'ON_TIME' | 'LATE'>('ALL');
  const [loading, setLoading] = useState(false);

  // Fetch student list when class changes
  useEffect(() => {
    if (isOpen) {
      apiAdmin.getStudents(selectedClass, false)
        .then((list) => {
          setStudents(list);
          if (initialStudentId && list.some((s) => s.id === initialStudentId)) {
            setSelectedStudentId(initialStudentId);
          } else if (list.length > 0 && !selectedStudentId) {
            setSelectedStudentId(list[0].id);
          }
        })
        .catch(console.error);
    }
  }, [isOpen, selectedClass, initialStudentId]);

  // Fetch history when student is selected
  useEffect(() => {
    if (selectedStudentId) {
      setLoading(true);
      apiAdmin.getStudentHistory(selectedStudentId)
        .then((data) => setHistoryData(data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [selectedStudentId]);

  if (!isOpen) return null;

  // Filter timeline
  const filteredTimeline = historyData
    ? historyData.timeline.filter((item) => {
        const isDone = item.status === 'COMPLETED' || item.status === 'DONE';
        const isNotDone = item.status === 'NOT_STARTED' || item.status === 'NOT_DONE';
        const isLate = item.isLate || item.isOnTime === false;
        const isOnTime = item.isOnTime === true || (isDone && !isLate);

        if (filter === 'DONE') return isDone;
        if (filter === 'NOT_DONE') return isNotDone;
        if (filter === 'ON_TIME') return isDone && isOnTime;
        if (filter === 'LATE') return isLate;
        return true;
      })
    : [];

  const completedCount = historyData?.stats?.completedCount ?? historyData?.completedCount ?? 0;
  const averageScore = historyData?.stats?.averageScore ?? historyData?.averageScore ?? 0;
  const onTimeCount = historyData?.stats?.onTimeCount ?? historyData?.onTimeCount ?? 0;
  const lateCount = historyData?.stats?.lateCount ?? historyData?.lateCount ?? 0;
  const progressPercent = historyData?.stats?.progressPercent ?? historyData?.progressPercent ?? 0;
  const progressPoints = historyData?.progressPoints ?? historyData?.scoreProgress ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden max-h-[92vh] flex flex-col">
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
            <span className="text-2xl">🕘</span>
            <h2 className="text-2xl font-black text-slate-800">
              LỊCH SỬ HỌC TẬP TỪNG HỌC SINH
            </h2>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Theo dõi tiến trình rèn luyện cá nhân và sự tiến bộ qua từng bài học
          </p>
        </div>

        {/* CLASS & STUDENT SELECTORS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-purple-50/70 rounded-2xl border border-purple-200 mb-5">
          <div>
            <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-1">
              🏫 CHỌN LỚP HỌC
            </label>
            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value as ClassCode);
                setSelectedStudentId('');
              }}
              className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 font-bold text-sm outline-hidden"
            >
              {classes.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-purple-900 uppercase tracking-wider mb-1">
              👤 CHỌN HỌC SINH
            </label>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-2 bg-white rounded-xl border border-purple-200 font-bold text-sm outline-hidden"
            >
              {students.length === 0 ? (
                <option value="">Chưa có học sinh</option>
              ) : (
                students.map((st) => (
                  <option key={st.id} value={st.id}>
                    {st.fullName} ({st.studentCode})
                  </option>
                ))
              )}
            </select>
          </div>
        </div>

        {loading || !historyData ? (
          <div className="py-16 text-center text-slate-400 font-bold">Đang tải lịch sử học tập...</div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6 pr-2">
            {/* OVERVIEW STATS CARDS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 text-center">
                <span className="text-[11px] font-bold text-purple-700 block">Số bài đã làm</span>
                <span className="text-xl font-black text-purple-950">
                  {completedCount} bài
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-center">
                <span className="text-[11px] font-bold text-amber-700 block">Điểm trung bình</span>
                <span className="text-xl font-black text-amber-900">
                  ⭐ {averageScore}/10
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">
                <span className="text-[11px] font-bold text-emerald-700 block">Đúng hạn</span>
                <span className="text-xl font-black text-emerald-900">
                  {onTimeCount} bài
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
                <span className="text-[11px] font-bold text-rose-700 block">Quá hạn</span>
                <span className="text-xl font-black text-rose-900">
                  {lateCount} bài
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center col-span-2 sm:col-span-1">
                <span className="text-[11px] font-bold text-blue-700 block">Tiến độ chung</span>
                <span className="text-xl font-black text-blue-900">
                  {progressPercent}%
                </span>
              </div>
            </div>

            {/* 📈 BIỂU ĐỒ HÀNH TRÌNH TIẾN BỘ CỦA EM (SPEC 19) */}
            <div className="p-5 rounded-3xl bg-slate-50 border border-slate-200 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5 uppercase tracking-wider">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>📈 HÀNH TRÌNH TIẾN BỘ CỦA EM</span>
                </h3>
                <span className="text-xs text-slate-500 font-semibold italic">
                  Đánh giá sự vươn lên của từng học sinh (không so sánh, không xếp hạng)
                </span>
              </div>

              {/* Responsive SVG / Column Graph */}
              {progressPoints.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-bold">
                  Học sinh chưa hoàn thành bài tập nào để vẽ biểu đồ tiến bộ.
                </div>
              ) : (
                <div className="w-full bg-white p-4 rounded-2xl border border-slate-200">
                  <div className="h-44 w-full relative flex items-end justify-between px-6 pt-6 pb-2">
                    {/* Background grid lines */}
                    <div className="absolute inset-x-6 top-6 h-px bg-slate-100">
                      <span className="text-[9px] text-slate-400 -mt-2.5 block">10.0</span>
                    </div>
                    <div className="absolute inset-x-6 top-16 h-px bg-slate-100">
                      <span className="text-[9px] text-slate-400 -mt-2.5 block">7.5</span>
                    </div>
                    <div className="absolute inset-x-6 top-26 h-px bg-slate-100">
                      <span className="text-[9px] text-slate-400 -mt-2.5 block">5.0</span>
                    </div>

                    {progressPoints.map((pt: any, idx: number) => {
                      const scoreVal = pt.score || 0;
                      const heightPercent = Math.max(10, Math.min(100, (scoreVal / 10) * 100));
                      const label = pt.assignmentTitle || pt.label || `Bài ${idx + 1}`;

                      return (
                        <div key={idx} className="flex flex-col items-center gap-1.5 z-10 group">
                          {/* Score tooltip */}
                          <div className="text-[11px] font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-md shadow-xs opacity-90 group-hover:scale-110 transition-transform">
                            {scoreVal}
                          </div>

                          {/* Bar / Pillar */}
                          <div
                            className="w-8 sm:w-10 rounded-t-xl bg-gradient-to-t from-purple-500 to-indigo-500 shadow-sm transition-all duration-300 group-hover:from-purple-600 group-hover:to-indigo-600"
                            style={{ height: `${heightPercent * 1.1}px` }}
                          ></div>

                          {/* Assignment label */}
                          <span className="text-[10px] font-bold text-slate-600 truncate max-w-[65px]">
                            {label.slice(0, 10)}...
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* TIMELINE LIST */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                  DÒNG THỜI GIAN HỌC TẬP:
                </h3>

                {/* FILTERS */}
                <div className="flex items-center gap-1 overflow-x-auto text-xs font-bold pb-1">
                  {[
                    { key: 'ALL', label: 'Tất cả' },
                    { key: 'DONE', label: 'Đã làm' },
                    { key: 'NOT_DONE', label: 'Chưa làm' },
                    { key: 'ON_TIME', label: 'Đúng hạn' },
                    { key: 'LATE', label: 'Quá hạn' },
                  ].map((f) => (
                    <button
                      key={f.key}
                      type="button"
                      onClick={() => setFilter(f.key as any)}
                      className={`px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                        filter === f.key
                          ? 'bg-purple-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {filteredTimeline.length === 0 ? (
                <div className="text-center py-8 text-xs font-bold text-slate-400">
                  Không có dữ liệu bài tập phù hợp với bộ lọc.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {filteredTimeline.map((item) => {
                    const isDone = item.status === 'COMPLETED' || item.status === 'DONE';
                    const isNotDone = item.status === 'NOT_STARTED' || item.status === 'NOT_DONE';
                    const isLate = item.isLate || item.isOnTime === false || item.status === 'LATE';
                    const completedDate = item.completedDate || item.completedAt;

                    return (
                      <div
                        key={item.assignmentId}
                        className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-black text-slate-800">
                              {item.assignmentTitle}
                            </span>
                            {item.assignmentCode && (
                              <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                                {item.assignmentCode}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                            {item.dueDate && (
                              <span>📅 Hạn nộp: {new Date(item.dueDate).toLocaleDateString('vi-VN')}</span>
                            )}
                            {completedDate && (
                              <span>
                                • Hoàn thành: {new Date(completedDate).toLocaleDateString('vi-VN')}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          {item.score !== undefined && (
                            <span className="text-base font-black text-purple-700 bg-purple-50 px-3 py-1 rounded-xl border border-purple-200">
                              ⭐ {item.score}/10
                            </span>
                          )}

                          {isDone && !isLate && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Đã nộp đúng hạn
                            </span>
                          )}

                          {isDone && isLate && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                              <Clock className="w-3.5 h-3.5" /> Nộp trễ hạn
                            </span>
                          )}

                          {isNotDone && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                              Chưa làm
                            </span>
                          )}

                          {!isDone && isLate && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-3 py-1 rounded-full">
                              <AlertTriangle className="w-3.5 h-3.5" /> Đã quá hạn nộp
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
