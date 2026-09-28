import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  Search, 
  Download, 
  Upload, 
  RefreshCw, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  History, 
  Eye, 
  Sparkles,
  School,
  AlertTriangle,
  UserPlus
} from 'lucide-react';
import { ClassCode, GradebookEntry } from '../../types';
import { apiAdmin } from '../../api';

interface GradebookTableProps {
  selectedClass?: ClassCode | 'ALL';
  onSelectClass?: (c: ClassCode | 'ALL') => void;
  onOpenUploadRoster: (c: ClassCode) => void;
  onOpenAddStudent?: (c: ClassCode) => void;
  onViewStudentHistory?: (studentId: string) => void;
  onViewSubmissionDetail?: (submissionId: string) => void;
  onRefreshParent?: () => void;
}

export const GradebookTable: React.FC<GradebookTableProps> = ({
  selectedClass = 'ALL',
  onSelectClass,
  onOpenUploadRoster,
  onOpenAddStudent,
  onViewStudentHistory,
  onViewSubmissionDetail,
  onRefreshParent,
}) => {
  const [activeClass, setActiveClass] = useState<ClassCode | 'ALL'>(selectedClass);
  const [gradebook, setGradebook] = useState<GradebookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Reset confirm modal
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);
  const [wiping, setWiping] = useState(false);

  useEffect(() => {
    setActiveClass(selectedClass);
  }, [selectedClass]);

  const loadGradebook = async () => {
    setLoading(true);
    try {
      const cls = activeClass === 'ALL' ? undefined : activeClass;
      const data = await apiAdmin.getGradebook(cls);
      setGradebook(data);
    } catch (err) {
      console.error('Lỗi khi tải bảng điểm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGradebook();
  }, [activeClass]);

  const handleClassChange = (cls: ClassCode | 'ALL') => {
    setActiveClass(cls);
    if (onSelectClass) onSelectClass(cls);
  };

  // Filter students by search
  const filteredStudents = gradebook.filter(
    (st) =>
      st.fullName.toLowerCase().includes(search.toLowerCase()) ||
      st.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      st.classCode.toLowerCase().includes(search.toLowerCase())
  );

  // Export Excel matching school template
  const handleExportExcel = () => {
    if (filteredStudents.length === 0) {
      alert('Không có dữ liệu học sinh để xuất file Excel!');
      return;
    }

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
      'BÀI 11',
      'BÀI 12',
      'ĐIỂM TB',
    ];

    const rows = filteredStudents.map((st, idx) => {
      return [
        idx + 1,
        st.fullName,
        st.classCode,
        st.scores[1] ? st.scores[1].score : '',
        st.scores[2] ? st.scores[2].score : '',
        st.scores[3] ? st.scores[3].score : '',
        st.scores[4] ? st.scores[4].score : '',
        st.scores[5] ? st.scores[5].score : '',
        st.scores[6] ? st.scores[6].score : '',
        st.scores[7] ? st.scores[7].score : '',
        st.scores[8] ? st.scores[8].score : '',
        st.scores[9] ? st.scores[9].score : '',
        st.scores[10] ? st.scores[10].score : '',
        st.scores[11] ? st.scores[11].score : '',
        st.scores[12] ? st.scores[12].score : '',
        st.averageScore !== null ? st.averageScore : '',
      ];
    });

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 6 },  // STT
      { wch: 25 }, // Họ và tên
      { wch: 8 },  // Lớp
      { wch: 9 },  // BÀI 1
      { wch: 9 },  // BÀI 2
      { wch: 9 },  // BÀI 3
      { wch: 9 },  // BÀI 4
      { wch: 9 },  // BÀI 5
      { wch: 9 },  // BÀI 6
      { wch: 9 },  // BÀI 7
      { wch: 9 },  // BÀI 8
      { wch: 9 },  // BÀI 9
      { wch: 9 },  // BÀI 10
      { wch: 9 },  // BÀI 11
      { wch: 9 },  // BÀI 12
      { wch: 10 }, // ĐIỂM TB
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeClass === 'ALL' ? 'Toàn_Khối_6' : `Lớp_${activeClass}`);

    const fileName = `Bang_Diem_GDCD6_${activeClass === 'ALL' ? 'Toan_Khoi_6' : activeClass}_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Download official school blank template
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
      [1, 'Nguyễn Minh Anh', activeClass === 'ALL' ? '6A8' : activeClass, '', '', '', '', '', '', '', '', '', ''],
      [2, 'Trần Gia Huy', activeClass === 'ALL' ? '6A8' : activeClass, '', '', '', '', '', '', '', '', '', ''],
      [3, 'Lê Hoàng Nam', activeClass === 'ALL' ? '6A8' : activeClass, '', '', '', '', '', '', '', '', '', ''],
      [4, 'Phạm Quỳnh Chi', activeClass === 'ALL' ? '6A8' : activeClass, '', '', '', '', '', '', '', '', '', ''],
      [5, 'Vũ Đức Minh', activeClass === 'ALL' ? '6A8' : activeClass, '', '', '', '', '', '', '', '', '', ''],
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh_Sach_Hoc_Sinh');
    XLSX.writeFile(workbook, `Mau_Danh_Sach_Hoc_Sinh_Nha_Truong_${activeClass}.xlsx`);
  };

  // Wipe / reset all students and submissions
  const handleWipeAll = async () => {
    setWiping(true);
    try {
      const res = await apiAdmin.resetStudentsAndSubmissions();
      setShowWipeConfirm(false);
      await loadGradebook();
      if (onRefreshParent) onRefreshParent();
      alert(`🎉 ${res.message}`);
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa dữ liệu');
    } finally {
      setWiping(false);
    }
  };

  // Edit student name
  const handleSaveStudentName = async (studentId: string, classCode: ClassCode) => {
    if (!editName.trim()) return;
    try {
      await apiAdmin.updateStudent(studentId, editName.trim(), classCode);
      setEditingStudentId(null);
      loadGradebook();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi sửa tên học sinh');
    }
  };

  // Delete student
  const handleDeleteStudent = async (studentId: string, fullName: string, classCode: string) => {
    if (!confirm(`Cô có chắc chắn muốn XÓA học sinh "${fullName}" (${classCode}) khỏi danh sách không?`)) {
      return;
    }
    try {
      await apiAdmin.permanentDeleteStudent(studentId);
      loadGradebook();
      if (onRefreshParent) onRefreshParent();
    } catch (err: any) {
      alert(err.message || 'Lỗi khi xóa học sinh');
    }
  };

  // Helper for score badges
  const renderScoreCell = (scoreObj?: { score: number; submissionId: string }) => {
    if (!scoreObj) {
      return <span className="text-slate-300 font-bold text-xs select-none">--</span>;
    }

    const s = scoreObj.score;
    let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200';
    if (s < 5) {
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200';
    } else if (s < 8) {
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-200';
    }

    return (
      <button
        type="button"
        onClick={() => onViewSubmissionDetail && onViewSubmissionDetail(scoreObj.submissionId)}
        className={`px-2 py-0.5 rounded-lg border font-black text-xs transition-all transform hover:scale-105 cursor-pointer shadow-2xs ${badgeColor}`}
        title={`Bấm để xem chi tiết bài làm của học sinh (Điểm: ${s}/10)`}
      >
        {s % 1 === 0 ? s.toFixed(0) : s.toFixed(1)}
      </button>
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* HEADER CONTROLS BANNER */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-purple-100 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-purple-600" />
              <span>BẢNG ĐIỂM CHUẨN THEO MẪU NHÀ TRƯỜNG • BÀI 1 ĐẾN BÀI 12</span>
            </div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>📋 DANH SÁCH & BẢNG ĐIỂM TỰ ĐỘNG CẬP NHẬT</span>
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
              Học sinh làm xong bài nào, điểm số sẽ <strong>tự động điền vào đúng cột bài đó</strong> theo đúng định dạng nhà trường!
            </p>
          </div>

          {/* Quick Actions Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="py-2.5 px-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
              title="Tải file Excel mẫu gồm cột STT, Họ và tên để sao chép danh sách học sinh"
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Tải file mẫu Excel</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenUploadRoster(activeClass === 'ALL' ? '6A8' : activeClass)}
              className="py-2.5 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <Upload className="w-4 h-4" />
              <span>Tải danh sách học sinh lên</span>
            </button>

            <button
              type="button"
              onClick={handleExportExcel}
              className="py-2.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
              title="Xuất bảng điểm toàn bộ cột BÀI 1 - BÀI 12 ra Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất Excel bảng điểm</span>
            </button>

            <button
              type="button"
              onClick={() => setShowWipeConfirm(true)}
              className="py-2.5 px-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Xóa toàn bộ danh sách và bài làm cũ để tải danh sách mới"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Xóa sạch nạp mới</span>
            </button>
          </div>
        </div>

        {/* CLASS SELECTOR TABS & SEARCH */}
        <div className="mt-5 pt-4 border-t border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {(['ALL', '6A8', '6A9', '6A10', '6A11', '6A12'] as const).map((cls) => {
              const countInClass = cls === 'ALL' ? gradebook.length : gradebook.filter(g => g.classCode === cls).length;
              return (
                <button
                  type="button"
                  key={cls}
                  onClick={() => handleClassChange(cls)}
                  className={`py-2 px-3.5 rounded-2xl font-black text-xs whitespace-nowrap transition-all cursor-pointer ${
                    activeClass === cls
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cls === 'ALL' ? 'Toàn Khối 6' : `Lớp ${cls}`}
                  <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                    activeClass === cls ? 'bg-purple-800 text-purple-100' : 'bg-white text-slate-600'
                  }`}>
                    {countInClass}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Tìm theo họ tên, mã..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold outline-hidden focus:border-purple-500 bg-slate-50 focus:bg-white transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-bold">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <span>Đang cập nhật bảng điểm...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          /* EMPTY STATE WHEN ROSTER CLEARED */
          <div className="py-16 px-6 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-purple-100 text-purple-700 flex items-center justify-center text-3xl mx-auto mb-4 shadow-xs">
              📋
            </div>
            <h3 className="text-lg font-black text-slate-800 mb-2">
              DANH SÁCH HỌC SINH ĐANG TRỐNG
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed mb-6">
              Dữ liệu học sinh đã được làm sạch hoàn toàn theo yêu cầu. Cô An Na có thể tải file mẫu Excel hoặc bấm nút bên dưới để tải danh sách học sinh của nhà trường lên hệ thống!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer border border-slate-200"
              >
                <Download className="w-4 h-4 text-purple-600" />
                <span>Tải file Excel mẫu</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenUploadRoster(activeClass === 'ALL' ? '6A8' : activeClass)}
                className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Tải danh sách học sinh lên</span>
              </button>
            </div>
          </div>
        ) : (
          /* THE OFFICIAL ROSTER & GRADEBOOK TABLE */
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white text-xs font-black uppercase tracking-wider">
                  <th className="py-3 px-3 border border-purple-800/60 w-12 shrink-0">STT</th>
                  <th className="py-3 px-4 border border-purple-800/60 text-left min-w-[180px]">Họ và tên</th>
                  {activeClass === 'ALL' && (
                    <th className="py-3 px-2 border border-purple-800/60 w-16">Lớp</th>
                  )}
                  {/* BÀI 1 ĐẾN BÀI 10 (Chuẩn theo hình ảnh đính kèm) */}
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 1</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 2</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 3</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 4</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 5</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 6</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 7</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 8</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 9</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 10</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 11</th>
                  <th className="py-3 px-2 border border-purple-800/60 min-w-[55px]">BÀI 12</th>
                  <th className="py-3 px-3 border border-purple-800/60 min-w-[65px] bg-purple-950/80">ĐIỂM TB</th>
                  <th className="py-3 px-3 border border-purple-800/60 min-w-[90px]">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {filteredStudents.map((st, idx) => (
                  <tr key={st.studentId} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-2.5 px-3 border border-slate-200 font-bold text-slate-500">
                      {idx + 1}
                    </td>

                    {/* Họ và tên */}
                    <td className="py-2.5 px-4 border border-slate-200 text-left font-black text-slate-800">
                      {editingStudentId === st.studentId ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="px-2 py-1 rounded-lg border-2 border-purple-500 focus:outline-hidden text-xs font-bold w-full"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveStudentName(st.studentId, st.classCode)}
                            className="p-1 rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                            title="Lưu"
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingStudentId(null)}
                            className="p-1 rounded-md bg-slate-200 text-slate-600 hover:bg-slate-300"
                            title="Hủy"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <span className="cursor-pointer hover:text-purple-700" onClick={() => {
                          setEditingStudentId(st.studentId);
                          setEditName(st.fullName);
                        }}>
                          {st.fullName}
                        </span>
                      )}
                    </td>

                    {activeClass === 'ALL' && (
                      <td className="py-2.5 px-2 border border-slate-200 font-bold text-purple-700">
                        {st.classCode}
                      </td>
                    )}

                    {/* CÁC CỘT BÀI 1 ĐẾN 12 */}
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[1])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[2])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[3])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[4])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[5])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[6])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[7])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[8])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[9])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[10])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[11])}</td>
                    <td className="py-2 px-1 border border-slate-200">{renderScoreCell(st.scores[12])}</td>

                    {/* ĐIỂM TB */}
                    <td className="py-2 px-2 border border-slate-200 bg-purple-50/50 font-black text-xs text-purple-900">
                      {st.averageScore !== null ? (
                        <span className="px-2 py-0.5 rounded-md bg-purple-200/80 text-purple-900 font-black">
                          {st.averageScore.toFixed(1)}
                        </span>
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>

                    {/* Thao tác */}
                    <td className="py-2 px-2 border border-slate-200 whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => onViewStudentHistory && onViewStudentHistory(st.studentId)}
                          className="p-1 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Xem lịch sử làm bài"
                        >
                          <History className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStudentId(st.studentId);
                            setEditName(st.fullName);
                          }}
                          className="p-1 rounded-md text-amber-600 hover:bg-amber-50 transition-colors"
                          title="Sửa tên học sinh"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(st.studentId, st.fullName, st.classCode)}
                          className="p-1 rounded-md text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Xóa học sinh khỏi danh sách"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CONFIRM MODAL: RESET / WIPE ALL DATA */}
      {showWipeConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-rose-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mx-auto mb-4">
              ⚠️
            </div>
            <h3 className="text-lg font-black text-slate-800 text-center mb-2">
              XÓA VÀ LÀM MỚI TOÀN BỘ DỮ LIỆU?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-medium text-center leading-relaxed mb-6">
              Thao tác này sẽ xóa sạch danh sách học sinh hiện tại, toàn bộ bài nộp và lịch sử làm bài cũ để cô tải danh sách học sinh chính thức của nhà trường lên.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWipeConfirm(false)}
                className="flex-1 py-3 px-4 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                HỦY BỎ
              </button>
              <button
                type="button"
                disabled={wiping}
                onClick={handleWipeAll}
                className="flex-1 py-3 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5"
              >
                {wiping ? 'Đang làm sạch...' : '🧹 XÓA SẠCH NGAY'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
