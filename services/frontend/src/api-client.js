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
  if (!res.ok) throw new Error(`API 오류: ${res.status}`);
  return res.json();
}

export const api = {
  getPortfolioByUsername: (username) => request(`/api/portfolio/${username}`),
  getMyPortfolio: (token) => request('/api/portfolio/me', { headers: authHeaders(token) }),
  updateMyPortfolio: (token, data) =>
    request('/api/portfolio/me', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify(data),
    }),
  updateMyLayout: (token, layout) =>
    request('/api/portfolio/me/layout', {
      method: 'PUT',
      headers: authHeaders(token),
      body: JSON.stringify({
        sections: layout.map(({ sectionType, x, y, w, h, visible }) => ({ sectionType, x, y, w, h, visible })),
      }),
    }),
  getGithubStats: () => request('/api/github/stats'),
  generatePdf:    () => request('/api/pdf/generate', { method: 'POST' }),

  register: (username, email, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
    }),

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