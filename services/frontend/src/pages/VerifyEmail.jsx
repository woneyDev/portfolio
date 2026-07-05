import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../api-client';
import './Admin.css';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('인증 링크가 올바르지 않습니다.');
      return;
    }
    api.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => {
        setStatus('error');
        setMessage('인증 링크가 유효하지 않거나 만료되었습니다.');
      });
  }, [token]);

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-box">
        <h1 className="admin-login-title">이메일 인증</h1>
        {status === 'verifying' && <p>인증 확인 중...</p>}
        {status === 'success' && (
          <>
            <p>이메일 인증이 완료되었습니다.</p>
            <Link className="admin-btn" to="/admin">로그인하러 가기</Link>
          </>
        )}
        {status === 'error' && <p className="admin-error">{message}</p>}
      </div>
    </div>
  );
}
