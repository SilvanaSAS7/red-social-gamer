import React, { useState, useRef } from 'react'; // Elimina useEffect del import
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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
  ]);

  const [newPost, setNewPost] = useState('');

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handlePost = () => {
    if (newPost.trim() === '') return;

    const newPublication = {
      id: Date.now(),
      user: 'SilvanaSarai',
      content: newPost,
      reactions: { like: 0, fire: 0, game: 0 },
      isLive: false,
    };
    setPosts([newPublication, ...posts]);
    setNewPost('');
  };

  const addReaction = (id, type) => {
    setPosts(
      posts.map((post) =>
        post.id === id
          ? {
              ...post,
              reactions: {
                ...post.reactions,
                [type]: post.reactions[type] + 1,
              },
            }
          : post
      )
    );
  };

  // 🚀 NUEVO: Live directo en la app
  const [showLive, setShowLive] = useState(false);
  const videoRef = useRef(null);

  const startLive = async () => {
    setShowLive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error('Error al acceder a la cámara/micrófono:', err);
      alert('No se pudo acceder a la cámara o micrófono.');
      setShowLive(false);
    }
  };

  const stopLive = () => {
    const stream = videoRef.current.srcObject;
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    videoRef.current.srcObject = null;
    setShowLive(false);
  };

  return (
    <div className="home-container">
      {/* User en la esquina superior derecha */}
      <div className="user-container right">
        <div className="user-display" onClick={toggleMenu}>
          <img
            src="https://i.pravatar.cc/40?img=5"
            alt="User Profile"
            className="user-avatar"
          />
          <span className="user-name">SilvanaSarai</span>
        </div>

        {/* Menú desplegable */}
        {menuOpen && (
          <div className="user-menu animate">
            <div style={{display:'flex', alignItems:'center'}}>
              <div onClick={() => navigate('/profile')}>📄 Mi Perfil</div>
              <button style={{marginLeft:'10px'}} onClick={() => navigate('/store')}>🛒 Tienda</button>
            </div>
            <div onClick={startLive}>🎥 Live</div>
            <div onClick={() => navigate('/settings')}>⚙️ Configuración</div>
            <div onClick={() => navigate('../components/login')}>🚪 Cerrar Sesión</div>
          </div>
        )}
      </div>

      {/* Modal de transmisión en vivo */}
      {showLive && (
        <div className="modal-overlay">
          <div className="modal-content live">
            <h2>🔴 Transmitiendo en Vivo</h2>
            <video
              ref={videoRef}
              autoPlay
              muted
              className="live-video"
            ></video>
            <div className="modal-buttons">
              <button onClick={stopLive} className="btn-stop">
                Finalizar Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Más espacio entre user y barra gamer */}
      <div style={{ height: '2rem' }}></div>

      {/* Barra gamer de consolas */}
      <div className="console-bar">
        <div
          className="console-card playstation"
          onClick={() => navigate('/playstation')}
        >
          PlayStation
        </div>
        <div
          className="console-card xbox"
          onClick={() => navigate('/xbox')}
        >
          Xbox
        </div>
        <div
          className="console-card pc"
          onClick={() => navigate('/pc')}
        >
          PC
        </div>
        <div
          className="console-card nintendo"
          onClick={() => navigate('/nintendo')}
        >
          Nintendo
        </div>
      </div>

      {/* Nueva publicación */}
      <div className="new-post">
        <textarea
          placeholder="¿Qué estás pensando, Silvana?"
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button onClick={handlePost}>Publicar</button>
      </div>

      {/* Feed de publicaciones */}
      <div className="feed">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <h4>{post.user}</h4>
            <p>{post.content}</p>
            {post.isLive && (
              <button
                className="live-button"
                onClick={() => navigate('/live')}
              >
                🔴 Ver en vivo
              </button>
            )}
            <div className="reactions">
              <button onClick={() => addReaction(post.id, 'like')}>
                ❤️ {post.reactions.like}
              </button>
              <button onClick={() => addReaction(post.id, 'fire')}>
                🔥 {post.reactions.fire}
              </button>
              <button onClick={() => addReaction(post.id, 'game')}>
                🎮 {post.reactions.game}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;