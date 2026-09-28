import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Upload, 
  Camera, 
  Trash2, 
  Image as ImageIcon 
} from 'lucide-react';

interface MascotHeroProps {
  onStartStudent: () => void;
  onOpenTeacher: () => void;
}

export const MascotHero: React.FC<MascotHeroProps> = ({ onStartStudent, onOpenTeacher }) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('thcs_tanhai_hero_image') || null;
    } catch {
      return null;
    }
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, JPEG, WebP)!');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Dung lượng hình ảnh không được vượt quá 5MB. Vui lòng chọn ảnh dung lượng nhỏ hơn.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setUploadedImage(result);
      try {
        localStorage.setItem('thcs_tanhai_hero_image', result);
      } catch (err) {
        console.error('Không thể lưu ảnh vào bộ nhớ:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedImage(null);
    try {
      localStorage.removeItem('thcs_tanhai_hero_image');
    } catch (err) {
      console.error(err);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative overflow-hidden py-8 sm:py-10 bg-gradient-hero border-b border-purple-100 rounded-b-3xl">
      {/* Decorative background floating elements */}
      <div className="absolute top-6 left-10 text-3xl animate-bounce duration-1000 opacity-80 pointer-events-none">⭐</div>
      <div className="absolute top-12 right-12 text-3xl animate-pulse opacity-80 pointer-events-none">✨</div>
      <div className="absolute bottom-6 left-1/4 text-2xl animate-spin-slow opacity-60 pointer-events-none">🌱</div>
      <div className="absolute top-1/3 right-1/4 text-2xl opacity-70 pointer-events-none">💡</div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        {/* Title badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-purple-200 text-purple-700 font-extrabold text-sm mb-4 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>MÔN GIÁO DỤC CÔNG DÂN 6 • THCS TÂN HẢI</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-3">
          🌟 <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent">HÀNH TRÌNH CÔNG DÂN NHÍ</span>
        </h1>

        {/* Slogan */}
        <div className="max-w-2xl mx-auto bg-white/70 backdrop-blur-xs py-1.5 px-4 rounded-2xl border border-purple-100 mb-6 inline-block shadow-xs">
          <p className="text-sm sm:text-base font-extrabold text-slate-700 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <span className="text-purple-600">📚 Học bài</span>
            <span>•</span>
            <span className="text-blue-600">🧠 Hiểu bài</span>
            <span>•</span>
            <span className="text-amber-600">✨ Vận dụng</span>
            <span>•</span>
            <span className="text-emerald-600">🌱 Trưởng thành</span>
          </p>
        </div>

        {/* Ô DUY NHẤT ĐỂ TẢI ẢNH LÊN */}
        <div className="flex justify-center mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {uploadedImage ? (
            <div className="inline-block relative group">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="relative rounded-3xl overflow-hidden bg-white p-2 sm:p-2.5 border-2 border-purple-200 shadow-soft hover:border-purple-400 transition-all cursor-pointer inline-flex items-center justify-center"
                title="Bấm để đổi sang ảnh khác"
              >
                <img
                  src={uploadedImage}
                  alt="Ảnh đã tải lên"
                  className="max-h-64 sm:max-h-80 md:max-h-96 max-w-full w-auto object-contain rounded-2xl group-hover:scale-[1.01] transition-transform duration-300 block"
                />

                {/* Overlay Action Buttons */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/95 hover:bg-white text-purple-700 text-xs font-black flex items-center gap-1.5 shadow-md border border-purple-200 hover:scale-105 transition-all cursor-pointer backdrop-blur-xs"
                    title="Đổi ảnh khác"
                  >
                    <Camera className="w-3.5 h-3.5 text-purple-600" />
                    <span>Đổi ảnh</span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage();
                    }}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black flex items-center gap-1.5 shadow-md hover:scale-105 transition-all cursor-pointer"
                    title="Xóa ảnh"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Xóa</span>
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 bg-slate-900/75 backdrop-blur-xs text-white text-[11px] font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 shadow-sm z-10">
                  <ImageIcon className="w-3.5 h-3.5 text-purple-300" />
                  <span>Ảnh đã lưu</span>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`w-full max-w-2xl rounded-3xl border-2 border-dashed p-8 sm:p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center group shadow-soft ${
                isDragging
                  ? 'border-purple-600 bg-purple-100 scale-[1.01]'
                  : 'border-purple-300 hover:border-purple-500 bg-white/90 hover:bg-white'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-xs">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-slate-800 mb-1">
                📸 BẤM ĐỂ TẢI ẢNH LÊN
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 max-w-md">
                Chọn ảnh từ máy hoặc kéo thả ảnh vào khung này (Hỗ trợ PNG, JPG, JPEG)
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">
                <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                <span>Khung ảnh tự ôm sát kích thước ảnh</span>
              </div>
            </div>
          )}
        </div>

        {/* 2 Big Action Cards required by spec */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1: HỌC SINH */}
          <div
            id="card-student-start"
            onClick={onStartStudent}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-purple-200 hover:border-purple-500 shadow-soft hover:shadow-card-hover transition-all duration-300 text-left cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                🎒
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 uppercase tracking-wider mb-1">
                  Dành cho Học sinh
                </span>
                <h2 className="text-2xl font-black text-slate-800 group-hover:text-purple-600 transition-colors">
                  HỌC SINH
                </h2>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
              Không cần tạo tài khoản! Chỉ cần điền họ tên, chọn lớp (6A8 – 6A12) và nhập mã bài tập cô giao để bắt đầu ngay.
            </p>

            <div className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md group-hover:from-purple-700 group-hover:to-indigo-700 transition-all">
              <span>🚀 BẮT ĐẦU HÀNH TRÌNH</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: GIÁO VIÊN */}
          <div
            id="card-teacher-portal"
            onClick={onOpenTeacher}
            className="group relative bg-white rounded-3xl p-6 sm:p-8 border-2 border-blue-200 hover:border-blue-500 shadow-soft hover:shadow-card-hover transition-all duration-300 text-left cursor-pointer transform hover:-translate-y-1 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full pointer-events-none"></div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-white flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                👩🏫
              </div>
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700 uppercase tracking-wider mb-1">
                  Khu vực Giáo viên
                </span>
                <h2 className="text-2xl font-black text-slate-800 group-hover:text-blue-600 transition-colors">
                  GIÁO VIÊN
                </h2>
              </div>
            </div>

            <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">
              Dành riêng cho <strong>Cô An Na</strong>: Quản lý 5 lớp (6A8–6A12), nhập danh sách học sinh, giao bài, xem bài nộp đã khóa và thống kê câu sai.
            </p>

            <div className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md group-hover:from-blue-700 group-hover:to-cyan-700 transition-all">
              <ShieldCheck className="w-5 h-5" />
              <span>🔐 KHU VỰC QUẢN LÝ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
