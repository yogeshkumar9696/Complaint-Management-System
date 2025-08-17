import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/select-role" replace />;
  }

  // If role doesn't match
  if (role && storedRole !== role) {
    return <Navigate to={`/${storedRole}/dashboard`} replace />;
  }

  return children;
}