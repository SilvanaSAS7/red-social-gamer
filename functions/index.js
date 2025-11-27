const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');

admin.initializeApp();
const db = admin.firestore();

const LIVEPEER_API = 'https://livepeer.com/api';
const LIVEPEER_KEY = process.env.LIVEPEER_API_KEY || (functions.config && functions.config().livepeer && functions.config().livepeer.key) || null;

if (!LIVEPEER_KEY) {
  console.warn('LIVEPEER_API_KEY no está configurada. Establece la variable de entorno LIVEPEER_API_KEY o usa `firebase functions:config:set livepeer.key="..."` antes de desplegar.');
}

async function livepeerCreateSession(streamId, sdp) {
  const url = `${LIVEPEER_API}/stream/${streamId}/webrtc-sessions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LIVEPEER_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sdp })
  });
  if (!res.ok) throw new Error(`Livepeer create session failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function livepeerSendCandidate(streamId, sessionId, candidate) {
  const url = `${LIVEPEER_API}/stream/${streamId}/webrtc-sessions/${sessionId}/candidates`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${LIVEPEER_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ candidate })
  });
  if (!res.ok) throw new Error(`Livepeer send candidate failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function livepeerGetCandidates(streamId, sessionId) {
  const url = `${LIVEPEER_API}/stream/${streamId}/webrtc-sessions/${sessionId}/candidates`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${LIVEPEER_KEY}`
    }
  });
  if (!res.ok) throw new Error(`Livepeer get candidates failed: ${res.status} ${await res.text()}`);
  return res.json();
}

// Trigger: cuando se crea un documento en webrtcSessions con un offer, creamos la sesión en Livepeer
exports.onCreateWebrtcSession = functions.firestore.document('webrtcSessions/{sessionId}').onCreate(async (snap, ctx) => {
  const data = snap.data() || {};
  const sessionDocRef = snap.ref;
  const offer = data.offer;
  const streamId = data.streamId;

  if (!offer || !offer.sdp) {
    console.log('webrtcSessions doc created without offer.sdp, skipping');
    return null;
  }
  if (!streamId) {
    console.log('webrtcSessions doc has no streamId; session will be created without Livepeer association');
  }

  try {
    if (!LIVEPEER_KEY || !streamId) {
      // If Livepeer key or streamId missing, just leave the doc (viewer can still respond manually)
      await sessionDocRef.set({ createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      return null;
    }

    // Create Livepeer WebRTC session
    const resp = await livepeerCreateSession(streamId, offer.sdp);
    const answerSdp = resp?.sdp;
    const lpSessionId = resp?.id || resp?.sessionId || (resp.session && resp.session.id);

    // Write answer + sessionId back into the Firestore doc
    await sessionDocRef.set({ answer: { type: 'answer', sdp: answerSdp }, livepeerSessionId: lpSessionId, sessionCreatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });

    // Poll Livepeer for remote candidates for a short while (try for ~30s every 2s)
    if (lpSessionId) {
      const seen = new Set();
      const maxMs = 30000;
      const intervalMs = 2000;
      const start = Date.now();
      while (Date.now() - start < maxMs) {
        try {
          const candidates = await livepeerGetCandidates(streamId, lpSessionId);
          if (Array.isArray(candidates) && candidates.length) {
            for (const c of candidates) {
              const key = JSON.stringify(c);
              if (!seen.has(key)) {
                seen.add(key);
                // add to viewerCandidates subcollection
                await sessionDocRef.collection('viewerCandidates').add(c);
              }
            }
          }
        } catch (e) {
          console.warn('Error polling Livepeer candidates', e.message || e);
        }
        // small delay
        await new Promise(r => setTimeout(r, intervalMs));
      }
    }
    return null;
  } catch (e) {
    console.error('Error in onCreateWebrtcSession:', e);
    await sessionDocRef.set({ error: String(e), errorAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return null;
  }
});

// Forward publisher candidates (written by publisher in Firestore) to Livepeer session
exports.onPublisherCandidate = functions.firestore.document('webrtcSessions/{sessionId}/publisherCandidates/{candidateId}').onCreate(async (snap, ctx) => {
  const candidate = snap.data();
  const sessionId = ctx.params.sessionId;
  const sessionDocRef = db.collection('webrtcSessions').doc(sessionId);
  try {
    const sessionDoc = await sessionDocRef.get();
    if (!sessionDoc.exists) return null;
    const sessionData = sessionDoc.data() || {};
    const streamId = sessionData.streamId;
    const lpSessionId = sessionData.livepeerSessionId || sessionData.sessionId;
    if (!streamId || !lpSessionId) {
      console.log('Publisher candidate arrived but session missing streamId or livepeerSessionId, skipping forward');
      return null;
    }
    await livepeerSendCandidate(streamId, lpSessionId, candidate);
    return null;
  } catch (e) {
    console.error('Error forwarding publisher candidate to Livepeer:', e);
    return null;
  }
});
