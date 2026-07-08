import LoginRequired from '../pages/LoginRequired';

// 실제 서버(VPS)의 admin_token 발급 전까지는, /admin 임시 미리보기 로그인(woney/1123)이
// 남겨둔 preview_session 값도 함께 인정한다. VPS 준비 후 실제 로그인이 자리잡으면
// preview_session 체크는 제거하고 admin_token 검증만 남긴다.
export function isDemoAuthenticated() {
  return Boolean(localStorage.getItem('admin_token')) || Boolean(localStorage.getItem('preview_session'));
}

// 신한투자증권 등 프로젝트 내부(데모 화면) 접근을 로그인 여부로 차단한다.
// 어떤 경로로 들어오든(버튼 클릭, 새 창, 주소 직접 입력) 이 컴포넌트를 거치지 않고는
// 데모 화면 내용이 렌더링되지 않는다.
export default function DemoAccessGuard({ children }) {
  if (!isDemoAuthenticated()) return <LoginRequired />;
  return children;
}
