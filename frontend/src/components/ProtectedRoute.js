import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useContext(AuthContext);

  if (!user || !allowedRoles.includes(user.role)) {
    // User not authenticated or not authorized, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User authenticated and authorized, render the children components
  return children;
};

export default ProtectedRoute;