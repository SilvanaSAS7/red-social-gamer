import React, { useState, useRef, useEffect } from 'react';
import { db } from '../firebaseClient';
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

// Simple viewer that connects to a Firestore session created by the publisher (LiveStream)
// Flow:
// - Input sessionId (doc id in collection 'webrtcSessions')
// - Read offer from doc and setRemoteDescription
// - Create answer, setLocalDescription and write answer to doc
// - Exchange candidates via subcollections: viewerCandidates (written by viewer), publisherCandidates (listen by viewer)

export default function LiveViewer() {
  const [sessionId, setSessionId] = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [infoMessage, setInfoMessage] = useState(null);
  const videoRef = useRef(null);
  const pcRef = useRef(null);
  const unsubDoc = useRef(null);
  const unsubPublisherCandidates = useRef(null);

  useEffect(() => {
    return () => {
      if (unsubDoc.current) unsubDoc.current();
      if (unsubPublisherCandidates.current) unsubPublisherCandidates.current();
      if (pcRef.current) try { pcRef.current.close(); } catch (e) {}
    };
  }, []);

  // Auto-join si el sessionId viene en la query string ?sessionId=...
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('sessionId');
      if (id) {
        setSessionId(id);
        // copiar id automáticamente al portapapeles para facilitar pegar en otras partes
        try { navigator.clipboard && navigator.clipboard.writeText(id); } catch (e) { /* ignore */ }
        setInfoMessage('SessionId copiado al portapapeles, uniéndose...');
        // small delay before auto-join to allow permissions/ICE gathering
        setTimeout(() => {
          joinSession();
        }, 900);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const joinSession = async () => {
    setError(null);
    if (!db) return setError('Firestore no inicializado (revisa `src/firebaseClient.js` y las vars de entorno)');
    if (!sessionId) return setError('Introduce un sessionId válido');

    try {
      const docRef = doc(db, 'webrtcSessions', sessionId);
      const snap = await getDoc(docRef);
      if (!snap.exists()) return setError('Sesión no encontrada');
      const data = snap.data();
      const offer = data?.offer;
      if (!offer || !offer.sdp) return setError('La sesión no contiene una offer aún');

      // Crear RTCPeerConnection para recibir remote stream
      const pc = new RTCPeerConnection();
      pcRef.current = pc;

      pc.ontrack = (ev) => {
        if (videoRef.current) videoRef.current.srcObject = ev.streams[0];
      };

      pc.onicecandidate = async (event) => {
        if (!event.candidate) return;
        const c = event.candidate.toJSON ? event.candidate.toJSON() : event.candidate;
        try {
          await addDoc(collection(db, 'webrtcSessions', sessionId, 'viewerCandidates'), c);
        } catch (e) {
          console.warn('Error escribiendo viewer candidate', e);
        }
      };

      // set remote offer
      await pc.setRemoteDescription({ type: 'offer', sdp: offer.sdp });

      // create answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      // write answer to doc
      await addDoc(collection(db, 'webrtcSessions'), {}); // noop to ensure collection exists (optional)
      // use set on doc to avoid creating another doc: set the 'answer' field
      await docRef.update?.({ answer: { type: 'answer', sdp: answer.sdp }, answeredAt: serverTimestamp() })
        || await docRef.set({ ...data, answer: { type: 'answer', sdp: answer.sdp }, answeredAt: serverTimestamp() }, { merge: true });

      // listen for publisher candidates
      const pubCandidatesCol = collection(db, 'webrtcSessions', sessionId, 'publisherCandidates');
      unsubPublisherCandidates.current = onSnapshot(pubCandidatesCol, async (snap) => {
        for (const change of snap.docChanges()) {
          if (change.type === 'added') {
            const candidate = change.doc.data();
            try {
              await pc.addIceCandidate(candidate);
            } catch (e) {
              console.warn('Error añadiendo publisher candidate', e);
            }
          }
        }
      });

      setConnected(true);
      setInfoMessage('Conexión establecida');
      setTimeout(() => setInfoMessage(null), 3000);
    } catch (e) {
      console.error(e);
      setError('Error al unirse a la sesión: ' + (e.message || e));
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Visor WebRTC (prueba)</h2>
      <p>Introduce el sessionId (documento en `webrtcSessions`) generado por el publisher y pulsa Unirse.</p>
      <input value={sessionId} onChange={e => setSessionId(e.target.value)} placeholder="sessionId" style={{ width: 400, padding: 8 }} />
      <div style={{ marginTop: 8 }}>
        <button onClick={joinSession} disabled={connected}>Unirse</button>
      </div>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      {infoMessage && <div style={{ color: '#0a0', marginTop: 8 }}>{infoMessage}</div>}
      <div style={{ marginTop: 12 }}>
        <video ref={videoRef} autoPlay playsInline controls style={{ width: 640, maxWidth: '100%', background: '#000' }} />
      </div>
    </div>
  );
}
