const express = require('express');
const fetch = require('node-fetch');

const router = express.Router();
const LIVEPEER_API = 'https://livepeer.com/api';
const LIVEPEER_KEY = process.env.LIVEPEER_API_KEY;

function lpFetch(path, opts = {}) {
  const headers = Object.assign({ Authorization: `Bearer ${LIVEPEER_KEY}`, 'Content-Type': 'application/json' }, opts.headers || {});
  return fetch(`${LIVEPEER_API}${path}`, Object.assign({}, opts, { headers }));
}

// POST /api/livepeer/streams -> proxy para crear stream en Livepeer
router.post('/streams', async (req, res) => {
  try {
    if (!LIVEPEER_KEY) return res.status(500).json({ error: 'LIVEPEER_API_KEY not configured on server' });
    const body = req.body || { name: 'Directo' };
    const resp = await lpFetch('/stream', { method: 'POST', body: JSON.stringify(body) });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(502).json({ error: 'Livepeer create stream failed', detail: txt });
    }
    const data = await resp.json();
    return res.json(data);
  } catch (e) {
    console.error('livepeer /streams error', e);
    return res.status(500).json({ error: String(e) });
  }
});

// POST /api/livepeer/streams/:streamId/webrtc-sessions -> crear webrtc session en Livepeer con offer SDP
router.post('/streams/:streamId/webrtc-sessions', async (req, res) => {
  try {
    if (!LIVEPEER_KEY) return res.status(500).json({ error: 'LIVEPEER_API_KEY not configured on server' });
    const { streamId } = req.params;
    const { sdp } = req.body;
    if (!sdp) return res.status(400).json({ error: 'sdp required' });
    const resp = await lpFetch(`/stream/${streamId}/webrtc-sessions`, { method: 'POST', body: JSON.stringify({ sdp }) });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(502).json({ error: 'Livepeer create webrtc session failed', detail: txt });
    }
    const data = await resp.json();
    return res.json(data);
  } catch (e) {
    console.error('livepeer /webrtc-sessions error', e);
    return res.status(500).json({ error: String(e) });
  }
});

// POST /api/livepeer/streams/:streamId/candidates -> enviar candidate a Livepeer
router.post('/streams/:streamId/candidates', async (req, res) => {
  try {
    if (!LIVEPEER_KEY) return res.status(500).json({ error: 'LIVEPEER_API_KEY not configured on server' });
    const { streamId } = req.params;
    const { sessionId, candidate } = req.body;
    if (!sessionId || !candidate) return res.status(400).json({ error: 'sessionId and candidate required' });
    const resp = await lpFetch(`/stream/${streamId}/webrtc-sessions/${sessionId}/candidates`, { method: 'POST', body: JSON.stringify({ candidate }) });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(502).json({ error: 'Livepeer forward candidate failed', detail: txt });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error('livepeer /candidates error', e);
    return res.status(500).json({ error: String(e) });
  }
});

module.exports = router;
