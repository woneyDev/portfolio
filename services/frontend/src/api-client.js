export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8081';

function authHeaders(token) {
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    // 서버가 { error: "..." } 형태로 구체적인 안내 문구를 내려주면 그걸 그대로 화면에 보여줄 수 있게 담아둔다.
    const body = await res.json().catch(() => null);
    const error = new Error(body?.error ?? `API 오류: ${res.status}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export const api = {
  getPortfolioByUsername: (username, lang = 'ko') => request(`/api/portfolio/${username}?lang=${lang}`),
  getMyPortfolio: (token) => request('/api/portfolio/me', { headers: authHeaders(token) }),
  updateMyPortfolio: (token, data) =>
    request('/api/portfolio/me', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),
  updateMyLayout: (token, layout, customSections = []) =>
    request('/api/portfolio/me/layout', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({
        sections: layout.map(({ sectionType, x, y, w, h, visible }) => ({ sectionType, x, y, w, h, visible })),
        customSections: customSections.map(({ id, x, y, w, h, visible }) => ({ id, x, y, w, h, visible })),
      }),
    }),

  createCustomSection: (token, title, content) =>
    request('/api/portfolio/me/custom-sections', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ title, content }),
    }),

  updateCustomSection: (token, id, title, content) =>
    request(`/api/portfolio/me/custom-sections/${id}`, {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({ title, content }),
    }),

  deleteCustomSection: (token, id) =>
    request(`/api/portfolio/me/custom-sections/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }),
  getAllowedIps: (token) => request('/api/portfolio/me/allowed-ips', { headers: authHeaders(token) }),

  addAllowedIp: (token, ipAddress, memo) =>
    request('/api/portfolio/me/allowed-ips', {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify({ ipAddress, memo }),
    }),

  deleteAllowedIp: async (token, id) => {
    const res = await fetch(`${API_BASE_URL}/api/portfolio/me/allowed-ips/${id}`, {
      method: 'DELETE',
      headers: authHeaders(token),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? `API 오류: ${res.status}`);
    }
  },

  getGithubStats: () => request('/api/github/stats'),
  generatePdf:    () => request('/api/pdf/generate', { method: 'POST' }),

  register: (email, password, passwordConfirm, nickname, affiliation) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, passwordConfirm, nickname, affiliation }),
    }),

  checkEmailAvailability: (email) =>
    request(`/api/auth/check-email?email=${encodeURIComponent(email)}`),

  verifyEmail: (token) => request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),

  login: (usernameOrEmail, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usernameOrEmail, password }),
    }),

  logout: (token) =>
    fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: authHeaders(token),
    }),
};

// 로그아웃 API 호출 + 로컬 토큰 정리를 한 번에 처리한다 (여러 화면에서 공용으로 사용).
export async function logoutAndClearToken() {
  const token = localStorage.getItem('admin_token');
  try { await api.logout(token); } catch { /* 무시 */ }
  localStorage.removeItem('admin_token');
}