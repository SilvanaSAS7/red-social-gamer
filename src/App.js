import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Home from './pages/Home';
import Register from './components/Register';
import PlayStation from './components/PlayStation';
import Xbox from './components/Xbox';
import PC from './components/PC';
import Nintendo from './components/Nintendo';
import Store from './pages/Store';
import Cart from './pages/Cart';


const App = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/playstation" element={<PlayStation />} />
      <Route path="/xbox" element={<Xbox />} />
      <Route path="/pc" element={<PC />} />
      <Route path="/nintendo" element={<Nintendo />} />
      <Route path="/store" element={<Store />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default App;
