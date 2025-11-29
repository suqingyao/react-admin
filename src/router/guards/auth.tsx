import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import storageUtil from '@/lib/storage';

export function AuthGuard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = storageUtil.getItem('token');
    const pathname = location.pathname;
    const isAuthPage = pathname.startsWith('/auth');

    if (!token && !isAuthPage) {
      navigate('/auth/login');
      return;
    }

    if (token && isAuthPage) {
      navigate('/dashboard');
    }
  }, [location.pathname]);

  return null;
}
