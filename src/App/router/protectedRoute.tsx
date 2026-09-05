import { Navigate } from 'react-router-dom';

interface Props {
  children: React.ReactNode;
  roles?: string[];
}

const ProtectedRoute = ({ children, roles }: Props) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  if (!user) return <Navigate to="/auth?mode=login" replace />;

  if (roles && !roles.includes(user.role)) {
    // 🔴 HAR BIR ROL UCHUN ANIQ MARSHRUTNI KO'RSATING:
    if (user.role === 'owner' || user.role === 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    if (user.role === 'teacher') {
      return <Navigate to="/teacher/dashboard" replace />;
    }
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;