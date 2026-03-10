// POST /api/posts — create a post, returns { id }
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';

function shortId() {
  return Array.from({ length: 8 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');
}

async function kv(method, path, body) {
  const url = `${process.env.UPSTASH_REDIS_REST_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      'Content-Type': 'application/json',
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'POST') {
    const { content } = req.body;
    if (!content?.trim()) return res.status(400).json({ error: 'empty' });

    const id = shortId();
    await kv('POST', `/set/post:${id}`, content.trim());
    return res.status(200).json({ id });
  }

  res.status(405).end();
}
