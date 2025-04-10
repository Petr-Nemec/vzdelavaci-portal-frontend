// components/auth/ProtectedRoute.jsx
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    router.push('/');
    return null;
  }

  return children;
};

export default ProtectedRoute;
