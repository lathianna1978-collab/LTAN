import React from 'react';
import { Sparkles, Shield, User, LogOut, Compass, BookOpen, GraduationCap } from 'lucide-react';

interface HeaderProps {
  currentView: 'home' | 'student-exam' | 'student-result' | 'admin-dashboard';
  onNavigateHome: () => void;
  onOpenTeacherLogin: () => void;
  adminUser: { displayName: string; username: string } | null;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigateHome,
  onOpenTeacherLogin,
  adminUser,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-purple-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & App Branding */}
          <div
            id="brand-header"
            onClick={onNavigateHome}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-7 h-7 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent tracking-tight">
                  🌟 HÀNH TRÌNH CÔNG DÂN NHÍ
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                  GDCD 6 • THCS TÂN HẢI
                </span>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 hidden md:block">
                📚 Học bài • 🧠 Hiểu bài • ✨ Vận dụng • 🌱 Trưởng thành
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-3">
            {adminUser ? (
              <div className="flex items-center gap-2 sm:gap-3 bg-purple-50 border border-purple-200 py-1.5 px-3 sm:px-4 rounded-2xl shadow-xs">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner">
                  👩🏫
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs text-purple-600 font-medium">Giáo viên quản trị</div>
                  <div className="text-sm font-bold text-purple-900">{adminUser.displayName}</div>
                </div>
                <button
                  id="btn-admin-logout"
                  onClick={onLogout}
                  title="Đăng xuất"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="btn-teacher-portal"
                onClick={onOpenTeacherLogin}
                className="flex items-center gap-2 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 font-bold text-xs sm:text-sm shadow-xs hover:border-purple-300 transition-all cursor-pointer"
              >
                <Shield className="w-4 h-4 text-purple-600" />
                <span>👩🏫 CÔ AN NA</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
