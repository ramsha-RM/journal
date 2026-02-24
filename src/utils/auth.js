const LOGIN_KEY = import.meta.env.VITE_LOGIN_TOKEN_KEY || 'login_token';
const ACCESS_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY || 'access_token';

export function clearTokens() {
  try {
    localStorage.removeItem(LOGIN_KEY);
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem('pin_verified');
    localStorage.removeItem('username');
  } catch (e) {
  }
}

export function logout(redirect = '/') {
  clearTokens();
  window.location.href = redirect;
}

export function getToken(keyName) {
  const key = keyName || LOGIN_KEY;
  return localStorage.getItem(key);
}

export default { clearTokens, logout, getToken };
