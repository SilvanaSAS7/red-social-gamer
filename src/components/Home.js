import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/Store'); // Navega directo a la tienda
  };

  return (
    <div className="container">
      <div className="centered-box">
        <h2>Bienvenido a Dravora</h2>
        <button className="btn-primary" onClick={handleStart}>
          Ir a la Tienda
        </button>
        <div className="button-group">
          <button
            className="btn-secondary"
            onClick={() => navigate('/tournaments')}
          >
            Torneos
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate('/lives')}
          >
            Lives
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
