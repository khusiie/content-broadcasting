import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ToastContainer from './components/ui/Toast';
import LoginPage from './pages/auth/LoginPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import UploadContent from './pages/teacher/UploadContent';
import MyContent from './pages/teacher/MyContent';
import PrincipalDashboard from './pages/principal/PrincipalDashboard';
import PendingApprovals from './pages/principal/PendingApprovals';
import AllContent from './pages/principal/AllContent';
import LiveDisplay from './pages/public/LiveDisplay';
import useAuth from './hooks/useAuth';
import { Loader2 } from 'lucide-react';
const ProtectedRoute = ({ children, role }) => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />;
  return children;
};
const PublicOnlyRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'principal' ? '/principal' : '/teacher'} replace />;
  }
  return children;
};
const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicOnlyRoute>
            <LoginPage />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/teacher"
        element={
          <ProtectedRoute role="teacher">
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/upload"
        element={
          <ProtectedRoute role="teacher">
            <UploadContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/content"
        element={
          <ProtectedRoute role="teacher">
            <MyContent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal"
        element={
          <ProtectedRoute role="principal">
            <PrincipalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/pending"
        element={
          <ProtectedRoute role="principal">
            <PendingApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/principal/content"
        element={
          <ProtectedRoute role="principal">
            <AllContent />
          </ProtectedRoute>
        }
      />
      <Route path="/live/:teacherId" element={<LiveDisplay />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}
export default App;
