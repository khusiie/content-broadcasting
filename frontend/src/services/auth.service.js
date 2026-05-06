import api from '../utils/api';
const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';
const authService = {
  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
    return data;
  },
  async register(name, email, password, role) {
    const { data } = await api.post('/auth/register', { name, email, password, role });
    return data;
  },
  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  },
  getCurrentUser() {
    try {
      const user = localStorage.getItem(AUTH_USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  getToken() {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },
  isAuthenticated() {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
export default authService;
