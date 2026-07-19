import { kv } from '@vercel/kv';
import { isAuthenticated } from './auth.js';

const KV_KEY = 'library:items';

export default async function handler(req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const items = await kv.get(KV_KEY);
            return res.status(200).json(items || null);
        } catch (error) {
            console.error('KV Get Error:', error);
            return res.status(500).json({ error: 'Failed to fetch items from database.' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { items } = req.body;
            if (!Array.isArray(items)) {
                return res.status(400).json({ error: 'Invalid payload: items must be an array.' });
            }
            await kv.set(KV_KEY, items);
            return res.status(200).json({ ok: true });
        } catch (error) {
            console.error('KV Set Error:', error);
            return res.status(500).json({ error: 'Failed to save items to database.' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}