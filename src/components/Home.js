import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

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

      {/* Sección de contenido principal */}
      <div className="main-content">
        {/* Lives */}
        <div className="content-box lives">
          <h3>🎥 Lives</h3>
          <p>Streamers en vivo ahora mismo.</p>
          <ul>
            <li>GamerPro jugando Fortnite</li>
            <li>NoobMaster69 en Apex Legends</li>
            <li>QueenGamer transmitiendo Zelda TOTK</li>
          </ul>
        </div>

        {/* Torneos */}
        <div className="content-box tournaments">
          <h3>🏆 Torneos</h3>
          <p>Próximos eventos y competencias.</p>
          <ul>
            <li>Fortnite Summer Cup - 12 de julio</li>
            <li>Valorant Masters - 20 de julio</li>
            <li>Smash Bros Ultimate - 5 de agosto</li>
          </ul>
        </div>

        {/* Noticias y publicaciones */}
        <div className="content-box feed">
          <h3>📰 Noticias y Publicaciones</h3>
          <div className="post">
            <h4>Nueva actualización de Call of Duty</h4>
            <p>Incluye mapas, armas y skins temáticos de verano.</p>
          </div>
          <div className="post">
            <h4>Nintendo Direct confirmado</h4>
            <p>Revelación de nuevos juegos para Switch 2 este mes.</p>
          </div>
          <div className="post">
            <h4>Steam Summer Sale activa</h4>
            <p>Hasta 80% de descuento en títulos populares de PC.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
