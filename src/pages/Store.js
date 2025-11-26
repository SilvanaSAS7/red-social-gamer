import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    id: '1',
    name: 'Sudadera clasica ',
    description: 'Sudadera con capucha de alta calidad',
    price: 59.99,
    image: '/imagenes/Gemini_Generated_Image_tbqd24tbqd24tbqd.png',
    category: 'Ropa',
    
  },
  {
    id: '2',
    name: 'Shorts casuales',
    description: 'Shorts cómodos para uso diario',
    price: 29.99,
    image: '/imagenes/Gemini_Generated_Image_txdrqjtxdrqjtxdr.png',
    category: 'Ropa',
    
  },
  {
    id: '3',
    name: 'Playera cuello redondo',
    description: 'Playera de algodón suave y transpirable',
    price: 14.99,
    image: '/imagenes/Gemini_Generated_Image_57cn8957cn8957cn.png',
    category: 'Ropa',
    
  },
  {
    id: '4',
    name: 'Mousepad Gaming XL',
    description: 'Mousepad de gran tamaño para gaming',
    price: 19.99,
    image: '/imagenes/Gemini_Generated_Image_80u30w80u30w80u3.png',
    category: 'Accesorios',
    
  },
  {
    id: '5',
    name: 'Playera Logo Dravora',
    description: 'Playera con el logo oficial de Dravora',
    price: 24.99,
    image: '/imagenes/Gemini_Generated_Image_90tyri90tyri90ty.png',
    category: 'Ropa',
    
  },
  {
    id: '6',
    name: 'Gorra Logo Dravora',
    description: 'Gorra con el logo oficial de Dravora',
    price: 59.99,
    image: '/imagenes/Gemini_Generated_Image_fciercfciercfcie.png',
    category: 'Ropa',
    
  },
  {
    id: '7',
    name: 'Sudadera Dravora Edición Limitada',
    description: 'Sudadera con capucha edición limitada de Dravora',
    price: 79.99,
    image: '/imagenes/Gemini_Generated_Image_i4tac3i4tac3i4ta.png',
    category: 'Ropa',
    
  },
  {
    id: '8',
    name: 'Pants Dravora Comfy', 
    description: 'Pants cómodos y estilosos para uso diario',
    price: 39.99,
    image: '/imagenes/Gemini_Generated_Image_iztxa5iztxa5iztx.png',
    category: 'Ropa',
    
  },
  {
    id: '9',
    name: 'Calcetines Dravora',
    description: 'Calcetines cómodos con diseño exclusivo',
    price: 9.99,
    image: '/imagenes/Gemini_Generated_Image_jp2n5xjp2n5xjp2n.png',
    category: 'Ropa',
    
  },
  {
    id: '10',
    name: 'Shorts Dravora Verano',
    description: 'Shorts ligeros y frescos para el verano',
    price: 15.00,
    image: '/imagenes/Gemini_Generated_Image_txdrqjtxdrqjtxdr.png',
    category: 'Ropa',
    
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
    <div style={{background:'#181028', minHeight:'100vh', padding:'32px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
        <h1 style={{textAlign:'center', color:'#b084f7'}}>Tienda Online</h1>
        <button onClick={() => navigate('/cart')} style={{
          background:'linear-gradient(90deg, #2d133b 0%, #b084f7 100%)',
          color:'#fff',
          border:'none',
          borderRadius:'8px',
          padding:'10px 24px',
          fontWeight:'bold',
          boxShadow:'0 1px 8px rgba(176,132,247,0.18)',
          cursor:'pointer',
          fontSize:'1rem',
          letterSpacing:'1px'
        }}>Ir al carrito 🛒</button>
      </div>
      {notification && (
        <div style={{
          position:'fixed',
          top:'24px',
          left:'50%',
          transform:'translateX(-50%)',
          background:'linear-gradient(90deg, #2d133b 0%, #b084f7 100%)',
          color:'#fff',
          padding:'12px 32px',
          borderRadius:'12px',
          boxShadow:'0 2px 12px rgba(176,132,247,0.18)',
          fontWeight:'bold',
          fontSize:'1rem',
          zIndex:1000
        }}>{notification}</div>
      )}
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:'24px'}}>
        {products.map(product => (
          <div key={product.id} style={{
            background:'#231942',
            borderRadius:'16px',
            boxShadow:'0 2px 16px rgba(176,132,247,0.10)',
            padding:'24px',
            display:'flex',
            flexDirection:'column',
            alignItems:'center',
            transition:'transform 0.2s',
            cursor:'pointer',
            border:'1.5px solid #b084f7'
          }}>
            <img src={product.image} alt={product.name} style={{width:'120px', marginBottom:'16px'}} />
            <h2 style={{color:'#b084f7', fontSize:'1.2rem', margin:'8px 0'}}>{product.name}</h2>
            <p style={{color:'#e0d6f7', fontSize:'0.95rem', marginBottom:'8px'}}>{product.description}</p>
            <p style={{fontWeight:'bold', color:'#fff', fontSize:'1.1rem'}}>Precio: ${product.price}</p>
            <p style={{color:'#b084f7', fontSize:'0.9rem'}}>Categoría: {product.category}</p>
            {product.compatibility && product.compatibility.length > 0 && <p style={{color:'#e0d6f7', fontSize:'0.9rem'}}>Compatibilidad: {product.compatibility.join(', ')}</p>}
            <button style={{
              marginTop:'16px',
              background:'linear-gradient(90deg, #2d133b 0%, #b084f7 100%)',
              color:'#fff',
              border:'none',
              borderRadius:'8px',
              padding:'10px 24px',
              fontWeight:'bold',
              boxShadow:'0 1px 8px rgba(176,132,247,0.18)',
              cursor:'pointer',
              fontSize:'1rem',
              letterSpacing:'1px'
            }} onClick={() => handleAdd(product)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;