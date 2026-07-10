import { useEffect, useState } from 'react';
import { api } from '../api-client';
import LoginRequired from '../pages/LoginRequired';

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem('admin_token');
  const [status, setStatus] = useState(token ? 'checking' : 'unauthenticated');

  useEffect(() => {
    if (!token) return;
    api.getMyPortfolio(token)
      .then(() => setStatus('authenticated'))
      .catch((err) => {
        // 서버가 "이 토큰은 진짜 무효하다"고 명확히 응답한 경우(401)만 로그아웃 처리한다.
        // 그 외(네트워크 순단, 페이지 이동으로 요청이 중간에 끊긴 경우 등)는 토큰이 여전히
        // 유효할 수 있으므로 함부로 지우지 않는다 — 안 그러면 느린 서버에서 로그인 직후
        // 빠르게 다른 화면으로 이동할 때 정상 로그인이 풀려버리는 문제가 생긴다.
        if (err?.status === 401) {
          localStorage.removeItem('admin_token');
          setStatus('unauthenticated');
        }
      });
  }, [token]);

  if (status === 'checking') return null;
  if (status === 'unauthenticated') return <LoginRequired />;
  return children;
}
