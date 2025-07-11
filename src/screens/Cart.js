import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { createPayment } from '../services/paypalService';
import BarcodeGeneratot from '../components/BarcodeGeneratot';




const Cart = () => {
  const navigate = useNavigate();
  const { cartProducts, removeFromCart } = useCart();
  const [notification, setNotification] = useState('');

  const handlePay = async (product) => {
    try {
      await createPayment(product.price);
      setNotification(`Pago realizado para ${product.name}`);
      setTimeout(() => setNotification(''), 2000);
    } catch (error) {
      setNotification('Error en el pago');
      setTimeout(() => setNotification(''), 2000);
    }
  };

  const handleRemove = (id, name) => {
    removeFromCart(id);
    setNotification(`Producto eliminado: ${name}`);
    setTimeout(() => setNotification(''), 2000);
  };

  const handleOxxo = (product) => {
    setNotification(`Pago OXXO generado para ${product.name}`);
    setTimeout(() => setNotification(''), 2000);
  };


// Eliminar duplicados y dejar solo una función handleOxxo dentro del componente

  const total = cartProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2);

  return (
    <div style={{background:'#f6f8fa', minHeight:'100vh', padding:'32px'}}>
      <h2 style={{textAlign:'center', color:'#2d3a4a', marginBottom:'32px'}}>Carrito</h2>
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
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
        {cartProducts.length === 0 ? (
          <div style={{gridColumn:'1/-1', textAlign:'center', color:'#718096', fontSize:'1.2rem'}}>Tu carrito está vacío.</div>
        ) : (
          cartProducts.map((product) => (
            <div key={product.id} style={{
              background:'#fff',
              borderRadius:'16px',
              boxShadow:'0 2px 12px rgba(0,0,0,0.10)',
              padding:'24px',
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              border:'1px solid #e3e7ee',
              position:'relative'
            }}>
              <img src={product.image} alt={product.name} style={{width:'80px', marginBottom:'16px'}} />
              <h3 style={{color:'#2d3a4a', fontSize:'1.1rem', margin:'8px 0'}}>{product.name}</h3>
              <p style={{color:'#4a5568', fontSize:'0.95rem', marginBottom:'8px'}}>{product.description}</p>
              <p style={{fontWeight:'bold', color:'#1a202c', fontSize:'1.05rem'}}>Precio: ${product.price}</p>
              <p style={{color:'#718096', fontSize:'0.9rem'}}>Categoría: {product.category}</p>
              <p style={{color:'#718096', fontSize:'0.9rem'}}>Compatibilidad: {product.compatibility.join(', ')}</p>
              <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', marginTop:'12px'}}>
                <BarcodeGeneratot value={product.id} style={{background:'linear-gradient(90deg, #ffe259 0%, #ffa751 100%)', borderRadius:'8px', padding:'8px'}} />
                <button onClick={() => handleOxxo(product)} style={{
                  marginTop:'8px',
                  background:'linear-gradient(90deg, #ffe259 0%, #ffa751 100%)',
                  color:'#fff',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
                  cursor:'pointer',
                  fontSize:'0.95rem'
                }}>Pagar en OXXO</button>
              </div>
              <div style={{display:'flex', gap:'10px', marginTop:'12px'}}>
                <button onClick={() => navigate('/store')} style={{
                  background:'#e3ffe7',
                  color:'#2d3a4a',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  cursor:'pointer',
                  fontSize:'0.95rem'
                }}>Ver en tienda</button>
                <button onClick={() => handlePay(product)} style={{
                  background:'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
                  color:'#2d3a4a',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
                  cursor:'pointer',
                  fontSize:'0.95rem'
                }}>Pagar con PayPal</button>
// ...existing code...
                <button onClick={() => handleRemove(product.id, product.name)} style={{
                  background:'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)',
                  color:'#fff',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  cursor:'pointer',
                  fontSize:'0.95rem'
                }}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
      <h3 style={{textAlign:'right', color:'#2d3a4a', marginTop:'32px'}}>Total: ${total}</h3>
    </div>
  );
};

export default Cart;
