import { kv } from '@vercel/kv';
import { isAuthenticated } from './auth.js';

const KV_KEY = 'library:items';

export default async function handler(req, res) {
    if (!isAuthenticated(req)) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id, person, rating, comment } = req.body;

        if (!id || !person || (person !== 'may' && person !== 'jay')) {
            return res.status(400).json({ ok: false, error: 'Invalid rating data.' });
        }

        let items = await kv.get(KV_KEY);
        if (!items || !Array.isArray(items)) {
            return res.status(404).json({ ok: false, error: 'Library not found in database.' });
        }

        const itemIndex = items.findIndex(i => i.id === Number(id));
        if (itemIndex === -1) {
            return res.status(404).json({ ok: false, error: 'Item not found.' });
        }

        const item = items[itemIndex];
        if (!item.watched) {
            item.watched = {};
        }

        item.watched[person] = {
            rating: Number(rating),
            comment: String(comment || '')
        };

        items[itemIndex] = item;
        await kv.set(KV_KEY, items);

        return res.status(200).json({ ok: true, item });
    } catch (error) {
        console.error('Rate Error:', error);
        return res.status(500).json({ ok: false, error: 'Server error while saving rating.' });
    }
}