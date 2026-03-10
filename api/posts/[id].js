// GET /api/posts/:id — fetch a post by id
async function kv(path) {
  const res = await fetch(`${process.env.UPSTASH_REDIS_REST_URL}${path}`, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const { id } = req.query;
  const data = await kv(`/get/post:${id}`);

  if (!data.result) return res.status(404).json({ error: 'not found' });
  res.status(200).json({ content: data.result });
}
