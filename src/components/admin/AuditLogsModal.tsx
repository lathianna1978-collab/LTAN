import React, { useState, useEffect } from 'react';
import { X, ScrollText, Calendar, Clock, User, ShieldCheck } from 'lucide-react';
import { AuditLog } from '../../types';
import { apiAdmin } from '../../api';

interface AuditLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditLogsModal: React.FC<AuditLogsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      apiAdmin.getAuditLogs()
        .then(setLogs)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

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

        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <ScrollText className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-black text-slate-800">
              NHẬT KÝ QUẢN TRỊ (AUDIT LOGS)
            </h2>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            Lịch sử lưu trữ hoạt động quản lý, giao bài, nộp bài và phân quyền hệ thống
          </p>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400 font-bold">Đang tải nhật ký...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 font-bold">Chưa có bản ghi nhật ký nào.</div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 border border-slate-200 rounded-2xl p-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </span>
                    <span className="font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 text-[11px]">
                      {log.action}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800 text-sm">{log.details}</p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 self-end sm:self-center">
                  <User className="w-3.5 h-3.5 text-purple-600" />
                  <span>{log.performedBy}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
