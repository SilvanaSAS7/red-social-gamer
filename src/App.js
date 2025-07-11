import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Store from './screens/Store';
import Cart from './screens/Cart';
import PlayStation from './components/PlayStation';
import Xbox from './components/Xbox';
import PC from './components/PC';
import Nintendo from './components/Nintendo';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/store" element={<Store />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/playstation" element={<PlayStation />} />
      <Route path="/xbox" element={<Xbox />} />
      <Route path="/pc" element={<PC />} />
      <Route path="/nintendo" element={<Nintendo />} />
    </Routes>
  );
};

export default App;
