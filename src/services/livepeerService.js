// Servicio mínimo para interactuar con Livepeer o con un bridge propio
const LIVEPEER_API = 'https://livepeer.com/api';
const BRIDGE_URL = process.env.REACT_APP_BRIDGE_URL || null;

async function apiFetch(path, options = {}) {
  const apiKey = process.env.REACT_APP_LIVEPEER_API_KEY;
  if (!apiKey) throw new Error('REACT_APP_LIVEPEER_API_KEY no está definido en el entorno');

  const headers = Object.assign({
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  }, options.headers || {});

  const res = await fetch(`${LIVEPEER_API}${path}`, Object.assign({}, options, { headers }));
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Livepeer API error: ${res.status} ${text}`);
  }
  return res.json();
}

// createStream: si existe BRIDGE_URL, lo proxyeamos al bridge para no exponer API key
export async function createStream({ name = 'Directo', quality = '1080p', description = '' } = {}) {
  const body = { name, profiles: [] };
  if (BRIDGE_URL) {
    const res = await fetch(`${BRIDGE_URL.replace(/\/$/, '')}/streams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Bridge create stream error: ${res.status} ${txt}`);
    }
    const data = await res.json();
    const rtmpIngestUrl = data?.rtmpIngest?.url || (data?.ingest?.url) || '';
    const streamKey = data?.rtmpIngest?.streamKey || data?.streamKey || data?.ingest?.streamKey || '';
    const playbackUrl = Array.isArray(data?.playbackUrl) ? data.playbackUrl[0] : data?.playbackUrl || data?.playbackId ? `https://livepeercdn.com/hls/${data.playbackId}/index.m3u8` : '';
    return { id: data.id, rtmpIngestUrl, streamKey, playbackUrl };
  }
  // fallback: call Livepeer directly (requires REACT_APP_LIVEPEER_API_KEY — not recommended in prod)
  return apiFetch('/stream', { method: 'POST', body: JSON.stringify(body) }).then(data => {
    const rtmpIngestUrl = data?.rtmpIngest?.url || (data?.ingest?.url) || '';
    const streamKey = data?.rtmpIngest?.streamKey || data?.streamKey || data?.ingest?.streamKey || '';
    const playbackUrl = Array.isArray(data?.playbackUrl) ? data.playbackUrl[0] : data?.playbackUrl || data?.playbackId ? `https://livepeercdn.com/hls/${data.playbackId}/index.m3u8` : '';
    return { id: data.id, rtmpIngestUrl, streamKey, playbackUrl };
  });
}

export async function getStream(streamId) {
  if (BRIDGE_URL) {
    const res = await fetch(`${BRIDGE_URL.replace(/\/$/, '')}/sessions/${encodeURIComponent(streamId)}`);
    if (!res.ok) throw new Error('Bridge get stream failed: ' + (await res.text()));
    return res.json();
  }
  return apiFetch(`/stream/${streamId}`);
}

export async function createWebRTCSession(streamId, sdp) {
  if (BRIDGE_URL) {
    const res = await fetch(`${BRIDGE_URL.replace(/\/$/, '')}/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ streamId, offerSdp: sdp })
    });
    if (!res.ok) {
      const txt = await res.text();
      throw new Error(`Bridge WebRTC create session error: ${res.status} ${txt}`);
    }
    return res.json();
  }
  // fallback: call Livepeer directly (not recommended from browser)
  const res = await fetch(`${LIVEPEER_API}/stream/${streamId}/webrtc-sessions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ sdp })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Livepeer WebRTC error: ${res.status} ${text}`);
  }
  return res.json();
}

export async function sendWebRTCCandidate(streamId, sessionId, candidate) {
  if (BRIDGE_URL) {
    const res = await fetch(`${BRIDGE_URL.replace(/\/$/, '')}/sessions/${encodeURIComponent(sessionId)}/publisherCandidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ candidate })
    });
    if (!res.ok) throw new Error('Bridge send candidate failed: ' + (await res.text()));
    return res.json();
  }
  const res = await fetch(`${LIVEPEER_API}/stream/${streamId}/webrtc-sessions/${sessionId}/candidates`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ candidate })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Livepeer WebRTC candidate error: ${res.status} ${text}`);
  }
  return res.json();
}

export async function getWebRTCRemoteCandidates(streamId, sessionId) {
  if (BRIDGE_URL) {
    const res = await fetch(`${BRIDGE_URL.replace(/\/$/, '')}/sessions/${encodeURIComponent(sessionId)}/viewerCandidates`);
    if (!res.ok) throw new Error('Bridge get remote candidates failed: ' + (await res.text()));
    return res.json();
  }
  const res = await fetch(`${LIVEPEER_API}/stream/${streamId}/webrtc-sessions/${sessionId}/candidates`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${process.env.REACT_APP_LIVEPEER_API_KEY}` }
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Livepeer WebRTC get candidates error: ${res.status} ${text}`);
  }
  return res.json();
}

export default { createStream, getStream };
