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
    const error = new Error(`API 오류: ${res.status}`);
    error.status = res.status;
    throw error;
  }
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