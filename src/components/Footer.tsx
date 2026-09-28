import React from 'react';
import { Compass, Heart, BookOpen, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-purple-100 py-10 px-4 sm:px-6 lg:px-8 text-center mt-auto">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-brand flex items-center justify-center text-white shadow-xs">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-lg font-black bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">
            🌟 HÀNH TRÌNH CÔNG DÂN NHÍ
          </span>
          <span className="text-xs font-black px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
            GDCD 6
          </span>
        </div>

        <p className="text-xs sm:text-sm font-extrabold text-slate-600">
          📚 Học bài • 🧠 Hiểu bài • ✨ Vận dụng • 🌱 Trưởng thành
        </p>

        <p className="text-xs text-slate-400 font-medium">
          Dành riêng cho Cô An Na và các thế hệ học sinh khối 6 (6A8, 6A9, 6A10, 6A11, 6A12) • THCS Tân Hải
        </p>

        <div className="text-[11px] text-slate-400 font-semibold pt-2 border-t border-slate-100 flex items-center justify-center gap-1">
          <span>Hệ thống bảo vệ dữ liệu học tập thông minh & an toàn</span>
          <span>•</span>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
};
