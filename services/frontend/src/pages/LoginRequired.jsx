import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const REDIRECT_SECONDS = 5;

export default function LoginRequired() {
  const [secondsLeft, setSecondsLeft] = useState(REDIRECT_SECONDS);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem('admin_token'));

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
    if (secondsLeft <= 0) {
      navigate('/admin', { replace: true });
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [isLoggedIn, secondsLeft, navigate]);

  if (isLoggedIn) return null;

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <h1 className="admin-login-title">로그인이 필요합니다</h1>
        <p className="admin-notice">
          요청하신 페이지를 보려면 먼저 로그인해야 합니다.
          <br />
          {secondsLeft}초 후 로그인 페이지로 자동 이동합니다.
        </p>
        <button className="admin-btn" onClick={() => navigate('/admin', { replace: true })}>
          지금 로그인 페이지로 이동
        </button>
      </div>
    </div>
  );
}
