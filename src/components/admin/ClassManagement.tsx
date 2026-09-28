import React from 'react';
import { School, Users, Eye, Upload, Edit3, Sparkles } from 'lucide-react';
import { ClassItem, ClassCode } from '../../types';

interface ClassManagementProps {
  classes: ClassItem[];
  onViewRoster: (classCode: ClassCode) => void;
  onUploadRoster: (classCode: ClassCode) => void;
  onEditClass: (classItem: ClassItem) => void;
}

export const ClassManagement: React.FC<ClassManagementProps> = ({
  classes,
  onViewRoster,
  onUploadRoster,
  onEditClass,
}) => {
  const getClassTheme = (code: ClassCode) => {
    switch (code) {
      case '6A8':
        return {
          bg: 'bg-purple-50/70',
          border: 'border-purple-200 hover:border-purple-400',
          badge: 'bg-purple-100 text-purple-800 border-purple-200',
          btnView: 'bg-purple-600 hover:bg-purple-700 text-white',
          btnUpload: 'bg-white hover:bg-purple-50 text-purple-700 border-purple-200',
          icon: '💜',
        };
      case '6A9':
        return {
          bg: 'bg-blue-50/70',
          border: 'border-blue-200 hover:border-blue-400',
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          btnView: 'bg-blue-600 hover:bg-blue-700 text-white',
          btnUpload: 'bg-white hover:bg-blue-50 text-blue-700 border-blue-200',
          icon: '💙',
        };
      case '6A10':
        return {
          bg: 'bg-cyan-50/70',
          border: 'border-cyan-200 hover:border-cyan-400',
          badge: 'bg-cyan-100 text-cyan-800 border-cyan-200',
          btnView: 'bg-cyan-600 hover:bg-cyan-700 text-white',
          btnUpload: 'bg-white hover:bg-cyan-50 text-cyan-700 border-cyan-200',
          icon: '🩵',
        };
      case '6A11':
        return {
          bg: 'bg-emerald-50/70',
          border: 'border-emerald-200 hover:border-emerald-400',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          btnView: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          btnUpload: 'bg-white hover:bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: '💚',
        };
      case '6A12':
      default:
        return {
          bg: 'bg-amber-50/70',
          border: 'border-amber-200 hover:border-amber-400',
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          btnView: 'bg-amber-600 hover:bg-amber-700 text-white',
          btnUpload: 'bg-white hover:bg-amber-50 text-amber-700 border-amber-200',
          icon: '🧡',
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2.5">
            <span>🏫 QUẢN LÝ LỚP HỌC</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700">
              5 Lớp chuẩn GDCD 6
            </span>
          </h2>
          <p className="text-sm text-slate-500 font-semibold mt-1">
            Quản lý danh sách học sinh theo từng lớp 6A8, 6A9, 6A10, 6A11, 6A12
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {classes.map((cls) => {
          const theme = getClassTheme(cls.code);
          return (
            <div
              key={cls.id}
              id={`class-card-${cls.code}`}
              className={`rounded-3xl p-6 border-2 transition-all duration-300 shadow-soft hover:shadow-card-hover flex flex-col justify-between ${theme.bg} ${theme.border} transform hover:-translate-y-1`}
            >
              {/* Card Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl">
                    {theme.icon}
                  </div>
                  <span className={`text-xs font-black px-2.5 py-1 rounded-full border ${theme.badge}`}>
                    Khối 6
                  </span>
                </div>

                <h3 className="text-xl font-black text-slate-800 mb-1">
                  {cls.name}
                </h3>

                <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 mb-5">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>{cls.studentCount || 0} học sinh</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60">
                <button
                  type="button"
                  onClick={() => onViewRoster(cls.code)}
                  className={`w-full py-2.5 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer ${theme.btnView}`}
                >
                  <Eye className="w-4 h-4" />
                  <span>👁️ Xem danh sách</span>
                </button>

                <button
                  type="button"
                  onClick={() => onUploadRoster(cls.code)}
                  className={`w-full py-2 px-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${theme.btnUpload}`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>📤 Tải danh sách</span>
                </button>

                <button
                  type="button"
                  onClick={() => onEditClass(cls)}
                  className="w-full py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-white/60 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>✏️ Chỉnh sửa tên</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
