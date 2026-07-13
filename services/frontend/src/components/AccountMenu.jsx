import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAndClearToken } from '../api-client';
import { useLanguage } from '../i18n/LanguageContext';

// 네비게이션 바 우측의 계정 영역.
// - 로그인 안 된 상태: "로그인" 버튼만 보임 (/admin으로 이동)
// - 이 포트폴리오의 주인으로 로그인된 상태: "편집하기" 드롭다운 (화면 편집 / 로그아웃)
// - 로그인은 되어 있지만 이 페이지의 주인이 아닌 경우: 아무것도 보여주지 않음 (방문자 화면 그대로)
export default function AccountMenu({ editLink }) {
  const { t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('admin_token'));
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  async function handleLogout() {
    setOpen(false);
    await logoutAndClearToken();
    setIsLoggedIn(false);
    navigate('/admin');
  }

  if (!editLink) {
    if (isLoggedIn) return null;
    return (
      <button type="button" className="nav-edit-btn" onClick={() => navigate('/admin')}>
        {t.account.login}
      </button>
    );
  }

  return (
    <div className="account-menu" ref={ref}>
      <button
        type="button"
        className="nav-edit-btn account-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {t.account.editToggle} <span className="lang-caret">▾</span>
      </button>
      {open && (
        <ul className="account-dropdown lang-menu" role="menu">
          <li>
            <button type="button" onClick={() => { setOpen(false); navigate(editLink); }}>
              {t.account.editAction}
            </button>
          </li>
          <li>
            <button type="button" onClick={handleLogout}>
              {t.account.logout}
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}
