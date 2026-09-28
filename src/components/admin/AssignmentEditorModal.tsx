import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, CheckCircle2, Clock, Key, BookOpen, Layers, Save, HelpCircle, Sparkles, Copy, ArrowDown } from 'lucide-react';
import { Assignment, Question, Lesson } from '../../types';
import { apiAdmin } from '../../api';
import { parseAssignmentText } from '../../utils/assignmentParser';

interface AssignmentEditorModalProps {
  isOpen: boolean;
  lessonId: string;
  assignmentToEdit?: Assignment;
  lessons: Lesson[];
  onClose: () => void;
  onSuccess: () => void;
}

export const AssignmentEditorModal: React.FC<AssignmentEditorModalProps> = ({
  isOpen,
  lessonId,
  assignmentToEdit,
  lessons,
  onClose,
  onSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [selectedLessonId, setSelectedLessonId] = useState(lessonId);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [type, setType] = useState<'Trắc nghiệm' | 'Tình huống' | 'Vận dụng' | 'Phiếu củng cố'>('Trắc nghiệm');
  const [isLocked, setIsLocked] = useState(false);
  const [hideAnswersAfterSubmit, setHideAnswersAfterSubmit] = useState(true);

  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'q-1',
      order: 1,
      content: '',
      options: { A: '', B: '', C: '', D: '' },
      correctOption: 'A',
      explanation: '',
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [showSmartPasteBox, setShowSmartPasteBox] = useState(false);
  const [smartPasteText, setSmartPasteText] = useState('');
  const [smartPasteMode, setSmartPasteMode] = useState<'replace' | 'append'>('replace');

  const handleApplySmartPaste = () => {
    if (!smartPasteText.trim()) {
      alert('Vui lòng dán nội dung đề bài!');
      return;
    }

    const parsed = parseAssignmentText(smartPasteText, selectedLessonId, lessons);
    if (parsed.questions.length === 0) {
      alert('Không nhận diện được câu hỏi nào từ văn bản đã dán. Vui lòng kiểm tra lại!');
      return;
    }

    if (smartPasteMode === 'replace') {
      if (parsed.title) setTitle(parsed.title);
      if (parsed.code && !assignmentToEdit) setCode(parsed.code);
      if (parsed.durationMinutes) setDurationMinutes(parsed.durationMinutes);
      if (parsed.lessonId) setSelectedLessonId(parsed.lessonId);
      setQuestions(parsed.questions);
    } else {
      const startIdx = questions.length;
      const appended = parsed.questions.map((q, i) => ({
        ...q,
        order: startIdx + i + 1,
      }));
      setQuestions([...questions, ...appended]);
    }

    setShowSmartPasteBox(false);
    setSmartPasteText('');
    alert(`✨ Đã nhận diện và tối ưu thành công ${parsed.questions.length} câu hỏi chuẩn giao diện máy tính & điện thoại!`);
  };

  useEffect(() => {
    if (assignmentToEdit) {
      setTitle(assignmentToEdit.title);
      setCode(assignmentToEdit.code);
      setSelectedLessonId(assignmentToEdit.lessonId);
      setDurationMinutes(assignmentToEdit.durationMinutes);
      setType(assignmentToEdit.type as any);
      setIsLocked(assignmentToEdit.isLocked);
      setHideAnswersAfterSubmit(Boolean(assignmentToEdit.hideAnswersAfterSubmit));
      setQuestions(assignmentToEdit.questions && assignmentToEdit.questions.length > 0 ? assignmentToEdit.questions : [
        {
          id: 'q-1',
          order: 1,
          content: '',
          options: { A: '', B: '', C: '', D: '' },
          correctOption: 'A',
          explanation: '',
        },
      ]);
    } else {
      // Create new defaults
      const currentLesson = lessons.find((l) => l.id === lessonId);
      const lessonNum = currentLesson ? currentLesson.order : 1;
      const randomSuffix = Math.floor(Math.random() * 90 + 10);
      setTitle(`Bài tập trắc nghiệm củng cố Bài ${lessonNum}`);
      setCode(`CD6-B${lessonNum}-${randomSuffix}`);
      setSelectedLessonId(lessonId);
      setDurationMinutes(15);
      setType('Trắc nghiệm');
      setIsLocked(false);
      setHideAnswersAfterSubmit(true);
      setQuestions([
        {
          id: 'q-' + Date.now(),
          order: 1,
          content: 'Biểu hiện nào dưới đây thể hiện sự tự hào về truyền thống tốt đẹp của gia đình, dòng họ?',
          options: {
            A: 'Tích cực học tập, rèn luyện để phát huy nghề truyền thống của gia đình',
            B: 'Che giấu nghề truyền thống của gia đình vì thấy lạc hậu',
            C: 'Chỉ quan tâm đến việc học, không cần biết đến truyền thống',
            D: 'Chê bai những phong tục cổ truyền của quê hương',
          },
          correctOption: 'A',
          explanation: 'Kế thừa và phát huy nghề truyền thống là thể hiện lòng tự hào.',
        },
      ]);
    }
  }, [assignmentToEdit, lessonId, isOpen]);

  if (!isOpen) return null;

  const handleAddQuestion = () => {
    const newQ: Question = {
      id: 'q-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      order: questions.length + 1,
      content: '',
      options: { A: '', B: '', C: '', D: '' },
      correctOption: 'A',
      explanation: '',
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    if (questions.length <= 1) {
      alert('Bài tập cần có ít nhất 1 câu hỏi!');
      return;
    }
    const updated = questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, order: i + 1 }));
    setQuestions(updated);
  };

  const handleQuestionChange = (idx: number, field: keyof Question, value: any) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: value };
    setQuestions(updated);
  };

  const handleOptionChange = (qIdx: number, optKey: 'A' | 'B' | 'C' | 'D', value: string) => {
    const updated = [...questions];
    updated[qIdx] = {
      ...updated[qIdx],
      options: {
        ...updated[qIdx].options,
        [optKey]: value,
      },
    };
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('Vui lòng nhập tên bài tập');
      return;
    }
    if (!code.trim()) {
      alert('Vui lòng nhập mã bài tập');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.content.trim()) {
        alert(`Câu hỏi ${i + 1} chưa có nội dung!`);
        return;
      }
      if (!q.options.A.trim() || !q.options.B.trim()) {
        alert(`Câu hỏi ${i + 1} cần có ít nhất đáp án A và B!`);
        return;
      }
    }

    const payload = {
      title: title.trim(),
      code: code.trim().toUpperCase(),
      lessonId: selectedLessonId,
      durationMinutes: Number(durationMinutes) || 15,
      type,
      isLocked,
      hideAnswersAfterSubmit,
      questions,
    };

    setLoading(true);
    try {
      if (assignmentToEdit) {
        await apiAdmin.updateAssignment(assignmentToEdit.id, payload);
      } else {
        await apiAdmin.createAssignment(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi lưu bài tập');
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>📝</span>
            <span>{assignmentToEdit ? 'CHỈNH SỬA BÀI TẬP' : 'TẠO BÀI TẬP MỚI'}</span>
          </h2>
          <p className="text-xs font-bold text-purple-600">
            Cấu hình thông tin, thời gian làm bài và danh sách câu hỏi trắc nghiệm
          </p>
        </div>

        {/* Form Body with scroll */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* GENERAL INFO GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 bg-purple-50/60 rounded-3xl border border-purple-100">
            {/* Tên bài tập */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5">
                Tên bài tập
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: Bài tập 01 - Trắc nghiệm kiến thức"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 font-bold text-sm outline-hidden"
                required
              />
            </div>

            {/* Mã bài tập */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Key className="w-3.5 h-3.5 text-amber-500" />
                <span>Mã bài tập</span>
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="CD6-B1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 font-mono font-black text-sm uppercase outline-hidden"
                required
              />
            </div>

            {/* Chọn bài học */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-purple-600" />
                <span>Chọn bài học</span>
              </label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 font-bold text-xs outline-hidden"
              >
                {lessons.map((ls) => (
                  <option key={ls.id} value={ls.id}>
                    Bài {ls.order}: {ls.title.length > 20 ? ls.title.slice(0, 20) + '...' : ls.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Thời gian làm bài */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Thời gian (phút)</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 font-bold text-sm outline-hidden"
                required
              />
            </div>

            {/* Loại bài */}
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                <span>Loại bài tập</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-white border border-slate-300 focus:border-purple-500 font-bold text-xs outline-hidden"
              >
                <option value="Trắc nghiệm">Trắc nghiệm kiến thức</option>
                <option value="Tình huống">Tình huống rèn luyện</option>
                <option value="Vận dụng">Vận dụng thực tiễn</option>
                <option value="Phiếu củng cố">Phiếu củng cố nhanh</option>
              </select>
            </div>

            {/* Cài đặt hiển thị (Checkboxes) */}
            <div className="sm:col-span-2 flex items-center gap-6 pt-3">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isLocked}
                  onChange={(e) => setIsLocked(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded-md border-slate-300 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-700">🔒 Khóa bài tập (học sinh chưa thể làm)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hideAnswersAfterSubmit}
                  onChange={(e) => setHideAnswersAfterSubmit(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded-md border-slate-300 focus:ring-purple-500"
                />
                <span className="text-xs font-bold text-slate-700">🔐 Ẩn đáp án chi tiết sau khi nộp</span>
              </label>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <span>🎯 DANH SÁCH CÂU HỎI</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                  {questions.length} câu
                </span>
              </h3>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  id="btn-toggle-smart-paste"
                  onClick={() => setShowSmartPasteBox(!showSmartPasteBox)}
                  className={`py-2 px-3.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                    showSmartPasteBox
                      ? 'bg-purple-800 text-white shadow-xs ring-2 ring-purple-300'
                      : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>{showSmartPasteBox ? 'Ẩn ô dán đề' : '✨ DÁN ĐỀ TỰ ĐỘNG'}</span>
                </button>

                <button
                  type="button"
                  id="btn-add-question-inline"
                  onClick={handleAddQuestion}
                  className="py-2 px-3.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>➕ THÊM CÂU HỎI</span>
                </button>
              </div>
            </div>

            {/* Inline Smart Paste Drawer */}
            {showSmartPasteBox && (
              <div className="mb-5 p-5 bg-gradient-to-br from-purple-50 via-indigo-50/50 to-blue-50 rounded-3xl border-2 border-purple-300 shadow-sm space-y-3 animate-in fade-in duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <h4 className="text-xs sm:text-sm font-black text-purple-900 uppercase tracking-wide">
                      Dán nội dung bài tập (Word, PDF, Docs, Zalo)
                    </h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="smartPasteMode"
                        checked={smartPasteMode === 'replace'}
                        onChange={() => setSmartPasteMode('replace')}
                        className="text-purple-600"
                      />
                      <span>Thay thế toàn bộ câu hiện tại</span>
                    </label>
                    <label className="flex items-center gap-1.5 font-bold text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="smartPasteMode"
                        checked={smartPasteMode === 'append'}
                        onChange={() => setSmartPasteMode('append')}
                        className="text-purple-600"
                      />
                      <span>Thêm tiếp vào cuối bài</span>
                    </label>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 font-medium">
                  Hệ thống tự động phân loại: <span className="font-bold text-purple-800">Trắc nghiệm 4 đáp án, Đúng/Sai, Kéo thả, Nối cột, Tình huống</span> và tạo các thẻ chọn mượt mà cho học sinh bấm trên điện thoại hoặc máy tính.
                </p>

                <textarea
                  rows={6}
                  value={smartPasteText}
                  onChange={(e) => setSmartPasteText(e.target.value)}
                  placeholder={`Dán văn bản đề bài vào đây...
Ví dụ:
NHIỆM VỤ 1: AI CÙNG BẢO VỆ EM? (10 điểm)
Chọn lực lượng bảo vệ trẻ em:
A. Bản thân, gia đình, nhà trường, xã hội
B. Chỉ bạn thân
Đáp án: A`}
                  className="w-full p-3 rounded-2xl border border-purple-200 focus:border-purple-600 font-mono text-xs text-slate-800 bg-white outline-hidden leading-relaxed"
                />

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] font-semibold text-slate-500">
                    {smartPasteText.length > 0 ? `${smartPasteText.length} ký tự` : 'Sẵn sàng nhận văn bản'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowSmartPasteBox(false)}
                      className="py-1.5 px-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-600 hover:bg-white cursor-pointer"
                    >
                      Đóng
                    </button>
                    <button
                      type="button"
                      onClick={handleApplySmartPaste}
                      disabled={!smartPasteText.trim()}
                      className="py-1.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>⚡ TỰ ĐỘNG PHÂN TÍCH & ĐIỀN VÀO BÀI TẬP</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-700 bg-purple-50 px-2.5 py-1 rounded-xl">
                      CÂU HỎI {idx + 1}
                    </span>

                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Xóa câu hỏi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Tên nhiệm vụ / Thử thách (tùy chọn)
                      </label>
                      <input
                        type="text"
                        value={q.taskName || ''}
                        onChange={(e) => handleQuestionChange(idx, 'taskName', e.target.value)}
                        placeholder="VD: NHIỆM VỤ 1 — AI CÙNG BẢO VỆ EM?"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-purple-500 font-semibold text-xs outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1">
                        Điểm số (thang 100)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={q.points || ''}
                        onChange={(e) => handleQuestionChange(idx, 'points', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="VD: 10 hoặc 15"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-200 focus:border-purple-500 font-semibold text-xs outline-hidden"
                      />
                    </div>
                  </div>

                  {/* Nội dung câu hỏi */}
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1">
                      Nội dung câu hỏi
                    </label>
                    <textarea
                      rows={2}
                      value={q.content}
                      onChange={(e) => handleQuestionChange(idx, 'content', e.target.value)}
                      placeholder="Nhập nội dung câu hỏi hoặc tình huống..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-purple-500 font-semibold text-sm outline-hidden"
                      required
                    />
                  </div>

                  {/* 4 Options & Radio correct */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map((optKey) => (
                      <div key={optKey} className="flex items-center gap-2">
                        <label className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="radio"
                            name={`correct-${q.id || idx}`}
                            checked={q.correctOption === optKey}
                            onChange={() => handleQuestionChange(idx, 'correctOption', optKey)}
                            className="w-4 h-4 text-purple-600"
                          />
                          <span className="text-xs font-black text-purple-800 w-4">{optKey}</span>
                        </label>
                        <input
                          type="text"
                          value={q.options[optKey]}
                          onChange={(e) => handleOptionChange(idx, optKey, e.target.value)}
                          placeholder={`Đáp án ${optKey}...`}
                          className={`flex-1 px-3 py-2 rounded-xl border text-xs font-medium outline-hidden ${
                            q.correctOption === optKey
                              ? 'border-emerald-400 bg-emerald-50/50'
                              : 'border-slate-200'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Giải thích */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Giải thích ngắn gọn (giúp học sinh củng cố khi cô mở quyền xem)</span>
                    </label>
                    <input
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => handleQuestionChange(idx, 'explanation', e.target.value)}
                      placeholder="Ví dụ: Theo bài 1 SGK GDCD 6, tự hào truyền thống bao gồm..."
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-600 outline-hidden"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-5 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              HỦY
            </button>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <span>ĐANG LƯU...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>💾 LƯU BÀI TẬP</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
