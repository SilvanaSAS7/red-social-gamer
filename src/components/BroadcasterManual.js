import React, { useRef, useState, useEffect } from 'react';
import * as livepeerService from '../services/livepeerService';

export default function BroadcasterManual() {
  const [title, setTitle] = useState('');
  const [streamInfo, setStreamInfo] = useState(null);
  const [status, setStatus] = useState('idle');
  const videoRef = useRef(null);
  const localStreamRef = useRef(null);
  const pcRef = useRef(null);
  const sessionRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pcRef.current) try { pcRef.current.close(); } catch (e) {}
      if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  async function startPreview() {
    setStatus('preview');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = s;
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (e) {
      setStatus('error');
      console.error('getUserMedia failed', e);
    }
  }

  async function createStreamOnServer() {
    setStatus('creating-stream');
    try {
      const data = await livepeerService.createStream({ name: title || 'Directo desde el navegador' });
      setStreamInfo(data);
      setStatus('stream-created');
      return data;
    } catch (e) {
      console.error('createStream failed', e);
      setStatus('error');
      throw e;
    }
  }

  async function startWebRTC() {
    setStatus('starting-webrtc');
    try {
      if (!localStreamRef.current) await startPreview();
      const data = streamInfo || await createStreamOnServer();
      const streamId = data.id;

      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      // add local tracks
      localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));

      // send local candidates to server bridge
      pc.onicecandidate = async (ev) => {
        if (!ev.candidate) return;
        try {
          // the bridge implemented POST /api/livepeer/streams/:streamId/candidates
          if (streamId && sessionRef.current?.id) {
            await livepeerService.sendWebRTCCandidate(streamId, sessionRef.current.id, ev.candidate.toJSON ? ev.candidate.toJSON() : ev.candidate);
          }
        } catch (e) {
          console.warn('failed to send candidate', e);
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Create webrtc session via bridge (which calls Livepeer) -> returns { id, sdp }
      const resp = await livepeerService.createWebRTCSession(streamId, offer.sdp);
      // resp may contain answer sdp or an object with sdp field
      const answerSdp = resp?.sdp || resp?.answer;
      sessionRef.current = { id: resp?.id || resp?.sessionId || null };
      if (!answerSdp) throw new Error('No answer SDP returned from bridge/Livepeer');

      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
      setStatus('connected');
    } catch (e) {
      console.error('startWebRTC error', e);
      setStatus('error');
    }
  }

  async function stopAll() {
    setStatus('stopping');
    if (pcRef.current) try { pcRef.current.close(); } catch (e) {}
    if (localStreamRef.current) localStreamRef.current.getTracks().forEach(t => t.stop());
    pcRef.current = null;
    localStreamRef.current = null;
    setStatus('idle');
  }

  return (
    <div style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
      <h2>Iniciar Transmisión (Manual)</h2>
      <div style={{ marginBottom: 12 }}>
        <label>Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del stream" style={{ width: '100%', padding: 8, marginTop: 6 }} />
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <button onClick={startPreview} disabled={status === 'preview'}>Iniciar vista previa</button>
        <button onClick={createStreamOnServer} disabled={status === 'creating-stream' || status === 'stream-created'}>Crear stream</button>
        <button onClick={startWebRTC} disabled={status === 'starting-webrtc' || status === 'connected'}>Iniciar WebRTC</button>
        <button onClick={stopAll}>Detener</button>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', background: '#000' }} />
        </div>
        <div style={{ width: 420 }}>
          <h4>Estado</h4>
          <p>{status}</p>
          {streamInfo && (
            <div>
              <p><strong>Stream ID:</strong> {streamInfo.id}</p>
              <p><strong>Playback:</strong><br /><a href={streamInfo.playbackUrl} target="_blank" rel="noreferrer">{streamInfo.playbackUrl}</a></p>
              <p><strong>RTMP ingest:</strong><br />{streamInfo.rtmpIngestUrl}</p>
              <p><strong>Stream key:</strong><br /><code style={{ wordBreak: 'break-all' }}>{streamInfo.streamKey}</code></p>
              <p style={{ marginTop: 8 }}><strong>Compartir visor:</strong><br />{window.location.origin}/watch/{streamInfo.playbackId || streamInfo.id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
