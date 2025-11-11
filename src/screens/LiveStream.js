import React, { useState, useRef, useEffect } from 'react';
import * as livepeerService from '../services/livepeerService';
import { db } from '../firebaseClient';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
} from 'firebase/firestore';

const LiveStream = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quality, setQuality] = useState('1080p');
  const [loading, setLoading] = useState(false);
  const [streamInfo, setStreamInfo] = useState(null);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const [previewOn, setPreviewOn] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);

  const startPreview = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      setMediaStream(stream);
      setPreviewOn(true);
    } catch (err) {
      setError('No se pudo acceder a la cámara/micrófono: ' + err.message);
    }
  };

  const stopPreview = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(t => t.stop());
      setMediaStream(null);
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setPreviewOn(false);
  };

  const handleCreateStream = async () => {
    setError(null);
    setLoading(true);
    try {
      const metadata = { name: title || 'Directo sin título', quality, description };
      const result = await livepeerService.createStream(metadata);
      setStreamInfo(result);
    } catch (err) {
      setError('Error creando el stream: ' + (err.message || JSON.stringify(err)));
    } finally {
      setLoading(false);
    }
  };

  // --- WebRTC publishing flow ---
  const [webrtcStatus, setWebrtcStatus] = useState('idle');
  const [pc, setPc] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const pollRef = useRef(null);
  const addedRemoteCandidatesRef = useRef(new Set());

  // Realtime signaling toggle (Firestore). Si está activado, usaremos Firestore para intercambiar
  // offer/answer y candidatos en tiempo real. Si está desactivado, se usa el flujo REST + polling previo.
  const [useRealtime, setUseRealtime] = useState(true);

  // referencias para limpieza de listeners/Firestore
  const sessionDocRef = useRef(null);
  const unsubSessionSnapshot = useRef(null);
  const unsubRemoteCandidates = useRef(null);

  useEffect(() => {
    return () => {
      // cleanup on unmount
      if (unsubSessionSnapshot.current) unsubSessionSnapshot.current();
      if (unsubRemoteCandidates.current) unsubRemoteCandidates.current();
      if (pollRef.current) clearInterval(pollRef.current);
      if (pc) {
        try { pc.close(); } catch (e) { /* ignore */ }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateWebRTC = async () => {
    setError(null);
    if (!mediaStream) {
      setError('Inicia la vista previa primero (accede a cámara y micrófono)');
      return;
    }

    setWebrtcStatus('creatingStream');

    try {
      // crear stream en Livepeer (si quieres RTMP/playback info)
      const metadata = { name: title || 'Directo WebRTC', quality: quality, description };
      const data = await livepeerService.createStream(metadata);
      const streamId = data.id;

      // crear RTCPeerConnection y añadir tracks
      const _pc = new RTCPeerConnection();
      mediaStream.getTracks().forEach(track => _pc.addTrack(track, mediaStream));

      // Helper: enviar candidatos locales ya sea a Livepeer (REST) o a Firestore
      _pc.onicecandidate = async (event) => {
        if (!event.candidate) return;
        const c = event.candidate.toJSON ? event.candidate.toJSON() : event.candidate;

        try {
          if (useRealtime && db && sessionDocRef.current) {
            // escribir candidate local en subcolección 'publisherCandidates'
            await addDoc(collection(db, 'webrtcSessions', sessionDocRef.current.id, 'publisherCandidates'), c);
          } else {
            // fallback: enviar candidate a Livepeer REST (si se soporta)
            if (streamId && sessionIdRef.current) {
              await livepeerService.sendWebRTCCandidate(streamId, sessionIdRef.current, c);
            }
          }
        } catch (e) {
          console.warn('Error enviando candidate local', e);
        }
      };

      setWebrtcStatus('negotiating');

      // crear offer y setLocalDescription
      const offer = await _pc.createOffer();
      await _pc.setLocalDescription(offer);

      // Si usamos realtime (Firestore), escribimos la oferta y esperamos la respuesta por snapshot
      if (useRealtime && db) {
        // crear documento de sesión en Firestore y escribir offer
        const docRef = await addDoc(collection(db, 'webrtcSessions'), {
          streamId: streamId || null,
          offer: { type: 'offer', sdp: offer.sdp },
          createdAt: serverTimestamp(),
        });
  sessionDocRef.current = docRef;
  // Exponer el id de sesión para copiar/compartir con el viewer
  setSessionId(docRef.id);

        // escuchar cambios en el documento para detectar 'answer'
        unsubSessionSnapshot.current = onSnapshot(docRef, async (snap) => {
          const d = snap.data();
          if (!d) return;
          if (d.answer && d.answer.sdp) {
            try {
              await _pc.setRemoteDescription({ type: 'answer', sdp: d.answer.sdp });
              setWebrtcStatus('connected');
              setInfoMessage('Conexión WebRTC establecida');
              setTimeout(() => setInfoMessage(null), 3000);
            } catch (e) {
              console.warn('Error aplicando remote description desde Firestore', e);
            }
          }
        });

        // escuchar candidatos remotos en subcolección 'viewerCandidates'
        const remoteCandidatesCol = collection(db, 'webrtcSessions', docRef.id, 'viewerCandidates');
        unsubRemoteCandidates.current = onSnapshot(remoteCandidatesCol, (snap) => {
          snap.docChanges().forEach(async (change) => {
            if (change.type === 'added') {
              const candidate = change.doc.data();
              const id = JSON.stringify(candidate);
              if (!addedRemoteCandidatesRef.current.has(id)) {
                try {
                  await _pc.addIceCandidate(candidate);
                  addedRemoteCandidatesRef.current.add(id);
                } catch (e) {
                  console.warn('Error añadiendo candidate remoto desde Firestore', e);
                }
              }
            }
          });
        });

      } else {
        // fallback: usar Livepeer REST session creation + polling for remote candidates
        const resp = await livepeerService.createWebRTCSession(streamId, offer.sdp);
        const answerSdp = resp?.sdp;
        const sessionId = resp?.id || resp?.sessionId || resp?.session?.id;
  sessionIdRef.current = sessionId;
  // Exponer para UI
  setSessionId(sessionIdRef.current);
  if (!answerSdp) throw new Error('Respuesta SDP vacía de Livepeer');
  await _pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });
  setWebrtcStatus('connected');
  setInfoMessage('Conexión WebRTC establecida (Livepeer)');
  setTimeout(() => setInfoMessage(null), 3000);

        // polling remoto (mantengo 2s como antes)
        addedRemoteCandidatesRef.current = new Set();
        pollRef.current = setInterval(async () => {
          try {
            const remoteCandidates = await livepeerService.getWebRTCRemoteCandidates(streamId, sessionIdRef.current);
            if (Array.isArray(remoteCandidates)) {
              for (const c of remoteCandidates) {
                const id = JSON.stringify(c);
                if (!addedRemoteCandidatesRef.current.has(id)) {
                  try {
                    await _pc.addIceCandidate(c);
                    addedRemoteCandidatesRef.current.add(id);
                  } catch (e) {
                    console.warn('Error añadiendo candidate remoto', e);
                  }
                }
              }
            }
          } catch (e) {
            console.warn('Error polling remote candidates', e);
          }
        }, 2000);
      }

      // Guardar estado local
      setPc(_pc);

      // Guardar información visible (playback)
      setStreamInfo({ id: data.id, playbackUrl: data.playbackUrl || data.playback_id || data.playbackId, rtmpIngestUrl: data.rtmpIngest?.url || data.ingest?.url || '', streamKey: data.streamKey || '' });
    } catch (err) {
      setError('Error WebRTC: ' + (err.message || JSON.stringify(err)));
      setWebrtcStatus('error');
    }
  };

  // refs para fallback session id
  const sessionIdRef = useRef(null);
  const [sessionId, setSessionId] = useState(null);

  const stopWebRTC = async () => {
    try {
      if (pc) {
        pc.getSenders().forEach(s => s.track && s.track.stop());
        pc.close();
        setPc(null);
      }

      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }

      if (unsubSessionSnapshot.current) {
        try { unsubSessionSnapshot.current(); } catch (e) { /* ignore */ }
        unsubSessionSnapshot.current = null;
      }
      if (unsubRemoteCandidates.current) {
        try { unsubRemoteCandidates.current(); } catch (e) { /* ignore */ }
        unsubRemoteCandidates.current = null;
      }

      // borrar documento de Firestore si existe
      if (sessionDocRef.current) {
        try { await deleteDoc(doc(db, 'webrtcSessions', sessionDocRef.current.id)); } catch (e) { /* ignore */ }
        sessionDocRef.current = null;
      }

      // limpiar id visible
      setSessionId(null);

      setWebrtcStatus('stopped');
    } catch (e) {
      console.warn('Error al detener WebRTC', e);
      setWebrtcStatus('stopped');
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto' }}>
      <h1>Iniciar Directo (Livepeer)</h1>

      <section style={{ marginBottom: 16 }}>
        <label>Título</label>
        <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} />
      </section>

      <section style={{ marginBottom: 16 }}>
        <label>Descripción</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 6 }} rows={3} />
      </section>

      <section style={{ marginBottom: 16 }}>
        <label>Calidad</label>
        <select value={quality} onChange={e => setQuality(e.target.value)} style={{ display: 'block', marginTop: 6 }}>
          <option value="1080p">1080p</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
        </select>
      </section>

      <section style={{ marginBottom: 16 }}>
        <button onClick={startPreview} disabled={previewOn} style={{ marginRight: 8 }}>Iniciar vista previa</button>
        <button onClick={stopPreview} disabled={!previewOn} style={{ marginRight: 8 }}>Detener vista previa</button>
        <button onClick={handleCreateStream} disabled={loading}>{loading ? 'Creando...' : 'Crear stream en Livepeer'}</button>
        <button onClick={handleCreateWebRTC} style={{ marginLeft: 8 }}>Crear stream WebRTC (experimental)</button>
      </section>

  {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', background: '#000' }} />
        </div>
        <div style={{ width: 420 }}>
          <h3>Información del Stream</h3>
          {!streamInfo && <div style={{ color: '#666' }}>Aquí aparecerán la URL RTMP y la clave una vez creado el stream.</div>}
          {streamInfo && (
            <div>
              <p><strong>ID:</strong> {streamInfo.id}</p>
              <p><strong>Playback URL:</strong><br /> <a href={streamInfo.playbackUrl} target="_blank" rel="noreferrer">{streamInfo.playbackUrl}</a></p>
              <p><strong>RTMP Ingest:</strong><br />{streamInfo.rtmpIngestUrl}</p>
              <p><strong>Stream Key:</strong><br /><code style={{ wordBreak: 'break-all' }}>{streamInfo.streamKey}</code></p>
              <p style={{ marginTop: 8 }}><button onClick={() => navigator.clipboard.writeText(streamInfo.rtmpIngestUrl + ' ' + streamInfo.streamKey)}>Copiar RTMP + Key</button></p>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <h4>WebRTC (experimental)</h4>
            <p style={{ color: '#666' }}>Puedes crear una sesión WebRTC que publique directamente desde el navegador a Livepeer. Recomendado: prueba en HTTPS y con `REACT_APP_LIVEPEER_API_KEY` configurada.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCreateWebRTC} disabled={!previewOn || webrtcStatus === 'connected'}>Iniciar WebRTC</button>
              <button onClick={stopWebRTC} disabled={webrtcStatus !== 'connected'}>Detener WebRTC</button>
            </div>
            <p style={{ marginTop: 8 }}><strong>Estado:</strong> {webrtcStatus}</p>
            {sessionId && (
              <div style={{ marginTop: 8 }}>
                <p><strong>Session ID:</strong></p>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <code style={{ wordBreak: 'break-all' }}>{sessionId}</code>
                  <button onClick={() => navigator.clipboard.writeText(sessionId)}>Copiar</button>
                  <button onClick={() => window.open(`/visor?sessionId=${encodeURIComponent(sessionId)}`, '_blank')} style={{ marginLeft: 6 }}>Abrir Visor</button>
                </div>
                <p style={{ color: '#666', marginTop: 6 }}>Comparte este ID con el Visor para que pueda unirse (copiar/pegar en Visor).</p>
              </div>
            )}
              {infoMessage && <div style={{ color: '#0a0', marginTop: 8 }}>{infoMessage}</div>}
          </div>

          <div style={{ marginTop: 12 }}>
            <h4>Cómo iniciar el directo</h4>
            <ol>
              <li>Inicia la vista previa para comprobar cámara y micrófono.</li>
              <li>Crea el stream (botón). Aparecerá la URL RTMP y la clave.</li>
              <li>Abre OBS (u otro software RTMP), pega la URL y la clave en los ajustes de stream y comienza a transmitir.</li>
            </ol>
            <p style={{ color: '#666' }}>Nota: enviar RTMP desde el navegador directamente no es trivial; por eso utilizamos OBS o software similar para la transmisión final.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveStream;
