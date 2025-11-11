const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '1mb' }));

const LIVEPEER_API = 'https://livepeer.com/api';
const LIVEPEER_KEY = process.env.LIVEPEER_API_KEY;
if (!LIVEPEER_KEY) console.warn('Warning: LIVEPEER_API_KEY not set in environment');

function lpFetch(path, opts = {}) {
  const headers = Object.assign({ Authorization: `Bearer ${LIVEPEER_KEY}`, 'Content-Type': 'application/json' }, opts.headers || {});
  return fetch(`${LIVEPEER_API}${path}`, Object.assign({}, opts, { headers }));
}

// In-memory session store. For production use Redis or a DB.
const SESSIONS = new Map();

// Create a bridge session: client (publisher) sends { streamId, offerSdp }
// Server creates Livepeer webrtc session and returns answer sdp and a local sessionId
app.post('/sessions', async (req, res) => {
  try {
    const { streamId, offerSdp } = req.body;
    if (!offerSdp) return res.status(400).json({ error: 'offerSdp required' });

    // Create a local session id
    const localId = uuidv4();
    const session = {
      id: localId,
      streamId: streamId || null,
      livepeerSessionId: null,
      offerSdp,
      answerSdp: null,
      publisherCandidates: [],
      viewerCandidates: [],
      createdAt: Date.now()
    };

    // If streamId provided and key present, create session in Livepeer
    if (streamId && LIVEPEER_KEY) {
      const resp = await lpFetch(`/stream/${streamId}/webrtc-sessions`, { method: 'POST', body: JSON.stringify({ sdp: offerSdp }) });
      if (!resp.ok) {
        const txt = await resp.text();
        return res.status(502).json({ error: 'Livepeer create session failed', detail: txt });
      }
      const data = await resp.json();
      session.livepeerSessionId = data.id || data.session?.id || null;
      session.answerSdp = data.sdp || (data.session && data.session.sdp) || null;

      // Start a short poller to fetch candidates from Livepeer
      if (session.livepeerSessionId) {
        startPollingCandidates(session.id, session.streamId, session.livepeerSessionId);
      }
    }

    SESSIONS.set(localId, session);

    return res.json({ sessionId: localId, answerSdp: session.answerSdp });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
});

// Crear stream (proxy a Livepeer) — evita que el API key esté en el cliente
app.post('/streams', async (req, res) => {
  try {
    if (!LIVEPEER_KEY) return res.status(500).json({ error: 'LIVEPEER_API_KEY not configured on server' });
    const body = req.body || {};
    const resp = await lpFetch('/stream', { method: 'POST', body: JSON.stringify(body) });
    if (!resp.ok) {
      const txt = await resp.text();
      return res.status(502).json({ error: 'Livepeer create stream failed', detail: txt });
    }
    const data = await resp.json();
    return res.json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
});

// Publisher posts a local ICE candidate -> server forwards to Livepeer (if available) and stores
app.post('/sessions/:id/publisherCandidate', async (req, res) => {
  try {
    const sid = req.params.id;
    const c = req.body.candidate;
    const session = SESSIONS.get(sid);
    if (!session) return res.status(404).json({ error: 'session not found' });
    session.publisherCandidates.push(c);
    // forward to Livepeer if session exists
    if (session.streamId && session.livepeerSessionId && LIVEPEER_KEY) {
      await lpFetch(`/stream/${session.streamId}/webrtc-sessions/${session.livepeerSessionId}/candidates`, { method: 'POST', body: JSON.stringify({ candidate: c }) });
    }
    return res.json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: String(e) });
  }
});

// Viewer posts an ICE candidate for viewer -> store it for publisher to poll
app.post('/sessions/:id/viewerCandidate', (req, res) => {
  const sid = req.params.id;
  const c = req.body.candidate;
  const session = SESSIONS.get(sid);
  if (!session) return res.status(404).json({ error: 'session not found' });
  session.viewerCandidates.push(c);
  return res.json({ ok: true });
});

// Publisher or viewer can poll remote candidates
app.get('/sessions/:id/publisherCandidates', (req, res) => {
  const sid = req.params.id;
  const session = SESSIONS.get(sid);
  if (!session) return res.status(404).json({ error: 'session not found' });
  return res.json(session.publisherCandidates || []);
});

app.get('/sessions/:id/viewerCandidates', (req, res) => {
  const sid = req.params.id;
  const session = SESSIONS.get(sid);
  if (!session) return res.status(404).json({ error: 'session not found' });
  return res.json(session.viewerCandidates || []);
});

app.get('/sessions/:id', (req, res) => {
  const sid = req.params.id;
  const session = SESSIONS.get(sid);
  if (!session) return res.status(404).json({ error: 'session not found' });
  return res.json({ id: session.id, streamId: session.streamId, livepeerSessionId: session.livepeerSessionId, answerSdp: session.answerSdp });
});

// Simple polling job per session to fetch Livepeer candidates and push to viewerCandidates
async function startPollingCandidates(localId, streamId, lpSessionId) {
  const session = SESSIONS.get(localId);
  if (!session) return;
  const seen = new Set();
  const interval = setInterval(async () => {
    try {
      const resp = await lpFetch(`/stream/${streamId}/webrtc-sessions/${lpSessionId}/candidates`, { method: 'GET' });
      if (!resp.ok) {
        // ignore non-ok briefly
        return;
      }
      const arr = await resp.json();
      if (!Array.isArray(arr)) return;
      for (const c of arr) {
        const key = JSON.stringify(c);
        if (!seen.has(key)) {
          seen.add(key);
          session.viewerCandidates.push(c);
        }
      }
      // stop polling after 60s to avoid long-running tasks
      if (Date.now() - session.createdAt > 60000) {
        clearInterval(interval);
      }
    } catch (e) {
      console.warn('poll candidates error', e.message || e);
    }
  }, 2000);
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Livepeer WebRTC bridge listening on ${PORT}`));
