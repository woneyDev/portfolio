import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../api-client';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  const [status, setStatus] = useState(token ? 'checking' : 'unauthenticated');

  useEffect(() => {
    if (!token) return;
    api.getMyPortfolio(token)
      .then(() => setStatus('authenticated'))
      .catch(() => {
        localStorage.removeItem('admin_token');
        setStatus('unauthenticated');
      });
  }, [token]);

  if (status === 'checking') return null;
  if (status === 'unauthenticated') return <Navigate to="/admin" replace />;
  return children;
}
