import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return getToken() ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
