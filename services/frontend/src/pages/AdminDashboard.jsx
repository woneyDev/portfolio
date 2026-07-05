import { useNavigate } from 'react-router-dom';
import { api } from '../api-client';
import './Admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  async function handleLogout() {
    const token = localStorage.getItem('admin_token');
    try { await api.logout(token); } catch { /* 무시 */ }
    localStorage.removeItem('admin_token');
    navigate('/admin');
  }

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">관리자</h2>
        <nav className="admin-nav">
          <button className="admin-nav-item active">📋 포트폴리오 관리</button>
          <button className="admin-nav-item">⭐ 평가 목록</button>
          <button className="admin-nav-item">🔒 공개 설정</button>
        </nav>
        <button className="admin-logout-btn" onClick={handleLogout}>로그아웃</button>
      </aside>

      <main className="admin-main">
        <h1 className="admin-page-title">포트폴리오 관리</h1>

        <section className="admin-section">
          <h2 className="admin-section-title">기본 정보</h2>
          <p className="admin-notice">
            포트폴리오 내용 수정, 슈퍼바이저 평가 관리, 프로필 공개 설정 기능이
            순차적으로 추가될 예정입니다.
          </p>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">슈퍼바이저 초대</h2>
          <p className="admin-notice">
            전 직장 상관을 초대하면 회사 이메일 인증 후 별점과 평가를 남길 수 있습니다.
          </p>
          <button className="admin-btn" disabled>
            슈퍼바이저 초대하기 (준비 중)
          </button>
        </section>

        <section className="admin-section">
          <h2 className="admin-section-title">프로필 공개 동의</h2>
          <p className="admin-notice">
            기업이 프로필 열람을 요청했을 때 동의 여부를 설정합니다.
          </p>
          <button className="admin-btn" disabled>
            공개 설정 관리 (준비 중)
          </button>
        </section>
      </main>
    </div>
  );
}