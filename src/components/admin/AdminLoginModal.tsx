import React, { useState } from 'react';
import { X, Lock, User, ShieldCheck, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { apiAuth, setAdminToken } from '../../api';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: any, message: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('coanna');
  const [password, setPassword] = useState('Annalhp1978');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await apiAuth.login(username, password);
      setAdminToken(res.token);
      onLoginSuccess(res.user, res.welcomeMessage);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        id="modal-admin-login"
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-md">
            👩🏫
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            KHU VỰC QUẢN TRỊ
          </h2>
          <p className="text-sm font-bold text-blue-600 mt-1">
            Dành riêng cho Cô An Na
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-bold flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-600" />
              <span>Tên đăng nhập</span>
            </label>
            <input
              id="admin-username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="coanna"
              className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-hidden font-bold text-slate-800 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-extrabold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-purple-600" />
              <span>Mật khẩu quản trị</span>
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu..."
                className="w-full px-4 py-3 pr-11 rounded-2xl border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-hidden font-bold text-slate-800 transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1.5">
              * Mật khẩu quản trị của cô: <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono font-bold text-purple-700">Annalhp1978$</code>
            </p>
          </div>

          <button
            id="btn-admin-login-submit"
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>ĐANG XÁC THỰC...</span>
              </div>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>ĐĂNG NHẬP QUẢN TRỊ</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
