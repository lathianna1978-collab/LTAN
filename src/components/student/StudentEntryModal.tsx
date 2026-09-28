import React, { useState, useEffect } from 'react';
import { X, User, School, KeyRound, Sparkles, AlertCircle, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { ClassCode } from '../../types';
import { apiStudent } from '../../api';

interface StudentEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExam: (data: any) => void;
}

export const StudentEntryModal: React.FC<StudentEntryModalProps> = ({
  isOpen,
  onClose,
  onStartExam,
}) => {
  const [fullName, setFullName] = useState('');
  const [classCode, setClassCode] = useState<ClassCode>('6A8');
  const [assignmentCode, setAssignmentCode] = useState('CD6-B1');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeAssignments, setActiveAssignments] = useState<Array<{ id: string; code: string; title: string; durationMinutes: number; isLocked?: boolean }>>([]);

  useEffect(() => {
    if (isOpen) {
      apiStudent.getActiveAssignments()
        .then(list => {
          setActiveAssignments(list);
          if (list.length > 0 && !assignmentCode) {
            // Pick the first unlocked assignment by default if available
            const firstOpen = list.find(a => !a.isLocked);
            setAssignmentCode(firstOpen ? firstOpen.code : list[0].code);
          }
        })
        .catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Em vui lòng nhập đầy đủ Họ và tên nhé!');
      return;
    }

    if (!classCode) {
      setError('Em vui lòng chọn đúng lớp học của mình nhé!');
      return;
    }

    if (!assignmentCode.trim()) {
      setError('Em vui lòng chọn hoặc nhập mã bài tập cô đã giao nhé!');
      return;
    }

    // Check if Cô An Na has locked this assignment
    const chosenAsg = activeAssignments.find(
      (a) => a.code.toUpperCase() === assignmentCode.trim().toUpperCase() ||
             assignmentCode.trim().toUpperCase().includes(a.code.toUpperCase())
    );
    if (chosenAsg && chosenAsg.isLocked) {
      setError(`🔒 Bài tập "${chosenAsg.title}" hiện đang được Cô An Na tạm khóa. Khi nào cô mở khóa thì em mới được vào làm bài nhé!`);
      return;
    }

    setLoading(true);
    try {
      const response = await apiStudent.start(fullName.trim(), classCode, assignmentCode.trim());
      onStartExam(response);
    } catch (err: any) {
      setError(err.message || 'Không thể bắt đầu làm bài. Vui lòng kiểm tra lại mã bài tập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-student-entry"
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-brand text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">
            🎒
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            CHÀO MỪNG EM ĐẾN VỚI HÀNH TRÌNH!
          </h2>
          <p className="text-sm font-semibold text-purple-600 mt-1">
            Không cần tài khoản • Nhập thông tin để bắt đầu ngay
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-bold flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* HỌ VÀ TÊN */}
          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-600" />
              <span>👤 HỌ VÀ TÊN HỌC SINH</span>
            </label>
            <input
              id="student-name-input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ví dụ: Nguyễn Minh Anh"
              className="w-full px-4 py-3 rounded-2xl border-2 border-purple-100 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-hidden font-bold text-slate-800 transition-all placeholder:font-normal placeholder:text-slate-400"
              required
              autoFocus
            />
          </div>

          {/* LỚP */}
          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <School className="w-4 h-4 text-blue-600" />
              <span>🏫 LỚP HỌC</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {(['6A8', '6A9', '6A10', '6A11', '6A12'] as ClassCode[]).map((cls) => (
                <button
                  type="button"
                  key={cls}
                  onClick={() => setClassCode(cls)}
                  className={`py-2.5 rounded-2xl font-black text-sm border-2 transition-all cursor-pointer ${
                    classCode === cls
                      ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105'
                      : 'bg-purple-50/60 text-purple-800 border-purple-100 hover:bg-purple-100'
                  }`}
                >
                  {cls}
                </button>
              ))}
            </div>
          </div>

          {/* CHỌN BÀI HỌC (12 BÀI) & MÃ BÀI TẬP */}
          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-600" />
                <span>📚 BẤM CHỌN BÀI HỌC CẦN LÀM (BÀI 1 ĐẾN 12)</span>
              </span>
              <span className="font-mono text-xs text-purple-700 font-black">
                {assignmentCode || 'Chưa chọn'}
              </span>
            </label>

            {/* 12 Lessons Quick Selector with Lock/Unlock Status */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 mb-2.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => {
                const code = `CD6-B${num}`;
                const foundAsg = activeAssignments.find(
                  (a) => a.code.toUpperCase() === code || a.code.toUpperCase().includes(`B${num}`)
                );
                const isLocked = foundAsg ? foundAsg.isLocked : false;
                const isSelected = assignmentCode.toUpperCase() === code;

                return (
                  <button
                    type="button"
                    key={num}
                    onClick={() => {
                      setAssignmentCode(code);
                      if (isLocked) {
                        setError(`🔒 Bài ${num} hiện đang được Cô An Na tạm khóa. Chỉ khi nào cô mở khóa thì em mới được vào làm bài nhé!`);
                      } else {
                        setError(null);
                      }
                    }}
                    className={`py-2 px-1 rounded-xl text-center font-black text-xs border transition-all cursor-pointer relative ${
                      isSelected
                        ? isLocked
                          ? 'bg-rose-50 text-rose-800 border-rose-400 ring-2 ring-rose-200'
                          : 'bg-purple-600 text-white border-purple-600 shadow-sm scale-105 z-10'
                        : isLocked
                        ? 'bg-rose-50/60 text-rose-700 border-rose-200 hover:bg-rose-100/70'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100 shadow-2xs'
                    }`}
                  >
                    <div>Bài {num}</div>
                    <div className="text-[10px] mt-0.5 font-bold flex items-center justify-center gap-0.5">
                      {isLocked ? (
                        <span className="text-rose-600">🔒 Khóa</span>
                      ) : (
                        <span className="text-emerald-700">🟢 Mở</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Input code manual fallback */}
            <div>
              <input
                id="student-assignment-code-input"
                type="text"
                value={assignmentCode}
                onChange={(e) => setAssignmentCode(e.target.value.toUpperCase())}
                placeholder="Hoặc nhập mã bài (Ví dụ: CD6-B1, B1...)"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-hidden font-mono font-extrabold text-xs sm:text-sm text-slate-800 uppercase tracking-wider"
                required
              />
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <button
            id="btn-submit-student-start"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 hover:from-purple-700 hover:via-blue-700 hover:to-pink-700 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>ĐANG CHUẨN BỊ BÀI LÀM...</span>
              </div>
            ) : (
              <>
                <span>🚀 BẮT ĐẦU HÀNH TRÌNH</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
