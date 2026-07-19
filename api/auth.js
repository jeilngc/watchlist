import crypto from 'crypto';

const COOKIE_NAME = 'mj_session';

function getSecret() {
    return process.env.COOKIE_SECRET || 'default-dev-secret-do-not-use-in-prod';
}

export function createToken() {
    const hash = crypto.createHmac('sha256', getSecret())
                       .update('authorized_user')
                       .digest('hex');
    return `auth_${hash}`;
}

export function isAuthenticated(req) {
    const cookieHeader = req.headers.cookie || '';
    const expectedToken = createToken();
    return cookieHeader.includes(`${COOKIE_NAME}=${expectedToken}`);
}

export function setAuthCookie(res) {
    const token = createToken();
    // 30-day session
    const maxAge = 60 * 60 * 24 * 30;
    res.setHeader('Set-Cookie', `${COOKIE_NAME}=${token}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Lax`);
}