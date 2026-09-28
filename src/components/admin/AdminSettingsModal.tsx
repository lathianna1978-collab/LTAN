import React, { useState, useEffect } from 'react';
import { X, Lock, Key, Shield, Trash2, RefreshCw, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';
import { SystemSettings, Student, Assignment } from '../../types';
import { apiAdmin, apiAuth } from '../../api';

interface AdminSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  isOpen,
  onClose,
  onRefreshData,
}) => {
  const [activeTab, setActiveTab] = useState<'SECURITY' | 'PASSWORD' | 'TRASH' | 'RESET'>('SECURITY');
  const [settings, setSettings] = useState<SystemSettings | null>(null);

  // Change Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwMsg, setPwMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Trash bin data
  const [trashData, setTrashData] = useState<{ deletedStudents: Student[]; deletedAssignments: Assignment[] }>({
    deletedStudents: [],
    deletedAssignments: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadSettings();
      loadTrash();
    }
  }, [isOpen]);

  const loadSettings = async () => {
    try {
      const s = await apiAdmin.getSettings();
      setSettings(s);
    } catch (err) {
      console.error(err);
    }
  };

  const loadTrash = async () => {
    try {
      const t = await apiAdmin.getTrash();
      setTrashData(t);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const handleUpdateSettingToggle = async (key: keyof SystemSettings) => {
    if (!settings) return;
    const updatedVal = !settings[key];
    const newSettings = { ...settings, [key]: updatedVal };
    setSettings(newSettings);

    try {
      await apiAdmin.updateSettings({ [key]: updatedVal });
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);

    if (newPassword !== confirmPassword) {
      setPwMsg({ type: 'error', text: 'Mật khẩu mới không khớp nhau!' });
      return;
    }

    if (newPassword.length < 6) {
      setPwMsg({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự!' });
      return;
    }

    setLoading(true);
    try {
      const res = await apiAuth.changePassword(currentPassword, newPassword);
      setPwMsg({ type: 'success', text: res.message || 'Đổi mật khẩu thành công!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPwMsg({ type: 'error', text: err.message || 'Lỗi khi đổi mật khẩu' });
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreStudent = async (id: string) => {
    try {
      await apiAdmin.restoreStudent(id);
      loadTrash();
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi khôi phục');
    }
  };

  const handlePermanentDeleteStudent = async (id: string) => {
    if (!confirm('Hành động này sẽ XÓA VĨNH VIỄN học sinh này và không thể hoàn tác. Cô có chắc chắn?')) {
      return;
    }
    try {
      await apiAdmin.permanentDeleteStudent(id);
      loadTrash();
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa vĩnh viễn');
    }
  };

  const handleResetTestData = async () => {
    if (!confirm('Cô có chắc muốn dọn dẹp các bài nộp và học sinh thử nghiệm? Danh sách lớp và 12 bài học vẫn sẽ được giữ nguyên an toàn.')) {
      return;
    }
    try {
      await apiAdmin.resetTestData();
      alert('Đã dọn sạch dữ liệu thử nghiệm thành công!');
      loadTrash();
      onRefreshData();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi dọn dẹp dữ liệu');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden max-h-[92vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <span>⚙️</span>
            <span>CÀI ĐẶT HỆ THỐNG</span>
          </h2>
          <p className="text-xs font-semibold text-slate-500">
            Quản trị bảo mật, mật khẩu Cô An Na và phục hồi dữ liệu
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-5 overflow-x-auto text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('SECURITY')}
            className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'SECURITY'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🛡️ Bảo mật
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('PASSWORD')}
            className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'PASSWORD'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🔑 Đổi mật khẩu
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('TRASH')}
            className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'TRASH'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>♻️ Thùng rác</span>
            {(trashData.deletedStudents.length > 0 || trashData.deletedAssignments.length > 0) && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center">
                {trashData.deletedStudents.length + trashData.deletedAssignments.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('RESET')}
            className={`py-2 px-3.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'RESET'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🧹 Dọn dẹp dữ liệu
          </button>
        </div>

        {/* Tab 1: SECURITY */}
        {activeTab === 'SECURITY' && settings && (
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    🔒 Tự động khóa bài làm sau khi nộp
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Học sinh không thể sửa câu trả lời hoặc gian lận sau khi đã bấm nộp bài
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateSettingToggle('autoLockAfterSubmit')}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.autoLockAfterSubmit ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.autoLockAfterSubmit ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-100">
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    🔐 Ẩn đáp án đúng chi tiết
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Ngăn không cho lộ đề và lời giải chi tiết cho các bạn khác trong khối
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateSettingToggle('hideAnswersByDefault')}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.hideAnswersByDefault ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.hideAnswersByDefault ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-purple-100">
                <div>
                  <h4 className="text-sm font-black text-slate-800">
                    ⭐ Hiển thị điểm số ngay sau khi nộp
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Cho phép học sinh biết điểm số ngay để có động lực học tập
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleUpdateSettingToggle('showScoreImmediately')}
                  className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                    settings.showScoreImmediately ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.showScoreImmediately ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: PASSWORD */}
        {activeTab === 'PASSWORD' && (
          <form onSubmit={handleChangePassword} className="space-y-4 flex-1 overflow-y-auto">
            {pwMsg && (
              <div
                className={`p-3 rounded-2xl text-xs font-bold ${
                  pwMsg.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border border-rose-200 text-rose-800'
                }`}
              >
                {pwMsg.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Mật khẩu hiện tại
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 outline-hidden font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Mật khẩu mới
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Tối thiểu 6 ký tự..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 outline-hidden font-bold text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Nhập lại mật khẩu mới
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Xác nhận mật khẩu mới..."
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-purple-500 outline-hidden font-bold text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="py-2.5 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Đang cập nhật...' : '💾 CẬP NHẬT MẬT KHẨU'}
            </button>
          </form>
        )}

        {/* Tab 3: TRASH BIN */}
        {activeTab === 'TRASH' && (
          <div className="space-y-4 flex-1 overflow-y-auto">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              DANH SÁCH HỌC SINH ĐÃ XÓA TẠM THỜI ({trashData.deletedStudents.length})
            </h4>

            {trashData.deletedStudents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-bold">
                Thùng rác hiện đang trống!
              </div>
            ) : (
              <div className="space-y-2 border border-slate-200 rounded-2xl p-2 max-h-64 overflow-y-auto">
                {trashData.deletedStudents.map((st) => (
                  <div
                    key={st.id}
                    className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-extrabold text-slate-800">{st.fullName}</span>
                      <span className="ml-2 font-bold text-purple-700">Lớp {st.classCode}</span>
                      <span className="ml-2 font-mono text-[11px] text-slate-400">({st.studentCode})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleRestoreStudent(st.id)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg font-bold flex items-center gap-1"
                        title="Khôi phục lại vào lớp"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Khôi phục</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePermanentDeleteStudent(st.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold flex items-center gap-1"
                        title="Xóa vĩnh viễn"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa hẳn</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: RESET TEST DATA */}
        {activeTab === 'RESET' && (
          <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 space-y-4 flex-1">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-black text-rose-900">
                  DỌN DẸP DỮ LIỆU THỬ NGHIỆM
                </h4>
                <p className="text-xs text-rose-700 font-medium mt-1 leading-relaxed">
                  Chức năng này giúp cô xóa sạch các bài nộp thử nghiệm, bài làm mẫu và dọn sạch nhật ký kiểm tra để bắt đầu năm học mới tinh tươm.
                </p>
                <p className="text-xs text-rose-900 font-bold mt-2">
                  ✓ Giữ nguyên danh sách 5 lớp: 6A8, 6A9, 6A10, 6A11, 6A12
                  <br />
                  ✓ Giữ nguyên 12 bài học GDCD 6 chuẩn
                </p>
              </div>
            </div>

            <button
              type="button"
              id="btn-clean-test-data"
              onClick={handleResetTestData}
              className="py-3 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              🧹 DỌN DẸP DỮ LIỆU THỬ NGHIỆM NGAY
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
