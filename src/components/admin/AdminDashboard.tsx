import React, { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  FileCheck,
  Clock,
  Star,
  TrendingUp,
  AlertTriangle,
  School,
  FileSpreadsheet,
  Settings,
  ScrollText,
  Plus,
  Search,
  Lock,
  Eye,
  RefreshCw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import {
  ClassItem,
  ClassCode,
  Lesson,
  Assignment,
  Submission,
  QuestionErrorStat,
  Student,
} from '../../types';
import { apiAdmin } from '../../api';

import { ClassManagement } from './ClassManagement';
import { StudentListModal } from './StudentListModal';
import { StudentImportModal } from './StudentImportModal';
import { LessonJourney } from './LessonJourney';
import { AssignmentEditorModal } from './AssignmentEditorModal';
import { SmartAssignmentImportModal } from './SmartAssignmentImportModal';
import { SubmissionReviewModal } from './SubmissionReviewModal';
import { TopErrorQuestionsModal } from './TopErrorQuestionsModal';
import { StudentHistoryModal } from './StudentHistoryModal';
import { ExcelExportModal } from './ExcelExportModal';
import { AdminSettingsModal } from './AdminSettingsModal';
import { AuditLogsModal } from './AuditLogsModal';
import { GradebookTable } from './GradebookTable';

interface AdminDashboardProps {
  adminUser: { displayName: string; username: string };
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'GRADEBOOK' | 'CLASSES' | 'LESSONS' | 'STUDENTS' | 'SUBMISSIONS'>('OVERVIEW');

  // Core data states
  const [overviewData, setOverviewData] = useState<{
    stats: {
      totalStudents: number;
      assignmentsGiven: number;
      completedCount: number;
      inProgressCount: number;
      averageScore: number;
      completionRate: number;
    };
    topErrors: QuestionErrorStat[];
  } | null>(null);

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [globalSearch, setGlobalSearch] = useState('');
  const [loading, setLoading] = useState(false);

  // Modals state
  const [viewRosterClass, setViewRosterClass] = useState<ClassCode | null>(null);
  const [uploadRosterClass, setUploadRosterClass] = useState<ClassCode | null>(null);
  const [editingAssignmentLessonId, setEditingAssignmentLessonId] = useState<string | null>(null);
  const [assignmentToEdit, setAssignmentToEdit] = useState<Assignment | undefined>(undefined);
  const [reviewSubmissionId, setReviewSubmissionId] = useState<string | null>(null);
  const [showTopErrorsModal, setShowTopErrorsModal] = useState(false);
  const [selectedErrorStat, setSelectedErrorStat] = useState<QuestionErrorStat | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyStudentId, setHistoryStudentId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false);
  const [showSmartImportModal, setShowSmartImportModal] = useState(false);
  const [smartImportLessonId, setSmartImportLessonId] = useState<string | undefined>(undefined);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [ov, cls, lsn, subs, stds] = await Promise.all([
        apiAdmin.getOverview(),
        apiAdmin.getClasses(),
        apiAdmin.getLessons(),
        apiAdmin.getSubmissions(),
        apiAdmin.getStudents(undefined, false),
      ]);
      setOverviewData(ov);
      setClasses(cls);
      setLessons(lsn);
      setSubmissions(subs);
      setStudents(stds);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const stats = overviewData?.stats || {
    totalStudents: 0,
    assignmentsGiven: 0,
    completedCount: 0,
    inProgressCount: 0,
    averageScore: 0,
    completionRate: 0,
  };

  const topErrors = overviewData?.topErrors || [];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      {/* GREETING HERO FOR CÔ AN NA */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-700 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-black tracking-wider mb-2">
              <span>👩🏫 KHÔNG GIAN SƯ PHẠM</span>
              <span>•</span>
              <span>GDCD 6</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight flex items-center gap-2">
              <span>👋 CHÀO CÔ AN NA!</span>
            </h1>
            <p className="text-sm sm:text-base font-semibold text-purple-100 mt-1">
              Cùng xem hành trình học tập của các em hôm nay nhé! 🌱
            </p>
          </div>

          {/* Quick Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              id="btn-open-smart-import-header"
              onClick={() => {
                setSmartImportLessonId(lessons[0]?.id || 'lesson-1');
                setShowSmartImportModal(true);
              }}
              className="py-2.5 px-4 rounded-2xl bg-amber-400 hover:bg-amber-300 text-purple-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-purple-900" />
              <span>📋 Tải bài tập / Dán tự động</span>
            </button>

            <button
              type="button"
              id="btn-open-export"
              onClick={() => setShowExportModal(true)}
              className="py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Xuất Excel</span>
            </button>

            <button
              type="button"
              id="btn-open-settings"
              onClick={() => setShowSettingsModal(true)}
              className="py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Settings className="w-4 h-4 text-amber-300" />
              <span>Cài đặt</span>
            </button>

            <button
              type="button"
              id="btn-open-audit-logs"
              onClick={() => setShowAuditLogsModal(true)}
              className="py-2.5 px-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-xs border border-white/20 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ScrollText className="w-4 h-4 text-cyan-300" />
              <span>Nhật ký</span>
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS */}
      <div className="bg-white border-b border-purple-100 sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto py-2.5 text-xs sm:text-sm font-black">
          {[
            { key: 'OVERVIEW', label: '📊 TỔNG QUAN', icon: TrendingUp },
            { key: 'GRADEBOOK', label: '📋 BẢNG ĐIỂM BÀI 1 - 12', icon: FileSpreadsheet },
            { key: 'CLASSES', label: '🏫 QUẢN LÝ LỚP HỌC', icon: School },
            { key: 'LESSONS', label: '📚 HÀNH TRÌNH BÀI HỌC', icon: BookOpen },
            { key: 'STUDENTS', label: '👨🎓 HỌC SINH', icon: Users },
            { key: 'SUBMISSIONS', label: '🔐 BÀI LÀM ĐÃ NỘP', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isCurrent = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as any)}
                className={`py-2.5 px-4 rounded-2xl flex items-center gap-2 shrink-0 transition-all cursor-pointer select-none ${
                  isCurrent
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* 6 STATS CARDS (SPEC 22) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {/* TỔNG HỌC SINH */}
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl mb-3">
                  👨🎓
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tổng học sinh
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {stats.totalStudents}
                </span>
              </div>

              {/* BÀI ĐÃ GIAO */}
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl mb-3">
                  📝
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Bài đã giao
                </span>
                <span className="text-2xl font-black text-slate-800">
                  {stats.assignmentsGiven}
                </span>
              </div>

              {/* ĐÃ HOÀN THÀNH */}
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl mb-3">
                  ✅
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Đã hoàn thành
                </span>
                <span className="text-2xl font-black text-emerald-600">
                  {stats.completedCount}
                </span>
              </div>

              {/* CHƯA HOÀN THÀNH */}
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl mb-3">
                  ⏳
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Chưa nộp
                </span>
                <span className="text-2xl font-black text-amber-600">
                  {stats.inProgressCount}
                </span>
              </div>

              {/* ĐIỂM TRUNG BÌNH */}
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-pink-700 flex items-center justify-center text-xl mb-3">
                  ⭐
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Điểm trung bình
                </span>
                <span className="text-2xl font-black text-purple-700">
                  {stats.averageScore}
                </span>
              </div>

              {/* TỶ LỆ HOÀN THÀNH */}
              <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl mb-3">
                  📈
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Tỷ lệ hoàn thành
                </span>
                <span className="text-2xl font-black text-indigo-600">
                  {stats.completionRate}%
                </span>
              </div>
            </div>

            {/* TOP ERROR QUESTIONS SECTION (SPEC 17) */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-500" />
                    <span>⚠️ CÂU HỌC SINH SAI NHIỀU NHẤT</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Bấm vào từng câu để xem phân tích tỉ lệ chọn đáp án A/B/C/D và lớp sai nhiều nhất
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTopErrorsModal(true)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>Xem phân tích chi tiết</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {topErrors.length === 0 ? (
                <div className="py-6 text-center text-xs font-bold text-slate-400">
                  Chưa ghi nhận câu hỏi có tỷ lệ sai nổi bật.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {topErrors.slice(0, 3).map((item, i) => {
                    const wrong = item.wrongRate ?? item.errorPercentage ?? 0;
                    return (
                      <div
                        key={item.questionId || i}
                        onClick={() => {
                          setSelectedErrorStat(item);
                          setShowTopErrorsModal(true);
                        }}
                        className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 hover:border-rose-400 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-black text-rose-800 bg-rose-100 px-2.5 py-0.5 rounded-md">
                            {wrong >= 60 ? '🔴' : '🟠'} Câu {item.questionOrder}
                          </span>
                          <span className="text-xs font-extrabold text-rose-700">
                            {wrong}% sai
                          </span>
                        </div>
                        <p className="text-xs font-bold text-slate-800 line-clamp-2 mb-2 group-hover:text-purple-700 transition-colors">
                          {item.content}
                        </p>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Lớp sai nhiều: <strong>{item.worstClass || item.mostErrorClass || '6A8'}</strong> • {item.totalResponses ?? item.totalAttempts ?? 0} bài làm
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RECENT SUBMISSIONS FEED */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-purple-600" />
                    <span>BÀI LÀM MỚI NỘP (ĐÃ KHÓA AN TOÀN)</span>
                  </h2>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Học sinh hoàn thành bài và nộp bài trên thiết bị
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('SUBMISSIONS')}
                  className="text-xs font-bold text-purple-700 hover:underline"
                >
                  Xem tất cả
                </button>
              </div>

              {submissions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 font-bold">
                  Chưa có bài nộp nào trong hệ thống.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-black uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Họ và tên</th>
                        <th className="py-3 px-4">Lớp</th>
                        <th className="py-3 px-4">Bài tập</th>
                        <th className="py-3 px-4">Điểm</th>
                        <th className="py-3 px-4">Thời gian nộp</th>
                        <th className="py-3 px-4">Trạng thái</th>
                        <th className="py-3 px-4 text-right">Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {submissions.slice(0, 5).map((sub) => (
                        <tr key={sub.id} className="hover:bg-purple-50/40">
                          <td className="py-3 px-4 font-black text-slate-800">{sub.studentName}</td>
                          <td className="py-3 px-4 font-bold text-purple-700">{sub.classCode}</td>
                          <td className="py-3 px-4 font-semibold text-slate-600">{sub.assignmentTitle}</td>
                          <td className="py-3 px-4 font-black text-purple-700">⭐ {sub.score}/10</td>
                          <td className="py-3 px-4 text-slate-500">
                            {sub.submittedAt ? new Date(sub.submittedAt).toLocaleTimeString('vi-VN') : '--:--'}
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 font-bold text-[11px] bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
                              <Lock className="w-3 h-3" /> Đã khóa
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setReviewSubmissionId(sub.id)}
                              className="py-1 px-2.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 font-bold text-xs cursor-pointer"
                            >
                              👁️ Xem
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB: GRADEBOOK BÀI 1 - 12 (THEO MẪU NHÀ TRƯỜNG) */}
        {activeTab === 'GRADEBOOK' && (
          <GradebookTable
            selectedClass="ALL"
            onOpenUploadRoster={(c) => setUploadRosterClass(c)}
            onViewStudentHistory={(stId) => {
              setHistoryStudentId(stId);
              setShowHistoryModal(true);
            }}
            onViewSubmissionDetail={(subId) => setReviewSubmissionId(subId)}
            onRefreshParent={loadAllData}
          />
        )}

        {/* TAB 2: CLASSES */}
        {activeTab === 'CLASSES' && (
          <ClassManagement
            classes={classes}
            onViewRoster={(c) => setViewRosterClass(c)}
            onUploadRoster={(c) => setUploadRosterClass(c)}
            onEditClass={(c) => {
              const newName = prompt('Nhập tên hiển thị mới cho lớp:', c.name);
              if (newName && newName.trim()) {
                apiAdmin.updateClass(c.id, newName.trim()).then(loadAllData);
              }
            }}
          />
        )}

        {/* TAB 3: LESSONS (12 GDCD 6) */}
        {activeTab === 'LESSONS' && (
          <LessonJourney
            lessons={lessons}
            onOpenAssignmentEditor={(lsnId, asg) => {
              setEditingAssignmentLessonId(lsnId);
              setAssignmentToEdit(asg);
            }}
            onOpenSmartImport={(lsnId) => {
              setSmartImportLessonId(lsnId);
              setShowSmartImportModal(true);
            }}
            onPreviewAssignment={(asg) => {
              alert(`Bài tập: ${asg.title}\nMã bài: ${asg.code}\nSố câu: ${asg.questions?.length || asg.questionCount || 0}\nThời gian: ${asg.durationMinutes} phút`);
            }}
          />
        )}

        {/* TAB 4: STUDENTS DIRECTORY & SEARCH */}
        {activeTab === 'STUDENTS' && (
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black text-slate-800">
                  👨🎓 DANH SÁCH TOÀN KHỐI 6 ({students.length} học sinh)
                </h2>
                <p className="text-xs text-slate-500 font-semibold">
                  Tìm kiếm, xem tiến trình lịch sử học tập và quản lý thông tin
                </p>
              </div>

              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  placeholder="Tìm học sinh theo tên, mã..."
                  className="w-full pl-9 pr-4 py-2 rounded-2xl border border-slate-200 text-xs font-bold outline-hidden focus:border-purple-500"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-black uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Mã HS</th>
                    <th className="py-3 px-4">Họ và tên</th>
                    <th className="py-3 px-4">Lớp</th>
                    <th className="py-3 px-4 text-right">Thao tác của Cô</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students
                    .filter((st) =>
                      st.fullName.toLowerCase().includes(globalSearch.toLowerCase()) ||
                      st.classCode.toLowerCase().includes(globalSearch.toLowerCase())
                    )
                    .map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-mono font-bold text-purple-700">{st.studentCode}</td>
                        <td className="py-3 px-4 font-black text-slate-800">{st.fullName}</td>
                        <td className="py-3 px-4 font-bold">{st.classCode}</td>
                        <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              const newName = prompt(`Sửa họ và tên cho học sinh "${st.fullName}":`, st.fullName);
                              if (newName && newName.trim() && newName.trim() !== st.fullName) {
                                apiAdmin.updateStudent(st.id, newName.trim(), st.classCode).then(() => {
                                  alert('Đã cập nhật tên học sinh!');
                                  loadAllData();
                                }).catch(err => alert(err.message || 'Lỗi khi cập nhật'));
                              }
                            }}
                            className="py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                            title="Chỉnh sửa tên học sinh khi bị sai thông tin"
                          >
                            <span>✏️ Sửa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Cô có chắc chắn muốn XÓA học sinh "${st.fullName}" (${st.classCode}) không?\n\nThao tác này dùng khi học sinh bị trùng tên hoặc sai thông tin.`)) {
                                apiAdmin.permanentDeleteStudent(st.id).then(() => {
                                  alert('Đã xóa học sinh và dọn dẹp dữ liệu trùng!');
                                  loadAllData();
                                }).catch(err => alert(err.message || 'Lỗi khi xóa'));
                              }
                            }}
                            className="py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                            title="Xóa học sinh bị trùng hoặc sai thông tin"
                          >
                            <span>🗑️ Xóa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setHistoryStudentId(st.id);
                              setShowHistoryModal(true);
                            }}
                            className="py-1 px-2.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                          >
                            <span>🕘 Lịch sử</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: ALL SUBMISSIONS */}
        {activeTab === 'SUBMISSIONS' && (
          <div className="bg-white rounded-3xl p-6 border border-purple-100 shadow-soft space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-800">
                🔐 TẤT CẢ BÀI LÀM ĐÃ NỘP & KHÓA AN TOÀN
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                Bài làm học sinh được bảo vệ tuyệt đối • Cô có thể mở xem và phân quyền xem lại
              </p>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-black uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Học sinh</th>
                    <th className="py-3 px-4">Lớp</th>
                    <th className="py-3 px-4">Bài tập</th>
                    <th className="py-3 px-4">Điểm</th>
                    <th className="py-3 px-4">Thời gian</th>
                    <th className="py-3 px-4">Quyền học sinh</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-black text-slate-800">{sub.studentName}</td>
                      <td className="py-3 px-4 font-bold text-purple-700">{sub.classCode}</td>
                      <td className="py-3 px-4 font-semibold text-slate-700">{sub.assignmentTitle}</td>
                      <td className="py-3 px-4 font-black text-purple-700">⭐ {sub.score}/10</td>
                      <td className="py-3 px-4 text-slate-500">
                        {Math.floor(sub.totalTimeSeconds / 60)}p {sub.totalTimeSeconds % 60}s
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {sub.reviewPermission === 'LOCKED'
                            ? '🔒 Khóa hoàn toàn'
                            : sub.reviewPermission === 'SCORE_ONLY'
                            ? '⭐ Chỉ xem điểm'
                            : sub.reviewPermission === 'QUESTIONS_NO_ANSWERS'
                            ? '📝 Ẩn đáp án'
                            : '🔓 Xem đầy đủ'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setReviewSubmissionId(sub.id)}
                          className="py-1 px-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs cursor-pointer shadow-xs inline-flex items-center gap-1"
                        >
                          <span>👁️ Duyệt</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Cô có muốn ĐẶT LẠI bài làm để học sinh "${sub.studentName}" (${sub.classCode}) có thể làm lại bài không?`)) {
                              apiAdmin.resetSubmission(sub.id).then(() => {
                                alert('Đã đặt lại bài làm thành công!');
                                loadAllData();
                              }).catch(err => alert(err.message || 'Lỗi khi đặt lại bài'));
                            }
                          }}
                          className="py-1 px-2.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                          title="Cho phép học sinh làm lại"
                        >
                          <span>🔄 Làm lại</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Cô có chắc chắn muốn XÓA bài nộp của học sinh "${sub.studentName}" (${sub.classCode}) không?\n\nThao tác này dùng khi học sinh bị trùng hoặc nộp sai thông tin.`)) {
                              apiAdmin.deleteSubmission(sub.id).then(() => {
                                alert('Đã xóa bài làm thành công!');
                                loadAllData();
                              }).catch(err => alert(err.message || 'Lỗi khi xóa bài'));
                            }
                          }}
                          className="py-1 px-2.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs cursor-pointer inline-flex items-center gap-1"
                          title="Xóa bài làm bị trùng hoặc sai thông tin"
                        >
                          <span>🗑️ Xóa</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Student Roster Modal */}
      {viewRosterClass && (
        <StudentListModal
          isOpen={true}
          classCode={viewRosterClass}
          onClose={() => setViewRosterClass(null)}
          onViewStudentHistory={(stId) => {
            setHistoryStudentId(stId);
            setShowHistoryModal(true);
          }}
          onRefreshClasses={loadAllData}
          onUploadRoster={(c) => setUploadRosterClass(c)}
          onViewSubmissionDetail={(subId) => setReviewSubmissionId(subId)}
        />
      )}

      {/* 2. Student Import Excel Modal */}
      {uploadRosterClass && (
        <StudentImportModal
          isOpen={true}
          initialClassCode={uploadRosterClass}
          onClose={() => setUploadRosterClass(null)}
          onSuccess={() => {
            loadAllData();
            alert('Nhập danh sách học sinh thành công!');
          }}
        />
      )}

      {/* 2.5 Smart Assignment Import Modal */}
      {showSmartImportModal && (
        <SmartAssignmentImportModal
          isOpen={true}
          lessons={lessons}
          initialLessonId={smartImportLessonId || lessons[0]?.id}
          onClose={() => setShowSmartImportModal(false)}
          onSuccess={loadAllData}
          onOpenInEditor={(parsedData) => {
            setShowSmartImportModal(false);
            setAssignmentToEdit({
              id: 'temp-asg-' + Date.now(),
              title: parsedData.title,
              code: parsedData.code,
              lessonId: parsedData.lessonId,
              durationMinutes: parsedData.durationMinutes,
              type: parsedData.type,
              dueDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
              isLocked: false,
              isDeleted: false,
              order: 1,
              hideAnswersAfterSubmit: true,
              questions: parsedData.questions,
            });
            setEditingAssignmentLessonId(parsedData.lessonId);
          }}
        />
      )}

      {/* 3. Assignment Editor Modal */}
      {editingAssignmentLessonId && (
        <AssignmentEditorModal
          isOpen={true}
          lessonId={editingAssignmentLessonId}
          assignmentToEdit={assignmentToEdit}
          lessons={lessons}
          onClose={() => {
            setEditingAssignmentLessonId(null);
            setAssignmentToEdit(undefined);
          }}
          onSuccess={loadAllData}
        />
      )}

      {/* 4. Submission Review Modal */}
      {reviewSubmissionId && (
        <SubmissionReviewModal
          submissionId={reviewSubmissionId}
          onClose={() => setReviewSubmissionId(null)}
          onRefresh={loadAllData}
        />
      )}

      {/* 5. Top Errors Modal */}
      <TopErrorQuestionsModal
        isOpen={showTopErrorsModal}
        onClose={() => setShowTopErrorsModal(false)}
        errorStats={topErrors}
        selectedStat={selectedErrorStat}
        onSelectStat={(st) => setSelectedErrorStat(st)}
      />

      {/* 6. Student History Modal */}
      <StudentHistoryModal
        isOpen={showHistoryModal}
        initialStudentId={historyStudentId}
        classes={classes}
        onClose={() => {
          setShowHistoryModal(false);
          setHistoryStudentId(null);
        }}
      />

      {/* 7. Excel Export Modal */}
      <ExcelExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* 8. Settings Modal */}
      <AdminSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onRefreshData={loadAllData}
      />

      {/* 9. Audit Logs Modal */}
      <AuditLogsModal
        isOpen={showAuditLogsModal}
        onClose={() => setShowAuditLogsModal(false)}
      />
    </div>
  );
};
