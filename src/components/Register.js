import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import { registerUser } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
  e.preventDefault();
  const result = await registerUser(username, email, password);
  if (result.success) {
    setSuccess('Registro exitoso. Redirigiendo a login...');
    setError('');
    setTimeout(() => navigate('/'), 2000);
  } else {
    setError(result.message || 'Error en el registro');
    setSuccess('');
  }
};

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Crear cuenta</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nombre completo"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          {success && <p className="success">{success}</p>}
          <button type="submit">Registrarse</button>
        </form>
        <p>
          ¿Ya tienes cuenta?{' '}
          <span className="login-link" onClick={() => navigate('/')}>
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
