const SERVER_BASE = process.env.REACT_APP_SERVER_URL || '';

/**
 * Crea stream en el backend (recomendado) o directamente en Livepeer Studio
 * @param {string} offerSdp
 * @param {string} testApiKey optional (temporal)
 * @returns {Promise<{streamId, answer, playbackId, rtmpIngestUrl, streamKey}>}
 */
export async function createStreamWithSDP(offerSdp, testApiKey = '') {
  // usa proxy si está configurado
  if (SERVER_BASE) {
    const res = await fetch(`${SERVER_BASE.replace(/\/$/, '')}/api/live/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sdp: offerSdp }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(text || `status ${res.status}`);
    const json = JSON.parse(text);
    return {
      streamId: json.streamId,
      answer: json.answer,
      playbackId: json.playbackId,
      rtmpIngestUrl: json.rtmpIngestUrl,
      streamKey: json.streamKey,
    };
  }

  // fallback directo a Livepeer Studio (solo para desarrollo)
  const LIVEPEER_KEY = testApiKey || process.env.REACT_APP_LIVEPEER_API_KEY;
  if (!LIVEPEER_KEY) throw new Error('REACT_APP_LIVEPEER_API_KEY missing');

  // crear stream
  const createResp = await fetch('https://livepeer.studio/api/streams', {
    method: 'POST',
    headers: { Authorization: `Bearer ${LIVEPEER_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: `live-${Date.now()}`, mp4: false }),
  });
  const createText = await createResp.text();
  if (!createResp.ok) throw new Error(createText || `status ${createResp.status}`);
  let createData = null;
  try { createData = JSON.parse(createText); } catch {}
  const streamId = createData?.id || createData?.stream?.id || createData?.data?.id;
  const playbackId = createData?.playbackId || createData?.stream?.playbackId || createData?.data?.playbackId;
  const rtmpIngestUrl = createData?.rtmpIngestUrl || createData?.stream?.rtmpIngestUrl || createData?.data?.rtmpIngestUrl;
  const streamKey = createData?.streamKey || createData?.data?.streamKey || createData?.stream?.streamKey;

  if (!streamId) throw new Error('no stream id from Livepeer create');

  // exchange SDP
  const sdpResp = await fetch(`https://livepeer.studio/api/streams/${streamId}/webrtc`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${LIVEPEER_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'offer', sdp: offerSdp }),
  });
  const sdpText = await sdpResp.text();
  if (!sdpResp.ok) {
    // cleanup
    await fetch(`https://livepeer.studio/api/streams/${streamId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${LIVEPEER_KEY}` },
    }).catch(() => {});
    throw new Error(sdpText || `status ${sdpResp.status}`);
  }

  let answer = sdpText;
  try {
    const maybeJson = JSON.parse(sdpText);
    answer = maybeJson.sdp || maybeJson.answer || sdpText;
  } catch {}

  return { streamId, answer, playbackId, rtmpIngestUrl, streamKey };
}

/**
 * Elimina stream por id vía backend o Livepeer Studio
 */
export async function deleteStream(streamId, testApiKey = '') {
  if (!streamId) return;
  if (SERVER_BASE) {
    await fetch(`${SERVER_BASE.replace(/\/$/, '')}/api/live/${streamId}`, { method: 'DELETE' }).catch(() => {});
    return;
  }
  const LIVEPEER_KEY = testApiKey || process.env.REACT_APP_LIVEPEER_API_KEY;
  if (!LIVEPEER_KEY) return;
  await fetch(`https://livepeer.studio/api/streams/${streamId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${LIVEPEER_KEY}` },
  }).catch(() => {});
}