import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './layouts/AppLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import StudentLayout from './layouts/StudentLayout'
import TeacherLayout from './layouts/TeacherLayout'
import StudentDashboardPage from './pages/student/StudentDashboardPage'
import RecordedSessionsPage from './pages/student/RecordedSessionsPage'
import LectureDetailsPage from './pages/student/LectureDetailsPage'
import StudentCoursesPage from './pages/student/StudentCoursesPage'
import StudentMaterialsPage from './pages/student/StudentMaterialsPage'
import BookmarksPage from './pages/student/BookmarksPage'
import ProfilePage from './pages/ProfilePage'
import TeacherDashboardPage from './pages/teacher/TeacherDashboardPage'
import ManageCoursesPage from './pages/teacher/ManageCoursesPage'
import ManageModulesPage from './pages/teacher/ManageModulesPage'
import ManageLecturesPage from './pages/teacher/ManageLecturesPage'
import TeacherMaterialsPage from './pages/teacher/TeacherMaterialsPage'
import StudentAssignmentsPage from './pages/student/StudentAssignmentsPage'
import AssignmentDetailsPage from './pages/student/AssignmentDetailsPage'
import ManageAssignmentsPage from './pages/teacher/ManageAssignmentsPage'

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute role="student" />}>
        <Route path="/student" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="courses" element={<StudentCoursesPage />} />
          <Route path="recorded-sessions" element={<RecordedSessionsPage />} />
          <Route path="recorded-sessions/:id" element={<LectureDetailsPage />} />
          <Route path="assignments" element={<StudentAssignmentsPage />} />
          <Route path="assignments/:id" element={<AssignmentDetailsPage />} />
          <Route path="materials" element={<StudentMaterialsPage />} />
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route element={<ProtectedRoute role="teacher" />}>
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeacherDashboardPage />} />
          <Route path="courses" element={<ManageCoursesPage />} />
          <Route path="modules" element={<ManageModulesPage />} />
          <Route path="lectures" element={<ManageLecturesPage />} />
          <Route path="assignments" element={<ManageAssignmentsPage />} />
          <Route path="materials" element={<TeacherMaterialsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>
      <Route path="/dashboard" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
