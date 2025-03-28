import React from 'react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='container'>
      <div className='centered-box'>
      <h2>Bienvenido a Dravora</h2>
      <button className='btn-primary' onClick={handleLogout}>Iniciar</button>
    </div>
    </div>
  );
};

export default Home;