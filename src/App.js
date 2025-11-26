import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PlayStation from './components/PlayStation';
import Register from './components/Register';
import Xbox from './components/Xbox';
import PC from './components/PC';

import Nintendo from './components/Nintendo';

import Store from './pages/Store';
import Cart from './pages/Cart';

import Statistics from './pages/Statistics';
import BroadcasterManual from './components/BroadcasterManual';
import Watch from './pages/Watch';
import ImageGallery from './components/ImageGallery';


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
      <Route path="/statistics" element={<Statistics />} />
      <Route path="/live" element={<BroadcasterManual />} />
      <Route path="/watch/:playbackId" element={<Watch />} />
  <Route path="/gallery" element={<ImageGallery />} />
    </Routes>
  );
};

export default App;
