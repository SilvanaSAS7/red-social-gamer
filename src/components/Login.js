import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { loginUser } from '../utils/auth';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await loginUser(email, password);
    if (result.success) {
      navigate('/home');
    } else {
      setError(result.message || 'Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-container">
      <img
      src="/imagenes/logo1sinfondo.png" // Cambia la ruta por la de tu imagen
      alt="Logo"
      className="login-floating-img"
    />
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="error">{error}</p>}
          <button type="submit">Iniciar Sesión</button>
        </form>
        <p>
          ¿No tienes cuenta?{' '}
          <span
            className="register-link"
            onClick={() => navigate('/Register')}
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
