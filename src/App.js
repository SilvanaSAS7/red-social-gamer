import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Store from './screens/Store';
import Cart from './screens/Cart';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/store" element={<Store />} />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
};

export default App;
