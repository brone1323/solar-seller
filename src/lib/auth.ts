const ADMIN_USER = 'Solarbrone';
const ADMIN_PASS = '1323Ford';
const COOKIE_NAME = 'admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'solar-admin-dev-key';

export function checkCredentials(username: string, password: string): boolean {
  return username === ADMIN_USER && password === ADMIN_PASS;
}

export function getSessionCookie(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function isAuthenticated(request: Request): boolean {
  const token = getSessionCookie(request);
  return token === SESSION_SECRET;
}

export function getAuthHeaders(): Record<string, string> {
  const secure = process.env.VERCEL ? '; Secure' : '';
  return {
    'Set-Cookie': `${COOKIE_NAME}=${encodeURIComponent(SESSION_SECRET)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}${secure}`,
  };
}

export function getLogoutHeaders(): Record<string, string> {
  return {
    'Set-Cookie': `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`,
  };
}
