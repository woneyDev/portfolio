import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      localStorage.setItem('admin_token', token);
      navigate('/admin/dashboard', { replace: true });
    } else {
      navigate('/admin', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <p>로그인 처리 중...</p>
      </div>
    </div>
  );
}
