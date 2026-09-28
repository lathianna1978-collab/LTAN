import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { ClassCode } from '../../types';
import { apiAdmin, getAdminToken } from '../../api';

interface ExcelExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExcelExportModal: React.FC<ExcelExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedScope, setSelectedScope] = useState<ClassCode | 'ALL'>('ALL');
  const [exportType, setExportType] = useState<'submissions' | 'history'>('submissions');
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const token = getAdminToken();
      let url = '';
      let defaultFileName = '';

      if (exportType === 'submissions') {
        url = apiAdmin.getExportUrl(selectedScope);
        defaultFileName = `BaoCao_GDCD6_${selectedScope}_${new Date().toISOString().split('T')[0]}.xlsx`;
      } else {
        url = apiAdmin.getHistoryExportUrl();
        defaultFileName = `LichSuHocTap_GDCD6_${new Date().toISOString().split('T')[0]}.xlsx`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Không thể tạo file báo cáo Excel');
      }

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = defaultFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi tải file báo cáo');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto mb-3 shadow-xs">
            <FileSpreadsheet className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            XUẤT BÁO CÁO EXCEL
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1">
            Định dạng Microsoft Excel (.xlsx) chuẩn học vụ
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {/* LOẠI BÁO CÁO */}
          <div>
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
              LOẠI DỮ LIỆU CẦN XUẤT:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs font-bold">
              <button
                type="button"
                onClick={() => setExportType('submissions')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  exportType === 'submissions'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                📊 Kết quả bài làm & Điểm số
              </button>

              <button
                type="button"
                onClick={() => setExportType('history')}
                className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                  exportType === 'history'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-200'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                🕘 Toàn bộ lịch sử học tập
              </button>
            </div>
          </div>

          {/* PHẠM VI LỚP */}
          {exportType === 'submissions' && (
            <div>
              <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-2">
                CHỌN PHẠM VI LỚP:
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['ALL', '6A8', '6A9', '6A10', '6A11', '6A12'] as const).map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setSelectedScope(sc)}
                    className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                      selectedScope === sc
                        ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {sc === 'ALL' ? 'Toàn bộ khối 6' : sc}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Excel Columns preview tag */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-600">
            <strong>Cột xuất dữ liệu:</strong> STT • Họ và tên • Lớp • Tên bài • Điểm số • Số câu đúng • Thời gian làm • Ngày nộp • Trạng thái
          </div>
        </div>

        <button
          type="button"
          id="btn-confirm-export-excel"
          disabled={downloading}
          onClick={handleDownload}
          className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-all"
        >
          {downloading ? (
            <span>ĐANG KHỞI TẠO FILE EXCEL...</span>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>📥 TẢI FILE EXCEL (.XLSX)</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
