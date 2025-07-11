import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/register.css';
import { registerUser } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    const result = registerUser(name, email, password);
    if (result) {
      setSuccess('Registro exitoso. Redirigiendo a login...');
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError('El correo ya está registrado');
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
            value={name}
            onChange={(e) => setName(e.target.value)}
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
