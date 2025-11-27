import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import { createStreamWithSDP, deleteStream } from '../services/livepeer';

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // TEMP: para probar keys en tiempo real sin .env
  const [testApiKey, setTestApiKey] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'GamerQueen',
      content: '¿Alguien ya probó el nuevo Zelda TOTK? 😍',
      reactions: { like: 3, fire: 1, game: 2 },
      isLive: false,
    },
    {
      id: 2,
      user: 'NoobMaster69',
      content: '🔴 En vivo jugando Fortnite. ¡Entra a verme!',
      reactions: { like: 5, fire: 2, game: 1 },
      isLive: true,
    },
    {
      id: 3,
      user: 'Novarosa77',
      content: '¿Qué les parece la Switch 2? La verdad yo me quedo con la primera',
      reactions: { like: 16, fire: 3, game: 8 },
    },
  ]);


  const [newPost, setNewPost] = useState('');
  const [showLive, setShowLive] = useState(false);
  const [starting, setStarting] = useState(false);

  // stream info
  const [streamId, setStreamId] = useState(null);
  const [streamKey, setStreamKey] = useState(null);
  const [rtmpIngestUrl, setRtmpIngestUrl] = useState(null);
  const [playbackId, setPlaybackId] = useState(null);
  const [viewerPlaybackId, setViewerPlaybackId] = useState('');

  // refs for WebRTC
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const videoRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const goToStatistics = () => navigate('/statistics');

  const handlePost = () => {
    if (newPost.trim() === '') return;
    const newPublication = { id: Date.now(), user: 'SilvanaSarai', content: newPost, reactions: { like: 0, fire: 0, game: 0 }, isLive: false };
    setPosts([newPublication, ...posts]);
    setNewPost('');
  };

  const addReaction = (id, type) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, reactions: { ...p.reactions, [type]: p.reactions[type] + 1 } } : p)));
  };

  // helper: create RTCPeerConnection and attach local tracks
  const createPeerConnectionWithLocal = async () => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
    const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    localStreamRef.current = localStream;
    if (videoRef.current) videoRef.current.srcObject = localStream;
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));
    return pc;
  };

  const startLive = async () => {
    setStarting(true);
    try {
      const pc = await createPeerConnectionWithLocal();
      pcRef.current = pc;

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      const { streamId: sid, answer, playbackId: pb, rtmpIngestUrl: ingest, streamKey: key } =
        await createStreamWithSDP(offer.sdp, testApiKey);

      if (!answer) throw new Error('No SDP answer received from server');
      await pc.setRemoteDescription({ type: 'answer', sdp: answer });

      setStreamId(sid || null);
      setPlaybackId(pb || null);
      setRtmpIngestUrl(ingest || null);
      setStreamKey(key || null);
      setShowLive(true);
    } catch (err) {
      console.error('startLive error', err);
      alert('Error al iniciar la transmisión: ' + (err.message || err));
      await stopLive();
    } finally {
      setStarting(false);
    }
  };

  const stopLive = async () => {
    try {
      // stop local media
      const s = localStreamRef.current;
      if (s) s.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
      if (videoRef.current) videoRef.current.srcObject = null;

      // close pc
      if (pcRef.current) {
        try { pcRef.current.close(); } catch {}
        pcRef.current = null;
      }

      // delete stream
      await deleteStream(streamId, testApiKey);
    } catch (err) {
      console.warn('stopLive error', err);
    } finally {
      setStreamId(null);
      setStreamKey(null);
      setRtmpIngestUrl(null);
      setPlaybackId(null);
      setShowLive(false);
      setStarting(false);
    }
  };

  const hlsUrlForPlayback = (pid) => (pid ? `https://cdn.livepeer.com/hls/${pid}/index.m3u8` : '');

  return (
    <div className="home-container">
      <div className="user-container right">
        <div className="user-display" onClick={toggleMenu}>
          <img src="" alt="User Profile" className="user-avatar" />
          <span className="user-name">SilvanaSarai</span>
        </div>

        {menuOpen && (
          <div className="user-menu animate">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div onClick={() => navigate('/profile')}>📄 Mi Perfil</div>
              <button style={{ marginLeft: '10px' }} onClick={() => navigate('/store')}>🛒 Tienda</button>
            </div>
            <div onClick={() => setShowLive(true)}>🎥 Live</div>
            <div onClick={() => navigate('/settings')}>⚙️ Configuración</div>
            <div onClick={() => navigate('/')}>🚪 Cerrar Sesión</div>
          </div>
        )}
      </div>

      {showLive && (
        <div className="modal-overlay">
          <div className="modal-content live" style={{ maxWidth: 1000 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 360px', background: '#fafafa', borderRadius: 12, padding: 12 }}>
                <h3>🎥 Streamer</h3>
                <div style={{ margin: '8px 0' }}>
                  <input
                    placeholder="Key temporal (solo pruebas)"
                    value={testApiKey}
                    onChange={(e) => setTestApiKey(e.target.value.trim())}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                  />
                </div>

                {!streamId ? (
                  <>
                    <p>Crear transmisión (Livepeer Studio).</p>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={startLive} disabled={starting} className="btn-primary">
                        {starting ? 'Iniciando...' : 'Iniciar Live'}
                      </button>
                      <button onClick={() => { setShowLive(false); }} className="btn-secondary">Cerrar</button>
                    </div>
                  </>
                ) : (
                  <>
                    <p><strong>Transmisión en curso</strong></p>
                    <div style={{ wordBreak: 'break-word', background: '#fff', padding: 8, borderRadius: 8 }}>
                      <div><strong>Stream ID:</strong> {streamId}</div>
                      <div><strong>Playback ID:</strong> {playbackId}</div>
                      <div><strong>RTMP:</strong> {rtmpIngestUrl}</div>
                      <div><strong>Key:</strong> {streamKey}</div>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <button onClick={stopLive} className="btn-stop">Finalizar Live</button>
                    </div>
                  </>
                )}

                <div style={{ marginTop: 12 }}>
                  <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', borderRadius: 8, background: '#000' }} />
                </div>
              </div>

              <div style={{ flex: '1 1 360px', background: '#111', color: '#fff', borderRadius: 12, padding: 12 }}>
                <h3>👀 Viewer</h3>
                <div style={{ marginBottom: 8 }}>
                  <input
                    placeholder="Playback ID (ver otra transmisión)"
                    value={viewerPlaybackId}
                    onChange={(e) => setViewerPlaybackId(e.target.value)}
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #ccc' }}
                  />
                </div>
                {viewerPlaybackId ? (
                  <>
                    <p style={{ color: '#ccc' }}>Playback ID: {viewerPlaybackId}</p>
                    <video
                      controls
                      style={{ width: '100%', borderRadius: 8, background: '#000' }}
                      src={hlsUrlForPlayback(viewerPlaybackId)}
                    >
                      Tu navegador puede necesitar hls.js en Chrome/Firefox.
                    </video>
                  </>
                ) : (
                  <p style={{ color: '#ccc' }}>Pega un playbackId o crea una transmisión.</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => setShowLive(false)} className="btn-secondary">Cerrar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ height: '2rem' }} />

      <div className="console-bar">
        <div className="console-card playstation" onClick={() => navigate('/playstation')}>PlayStation</div>
        <div className="console-card xbox" onClick={() => navigate('/xbox')}>Xbox</div>
        <div className="console-card pc" onClick={() => navigate('/pc')}>PC</div>
        <div className="console-card nintendo" onClick={() => navigate('/nintendo')}>Nintendo</div>
      </div>

      {/* Botón rápido a Directo */}
      <div style={{ marginTop: 16 }}>
        <button onClick={() => navigate('/directo')} style={{ padding: '10px 16px', background: '#e63946', color: '#fff', border: 'none', borderRadius: 6 }}>
          🎥 Ir a Directo
        </button>
      </div>

      {/* Nueva publicación */}
      <div className="new-post">
        <textarea placeholder="¿Qué estás pensando, Silvana?" value={newPost} onChange={(e) => setNewPost(e.target.value)} />
        <button onClick={handlePost}>Publicar</button>
      </div>

      <div className="feed">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h4>{post.user}</h4>
            <p>{post.content}</p>
            {post.isLive && <button className="live-button" onClick={() => navigate('/live')}>🔴 Ver en vivo</button>}
            <div className="reactions">
              <button onClick={() => addReaction(post.id, 'like')}>❤️ {post.reactions.like}</button>
              <button onClick={() => addReaction(post.id, 'fire')}>🔥 {post.reactions.fire}</button>
              <button onClick={() => addReaction(post.id, 'game')}>🎮 {post.reactions.game}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;


