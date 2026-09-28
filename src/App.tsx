import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { MascotHero } from './components/MascotHero';
import { Footer } from './components/Footer';
import { StudentEntryModal } from './components/student/StudentEntryModal';
import { StudentExamScreen } from './components/student/StudentExamScreen';
import { StudentCompletionScreen } from './components/student/StudentCompletionScreen';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { apiAuth, removeAdminToken } from './api';
import { Sparkles, Compass, BookOpen, ShieldCheck, HeartHandshake, Award } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'student-exam' | 'student-result' | 'admin-dashboard'>('home');
  
  // Student active session state
  const [examData, setExamData] = useState<any>(null);
  const [examResult, setExamResult] = useState<any>(null);

  // Admin authentication state
  const [adminUser, setAdminUser] = useState<{ displayName: string; username: string } | null>(null);

  // Modals
  const [showStudentEntry, setShowStudentEntry] = useState(false);
  const [showTeacherLogin, setShowTeacherLogin] = useState(false);

  // Welcome toast notification
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);

  useEffect(() => {
    // Check if admin is already logged in
    apiAuth.getMe()
      .then((res) => {
        if (res && res.user) {
          setAdminUser(res.user);
        }
      })
      .catch(() => {
        // Not logged in or expired token
      });
  }, []);

  const handleStartExam = (data: any) => {
    setExamData(data);
    setShowStudentEntry(false);
    setCurrentView('student-exam');
  };

  const handleCompleteExam = (result: any) => {
    setExamResult(result);
    setCurrentView('student-result');
  };

  const handleLoginSuccess = (user: any, welcomeMessage: string) => {
    setAdminUser(user);
    setWelcomeToast(welcomeMessage || '👋 Xin chào, Cô An Na! Chào mừng cô trở lại Hành trình Công dân nhí 🌷');
    setCurrentView('admin-dashboard');

    setTimeout(() => {
      setWelcomeToast(null);
    }, 4000);
  };

  const handleLogout = async () => {
    try {
      await apiAuth.logout();
    } catch (e) {
      console.error(e);
    }
    removeAdminToken();
    setAdminUser(null);
    setCurrentView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 antialiased selection:bg-purple-100 selection:text-purple-900">
      {/* WELCOME TOAST BANNER */}
      {welcomeToast && (
        <div className="fixed top-24 right-4 sm:right-8 z-50 p-4 rounded-3xl bg-white/95 backdrop-blur-md border-2 border-purple-300 shadow-2xl animate-in slide-in-from-top-4 duration-300 max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl shrink-0">
              🌷
            </div>
            <div>
              <div className="text-xs font-black text-purple-700 uppercase tracking-wider">
                XÁC THỰC THÀNH CÔNG
              </div>
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                {welcomeToast}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RENDER VIEWS */}
      {currentView === 'student-exam' && examData ? (
        <StudentExamScreen
          examData={examData}
          onComplete={handleCompleteExam}
        />
      ) : currentView === 'student-result' && examResult ? (
        <StudentCompletionScreen
          result={examResult}
          onReturnHome={() => setCurrentView('home')}
        />
      ) : currentView === 'admin-dashboard' && adminUser ? (
        <>
          <Header
            currentView={currentView}
            onNavigateHome={() => setCurrentView('home')}
            onOpenTeacherLogin={() => setShowTeacherLogin(true)}
            adminUser={adminUser}
            onLogout={handleLogout}
          />
          <AdminDashboard adminUser={adminUser} onLogout={handleLogout} />
        </>
      ) : (
        /* HOME VIEW */
        <>
          <Header
            currentView={currentView}
            onNavigateHome={() => setCurrentView('home')}
            onOpenTeacherLogin={() => {
              if (adminUser) {
                setCurrentView('admin-dashboard');
              } else {
                setShowTeacherLogin(true);
              }
            }}
            adminUser={adminUser}
            onLogout={handleLogout}
          />

          <main className="flex-1">
            <MascotHero
              onStartStudent={() => setShowStudentEntry(true)}
              onOpenTeacher={() => {
                if (adminUser) {
                  setCurrentView('admin-dashboard');
                } else {
                  setShowTeacherLogin(true);
                }
              }}
            />

            {/* CURRICULUM VALUES SHOWCASE SECTION */}
            <section className="py-12 max-w-6xl mx-auto px-4 sm:px-6">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-black mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>MỤC TIÊU PHÁT TRIỂN PHẨM CHẤT & NĂNG LỰC</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
                  4 TRỤ CỘT HÀNH TRÌNH CÔNG DÂN NHÍ
                </h2>
                <p className="text-sm font-semibold text-slate-500 mt-1">
                  Đồng hành cùng học sinh THCS Tân Hải rèn luyện đạo đức, kĩ năng sống và trách nhiệm công dân
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-3xl border border-purple-100 shadow-soft hover:shadow-card-hover transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-2xl mb-4">
                    📚
                  </div>
                  <h3 className="text-base font-black text-slate-800 mb-1.5">
                    Học bài
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Nắm chắc hệ thống kiến thức chuẩn GDCD 6, từ truyền thống gia đình đến các quyền và nghĩa vụ công dân.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-blue-100 shadow-soft hover:shadow-card-hover transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl mb-4">
                    🧠
                  </div>
                  <h3 className="text-base font-black text-slate-800 mb-1.5">
                    Hiểu bài
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Phân tích tình huống đa chiều, nhận thức đúng sai và phát triển tư duy phản biện nhân văn.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-soft hover:shadow-card-hover transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl mb-4">
                    ✨
                  </div>
                  <h3 className="text-base font-black text-slate-800 mb-1.5">
                    Vận dụng
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Đưa bài học vào hành vi ứng xử hàng ngày: yêu thương con người, siêng năng, tiết kiệm và tự lập.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-soft hover:shadow-card-hover transition-all">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4">
                    🌱
                  </div>
                  <h3 className="text-base font-black text-slate-800 mb-1.5">
                    Trưởng thành
                  </h3>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed">
                    Từng bước tôi luyện phẩm chất tốt đẹp để trở thành những công dân có ích và tự hào của đất nước.
                  </p>
                </div>
              </div>
            </section>
          </main>

          <Footer />
        </>
      )}

      {/* STUDENT ENTRY MODAL */}
      <StudentEntryModal
        isOpen={showStudentEntry}
        onClose={() => setShowStudentEntry(false)}
        onStartExam={handleStartExam}
      />

      {/* TEACHER LOGIN MODAL */}
      <AdminLoginModal
        isOpen={showTeacherLogin}
        onClose={() => setShowTeacherLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
