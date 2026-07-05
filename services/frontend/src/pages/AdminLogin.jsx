import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, API_BASE_URL } from '../api-client';
import './Admin.css';

// ── 임시 조치: 실제 서버(VPS)가 준비되기 전까지, 백엔드 없이도 정적 데모 화면을 볼 수 있게 하는 우회 ──
// VPS 준비 후 실제 로그인이 완전히 자리잡으면 이 블록은 통째로 삭제한다.
const TEMP_PREVIEW_ID = 'woney';
const TEMP_PREVIEW_PASSWORD = '1123';

export default function AdminLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(
    searchParams.get('error') === 'oauth_failed' ? '소셜 로그인에 실패했습니다. 다시 시도해주세요.' : ''
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (usernameOrEmail === TEMP_PREVIEW_ID && password === TEMP_PREVIEW_PASSWORD) {
      navigate('/demo');
      return;
    }

    setLoading(true);
    try {
      const data = await api.login(usernameOrEmail, password);
      localStorage.setItem('admin_token', data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('아이디, 이메일 또는 비밀번호가 올바르지 않습니다. 이메일 인증을 완료했는지도 확인해주세요.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <h1 className="admin-login-title">관리자 로그인</h1>
        {error && <p className="admin-error">{error}</p>}
        <label className="admin-label">아이디 또는 이메일</label>
        <input
          className="admin-input"
          type="text"
          value={usernameOrEmail}
          onChange={e => setUsernameOrEmail(e.target.value)}
          autoFocus
          required
        />
        <label className="admin-label">비밀번호</label>
        <input
          className="admin-input"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="admin-btn" type="submit" disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>

        <div className="admin-oauth-divider">또는</div>
        <a className="admin-btn admin-oauth-btn admin-oauth-google" href={`${API_BASE_URL}/api/auth/oauth/google/authorize`}>
          Google로 로그인
        </a>
        <a className="admin-btn admin-oauth-btn admin-oauth-kakao" href={`${API_BASE_URL}/api/auth/oauth/kakao/authorize`}>
          카카오로 로그인
        </a>
        <a className="admin-btn admin-oauth-btn admin-oauth-naver" href={`${API_BASE_URL}/api/auth/oauth/naver/authorize`}>
          네이버로 로그인
        </a>
      </form>
    </div>
  );
}
