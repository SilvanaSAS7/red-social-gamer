import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: '1',
    name: 'PlayStation 5',
    description: 'Consola de última generación de Sony',
    price: 599.99,
    image: '/public/logo512.png',
    category: 'Consolas',
    compatibility: ['PlayStation'],
  },
  {
    id: '2',
    name: 'Xbox Series X',
    description: 'Consola potente de Microsoft',
    price: 579.99,
    image: '/public/logo512.png',
    category: 'Consolas',
    compatibility: ['Xbox'],
  },
  {
    id: '3',
    name: 'Nintendo Switch OLED',
    description: 'Versión mejorada de la Switch',
    price: 349.99,
    image: '/public/logo512.png',
    category: 'Consolas',
    compatibility: ['Nintendo'],
  },
  {
    id: '4',
    name: 'PC Gamer RTX',
    description: 'PC de alto rendimiento con RTX 4070',
    price: 1499.99,
    image: '/public/logo512.png',
    category: 'PC',
    compatibility: ['PC'],
  },
  {
    id: '5',
    name: 'DualSense Controller',
    description: 'Control inalámbrico para PS5',
    price: 69.99,
    image: '/public/logo512.png',
    category: 'Accesorios',
    compatibility: ['PlayStation'],
  },
  {
    id: '6',
    name: 'Xbox Wireless Controller',
    description: 'Control inalámbrico para Xbox',
    price: 64.99,
    image: '/public/logo512.png',
    category: 'Accesorios',
    compatibility: ['Xbox'],
  },
  {
    id: '7',
    name: 'Nintendo Pro Controller',
    description: 'Control profesional para Switch',
    price: 59.99,
    image: '/public/logo512.png',
    category: 'Accesorios',
    compatibility: ['Nintendo'],
  },
  {
    id: '8',
    name: 'Monitor Gaming 144Hz',
    description: 'Monitor de alta frecuencia para gaming',
    price: 299.99,
    image: '/public/logo512.png',
    category: 'PC',
    compatibility: ['PC'],
  },
  {
    id: '9',
    name: 'Auriculares Inalámbricos',
    description: 'Auriculares con sonido envolvente',
    price: 89.99,
    image: '/public/logo512.png',
    category: 'Accesorios',
    compatibility: ['PC', 'PlayStation', 'Xbox', 'Nintendo'],
  },
  {
    id: '10',
    name: 'Tarjeta de regalo',
    description: 'Tarjeta de regalo para la tienda online',
    price: 50.00,
    image: '/public/logo512.png',
    category: 'Otros',
    compatibility: ['PC', 'PlayStation', 'Xbox', 'Nintendo'],
  },
];


const Store = () => {
  const { addToCart } = useCart();
  const [notification, setNotification] = useState('');
  const navigate = useNavigate();

  const handleAdd = (product) => {
    addToCart(product);
    setNotification(`Producto agregado: ${product.name}`);
    setTimeout(() => setNotification(''), 2000);
  };

  return (
    <div style={{background:'#f6f8fa', minHeight:'100vh', padding:'32px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h1 style={{textAlign:'center', color:'#2d3a4a'}}>Tienda Online</h1>
        <button onClick={() => navigate('/cart')} style={{
          background:'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
          color:'#2d3a4a',
          border:'none',
          borderRadius:'8px',
          padding:'10px 24px',
          fontWeight:'bold',
          boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
          cursor:'pointer',
          fontSize:'1rem'
        }}>Ir al carrito 🛒</button>
      </div>
      {notification && (
        <div style={{
          position:'fixed',
          top:'24px',
          left:'50%',
          transform:'translateX(-50%)',
          background:'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
          color:'#2d3a4a',
          padding:'12px 32px',
          borderRadius:'12px',
          boxShadow:'0 2px 8px rgba(0,0,0,0.12)',
          fontWeight:'bold',
          fontSize:'1rem',
          zIndex:1000
        }}>{notification}</div>
      )}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'24px'}}>
        {products.map(product => (
          <div key={product.id} style={{
            background:'#fff',
            borderRadius:'16px',
            boxShadow:'0 2px 12px rgba(0,0,0,0.10)',
            padding:'24px',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            transition:'transform 0.2s',
            cursor:'pointer',
            border:'1px solid #e3e7ee'
          }}>
            <img src={product.image} alt={product.name} style={{width:'80px', marginBottom:'16px'}} />
            <h2 style={{color:'#2d3a4a', fontSize:'1.2rem', margin:'8px 0'}}>{product.name}</h2>
            <p style={{color:'#4a5568', fontSize:'0.95rem', marginBottom:'8px'}}>{product.description}</p>
            <p style={{fontWeight:'bold', color:'#1a202c', fontSize:'1.1rem'}}>Precio: ${product.price}</p>
            <p style={{color:'#718096', fontSize:'0.9rem'}}>Categoría: {product.category}</p>
            <p style={{color:'#718096', fontSize:'0.9rem'}}>Compatibilidad: {product.compatibility.join(', ')}</p>
            <button style={{
              marginTop:'16px',
              background:'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
              color:'#2d3a4a',
              border:'none',
              borderRadius:'8px',
              padding:'10px 24px',
              fontWeight:'bold',
              boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
              cursor:'pointer',
              fontSize:'1rem'
            }} onClick={() => handleAdd(product)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;