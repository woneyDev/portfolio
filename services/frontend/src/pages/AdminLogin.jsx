import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api-client';
import './Admin.css';

export default function AdminLogin() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
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
      </form>
    </div>
  );
}