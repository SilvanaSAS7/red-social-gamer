import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  // Estado para publicaciones
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

  return (
    <div className="home-container">
      {/* Barra superior con consolas */}
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

      {/* Sección de publicación */}
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
