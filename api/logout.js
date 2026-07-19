export default function handler(req, res) {
    res.setHeader('Set-Cookie', 'mj_session=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax');
    res.status(200).json({ ok: true });
}