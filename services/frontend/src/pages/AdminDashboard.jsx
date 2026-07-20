import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, logoutAndClearToken } from '../api-client';
import './Admin.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    api.getMyPortfolio(token).then((data) => setUsername(data.username)).catch(() => {});
  }, []);

  async function handleLogout() {
    await logoutAndClearToken();
    navigate('/admin');
  }

  return (
    <div className="admin-wrap">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title">관리자</h2>
        <nav className="admin-nav">
          <button className="admin-nav-item active" onClick={() => navigate('/mypage')}>📋 포트폴리오 관리</button>
          <button className="admin-nav-item">⭐ 평가 목록</button>
          <button className="admin-nav-item">🔒 공개 설정</button>
        </nav>
        {username && (
          <a className="admin-view-live-btn" href={`/@${username}`} target="_blank" rel="noreferrer">
            🔗 내 포트폴리오 보기
          </a>
        )}
        <button className="admin-logout-btn" onClick={handleLogout}>로그아웃</button>
      </aside>

      <main className="admin-main">
        <h1 className="admin-page-title">포트폴리오 관리</h1>

        <section className="admin-section">
          <h2 className="admin-section-title">기본 정보</h2>
          <p className="admin-notice">
            자기소개·스킬·프로젝트·경력사항 화면의 배치(순서·크기)를 직접 드래그해서 바꿀 수 있습니다.
            내용 자체를 수정하는 기능, 슈퍼바이저 평가 관리, 프로필 공개 설정 기능은 순차적으로 추가될 예정입니다.
          </p>
          <div className="admin-section-actions">
            <button className="admin-btn" onClick={() => navigate('/mypage')}>
              화면 배치 편집하기
            </button>
            {username && (
              <a className="admin-btn admin-btn-outline" href={`/@${username}`} target="_blank" rel="noreferrer">
                내 포트폴리오 보기
              </a>
            )}
          </div>
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