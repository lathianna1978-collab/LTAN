import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { X, Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, ArrowRight, Check } from 'lucide-react';
import { ClassCode } from '../../types';
import { apiAdmin } from '../../api';

interface StudentImportModalProps {
  isOpen: boolean;
  initialClassCode: ClassCode;
  onClose: () => void;
  onSuccess: (importedCount: number) => void;
}

interface ParsedStudentRow {
  stt: number;
  fullName: string;
  classCode: string;
  isValid: boolean;
  error?: string;
}

export const StudentImportModal: React.FC<StudentImportModalProps> = ({
  isOpen,
  initialClassCode,
  onClose,
  onSuccess,
}) => {
  const [selectedClass, setSelectedClass] = useState<ClassCode>(initialClassCode || '6A8');
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [step, setStep] = useState<1 | 2>(1);
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedStudentRow[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Download official template matching user's image
  const handleDownloadTemplate = () => {
    const headers = [
      'STT',
      'Họ và tên',
      'Lớp',
      'BÀI 1',
      'BÀI 2',
      'BÀI 3',
      'BÀI 4',
      'BÀI 5',
      'BÀI 6',
      'BÀI 7',
      'BÀI 8',
      'BÀI 9',
      'BÀI 10',
    ];

    const sampleRows = [
      [1, 'Nguyễn Minh Anh', selectedClass, '', '', '', '', '', '', '', '', '', ''],
      [2, 'Trần Gia Huy', selectedClass, '', '', '', '', '', '', '', '', '', ''],
      [3, 'Lê Hoàng Nam', selectedClass, '', '', '', '', '', '', '', '', '', ''],
      [4, 'Phạm Quỳnh Chi', selectedClass, '', '', '', '', '', '', '', '', '', ''],
      [5, 'Vũ Đức Minh', selectedClass, '', '', '', '', '', '', '', '', '', ''],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleRows]);
    worksheet['!cols'] = [
      { wch: 6 },
      { wch: 25 },
      { wch: 8 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
      { wch: 9 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Lớp_${selectedClass}`);
    XLSX.writeFile(workbook, `Mau_Danh_Sach_Hoc_Sinh_${selectedClass}.xlsx`);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processSelectedFile(files[0]);
    }
  };

  const processSelectedFile = (uploadedFile: File) => {
    setFile(uploadedFile);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsName = wb.SheetNames[0];
        const ws = wb.Sheets[wsName];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!data || data.length === 0) {
          alert('File rỗng hoặc không có dữ liệu!');
          return;
        }

        // Smart Header & Column Detection
        let sttColIdx = -1;
        let nameColIdx = -1;
        let classColIdx = -1;
        let startRowIdx = 0;

        // Check first 5 rows to find header
        for (let r = 0; r < Math.min(5, data.length); r++) {
          const row = data[r] || [];
          for (let c = 0; c < row.length; c++) {
            const cell = String(row[c] || '').toLowerCase().trim();
            if (cell === 'stt' || cell.includes('số tt') || cell.includes('số thứ tự')) {
              sttColIdx = c;
              startRowIdx = r + 1;
            }
            if (cell.includes('họ và tên') || cell.includes('họ tên') || cell.includes('họ và chữ lót') || cell === 'tên' || cell.includes('name')) {
              nameColIdx = c;
              startRowIdx = r + 1;
            }
            if (cell === 'lớp' || cell.includes('lớp học') || cell === 'class') {
              classColIdx = c;
              startRowIdx = r + 1;
            }
          }
          if (nameColIdx !== -1) break;
        }

        // Fallbacks if no explicit headers found
        if (nameColIdx === -1) {
          // Assume STT is col 0, Name is col 1
          if (data[0] && data[0].length >= 2) {
            sttColIdx = 0;
            nameColIdx = 1;
            startRowIdx = 1;
          } else {
            nameColIdx = 0;
            startRowIdx = 0;
          }
        }

        const rows: ParsedStudentRow[] = [];
        const seenNames = new Set<string>();
        const errors: string[] = [];
        let autoStt = 1;

        for (let i = startRowIdx; i < data.length; i++) {
          const row = data[i];
          if (!row || row.length === 0) continue;

          // Extract STT
          let rowStt = autoStt;
          if (sttColIdx !== -1 && row[sttColIdx] !== undefined) {
            const parsedNum = parseInt(String(row[sttColIdx]).trim(), 10);
            if (!isNaN(parsedNum) && parsedNum > 0) {
              rowStt = parsedNum;
            }
          }

          // Extract Name
          let rawName = '';
          if (nameColIdx !== -1 && row[nameColIdx] !== undefined) {
            rawName = String(row[nameColIdx] || '').trim();
          } else {
            // Find first string cell that looks like a name
            for (let c = 0; c < row.length; c++) {
              const val = String(row[c] || '').trim();
              if (val && isNaN(Number(val)) && val.length > 2) {
                rawName = val;
                break;
              }
            }
          }

          if (!rawName) continue; // Skip empty row

          // Extract Class
          let rowClass = selectedClass;
          if (classColIdx !== -1 && row[classColIdx]) {
            const cVal = String(row[classColIdx]).trim().toUpperCase();
            if (['6A8', '6A9', '6A10', '6A11', '6A12'].includes(cVal)) {
              rowClass = cVal as ClassCode;
            }
          }

          let isValid = true;
          let rowError = '';

          if (seenNames.has(rawName.toLowerCase())) {
            isValid = false;
            rowError = 'Tên bị trùng trong file';
            errors.push(`Dòng ${i + 1}: Học sinh "${rawName}" bị trùng.`);
          } else {
            seenNames.add(rawName.toLowerCase());
          }

          rows.push({
            stt: rowStt,
            fullName: rawName,
            classCode: rowClass,
            isValid,
            error: rowError,
          });

          autoStt++;
        }

        setParsedRows(rows);
        setValidationErrors(errors);
        setStep(2);
      } catch (err) {
        alert('Không thể đọc file. Vui lòng kiểm tra định dạng Excel/CSV!');
      }
    };

    reader.readAsBinaryString(uploadedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmImport = async () => {
    const validStudents = parsedRows
      .filter((r) => r.isValid)
      .map((r) => ({ stt: r.stt, fullName: r.fullName, classCode: selectedClass }));

    if (validStudents.length === 0) {
      alert('Không có học sinh hợp lệ để nhập vào hệ thống!');
      return;
    }

    setLoading(true);
    try {
      const res = await apiAdmin.importStudents(selectedClass, validStudents, replaceExisting);
      onSuccess(res.importedCount);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi nhập danh sách');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-purple-100 relative overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">📤</span>
            <h2 className="text-2xl font-black text-slate-800">
              TẢI DANH SÁCH HỌC SINH
            </h2>
          </div>
          <p className="text-sm font-semibold text-slate-500">
            Hỗ trợ file Excel (.xlsx, .xls) và CSV (.csv)
          </p>
        </div>

        {/* BƯỚC 1: Chọn lớp & Tùy chọn */}
        <div className="mb-5 bg-purple-50 p-4 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between gap-2 mb-2">
            <label className="text-xs font-black text-purple-900 uppercase tracking-wider">
              BƯỚC 1: CHỌN LỚP NHẬP DANH SÁCH
            </label>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="text-xs font-bold text-purple-700 hover:text-purple-900 bg-white px-2.5 py-1 rounded-lg border border-purple-300 shadow-2xs flex items-center gap-1 cursor-pointer"
              title="Tải file mẫu Excel chuẩn gồm STT, Họ và tên, BÀI 1..10"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
              <span>📥 Tải file mẫu Excel chuẩn</span>
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 mb-3">
            {(['6A8', '6A9', '6A10', '6A11', '6A12'] as ClassCode[]).map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setSelectedClass(c)}
                className={`py-2 rounded-xl font-black text-sm border transition-all cursor-pointer ${
                  selectedClass === c
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                    : 'bg-white text-purple-900 border-purple-200 hover:bg-purple-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-700">
            <input
              type="checkbox"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
            />
            <span>Xóa sạch danh sách cũ của lớp {selectedClass} trước khi nạp mới (khuyên dùng khi nạp danh sách chuẩn của trường)</span>
          </label>
        </div>

        {/* BƯỚC 2: Chọn File */}
        {step === 1 && (
          <div className="flex-1 flex flex-col justify-center">
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-3 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all ${
                isDragOver
                  ? 'border-purple-500 bg-purple-50 scale-[1.01]'
                  : 'border-slate-300 hover:border-purple-400 bg-slate-50/60 hover:bg-purple-50/40'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-white shadow-xs flex items-center justify-center text-purple-600 mx-auto mb-3">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <p className="text-base font-extrabold text-slate-700 mb-1">
                📎 BẤM ĐỂ CHỌN FILE HOẶC KÉO THẢ VÀO ĐÂY
              </p>
              <p className="text-xs text-slate-500 font-semibold">
                Định dạng hỗ trợ: Microsoft Excel (.xlsx, .xls) hoặc CSV (.csv)
              </p>
            </div>
          </div>
        )}

        {/* BƯỚC 3 & 4: Xem trước và Xác nhận */}
        {step === 2 && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                BƯỚC 3: XEM TRƯỚC DỮ LIỆU ({parsedRows.length} dòng đọc được)
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-purple-600 hover:underline"
              >
                Chọn file khác
              </button>
            </div>

            {validationErrors.length > 0 && (
              <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs font-semibold">
                <div className="flex items-center gap-1.5 font-bold mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Phát hiện một số dòng không hợp lệ (hệ thống sẽ tự loại bỏ):</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 max-h-20 overflow-y-auto">
                  {validationErrors.slice(0, 5).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                  {validationErrors.length > 5 && (
                    <li>...và {validationErrors.length - 5} cảnh báo khác</li>
                  )}
                </ul>
              </div>
            )}

            {/* PREVIEW TABLE */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-2xl mb-4">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 sticky top-0 font-black text-slate-700">
                  <tr>
                    <th className="py-2.5 px-3">STT</th>
                    <th className="py-2.5 px-3">Họ và tên</th>
                    <th className="py-2.5 px-3">Lớp</th>
                    <th className="py-2.5 px-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {parsedRows.map((r) => (
                    <tr
                      key={r.stt}
                      className={r.isValid ? 'hover:bg-slate-50' : 'bg-rose-50/60 text-rose-800'}
                    >
                      <td className="py-2 px-3 font-bold text-slate-500">{r.stt}</td>
                      <td className="py-2 px-3 font-extrabold text-slate-800">{r.fullName}</td>
                      <td className="py-2 px-3 font-bold">{r.classCode}</td>
                      <td className="py-2 px-3">
                        {r.isValid ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Hợp lệ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" /> {r.error}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* BƯỚC 4: XÁC NHẬN */}
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                Sẽ nhập: <strong>{parsedRows.filter((r) => r.isValid).length}</strong> học sinh vào lớp{' '}
                <strong>{selectedClass}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 font-bold text-xs text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  HỦY
                </button>
                <button
                  type="button"
                  disabled={loading || parsedRows.filter((r) => r.isValid).length === 0}
                  onClick={handleConfirmImport}
                  className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>ĐANG NHẬP...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✅ NHẬP DANH SÁCH</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
