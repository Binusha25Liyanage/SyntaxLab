import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import LandingPage from './pages/LandingPage';
import CoursesPage from './pages/CoursesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonPage from './pages/LessonPage';
import ProfilePage from './pages/ProfilePage';
import LeaderboardPage from './pages/LeaderboardPage';
import AiTutorPage from './pages/AiTutorPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCoursesPage from './pages/admin/AdminCoursesPage';
import CourseFormPage from './pages/admin/CourseFormPage';
import LessonFormPage from './pages/admin/LessonFormPage';
import ExerciseFormPage from './pages/admin/ExerciseFormPage';
import AdminQuizzesPage from './pages/admin/AdminQuizzesPage';
import QuizFormPage from './pages/admin/QuizFormPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import Aurora from './components/Aurora';

export default function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-70">
        <Aurora
          colorStops={['#8E0D17', '#C1121F', '#E8E8E8']}
          speed={0.45}
          blend={0.6}
          amplitude={0.9}
        />
      </div>

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/courses/:slug/:lessonSlug" element={<LessonPage />} />
            <Route path="/assistant" element={<AiTutorPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />

            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <AdminRoute>
                  <AdminCoursesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses/new"
              element={
                <AdminRoute>
                  <CourseFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/courses/:id/edit"
              element={
                <AdminRoute>
                  <CourseFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/lessons/new"
              element={
                <AdminRoute>
                  <LessonFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/lessons/:id/edit"
              element={
                <AdminRoute>
                  <LessonFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/exercises/new"
              element={
                <AdminRoute>
                  <ExerciseFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/exercises/:id/edit"
              element={
                <AdminRoute>
                  <ExerciseFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes"
              element={
                <AdminRoute>
                  <AdminQuizzesPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes/new"
              element={
                <AdminRoute>
                  <QuizFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/quizzes/:id/edit"
              element={
                <AdminRoute>
                  <QuizFormPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}
