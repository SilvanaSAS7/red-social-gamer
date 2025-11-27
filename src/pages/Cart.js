import React, { useState, useEffect, useRef } from 'react';
import jsPDF from 'jspdf';
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

  const [showModal, setShowModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [oxxoReferencia, setOxxoReferencia] = useState('');
  const [oxxoPendiente, setOxxoPendiente] = useState(false);
  const paypalRef = useRef();

  const total = cartProducts.reduce((sum, p) => sum + p.price, 0).toFixed(2);

  const handleGeneralPay = () => {
    setShowModal(true);
  };

  const handleConfirmPay = async () => {
    if (selectedMethod === 'Oxxo') {
      // Generar referencia Oxxo y mostrar instrucciones
      const referencia = Math.random().toString().slice(2, 14);
      setShowModal(false);
      setOxxoReferencia(referencia);
      setOxxoPendiente(true);
      setNotification(`Referencia Oxxo: ${referencia}\nAcude a tu tienda Oxxo más cercana y paga el monto total.\nCuando hayas pagado, presiona el botón para generar tu factura.`);
      generarPDFReferenciaOxxo(referencia);
    }
    // PayPal ahora se maneja con el botón oficial, no aquí
  };

  // Integración de PayPal Checkout
  useEffect(() => {
    if (showModal && selectedMethod === 'PayPal' && paypalRef.current) {
      // Limpia el contenedor antes de renderizar el botón
      paypalRef.current.innerHTML = '';
      if (window.paypal) {
        window.paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
          },
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: total
                }
              }]
            });
          },
          onApprove: (data, actions) => {
            setNotification('Pago realizado con PayPal. Generando factura...');
            setShowModal(false);
            setTimeout(() => setNotification(''), 3000);
            generarPDF('PayPal');
            return actions.order.capture();
          },
          onError: (err) => {
            setNotification('Error en el pago con PayPal');
            setTimeout(() => setNotification(''), 3000);
          }
        }).render(paypalRef.current);
      }
    }
  }, [showModal, selectedMethod, total]);

  // Nuevo: función para generar PDF solo con la referencia Oxxo
  const generarPDFReferenciaOxxo = (referencia) => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString();
    doc.setFillColor(255, 229, 89);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(44, 58, 74);
    doc.setFontSize(20);
    doc.text('Referencia de Pago Oxxo', 105, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Fecha de generación: ${fecha}`, 20, 40);
    doc.text(`Referencia Oxxo: ${referencia}`, 20, 48);
    doc.text(`Monto a pagar: $${total}`, 20, 56);
    doc.text('Acude a tu tienda Oxxo más cercana y proporciona la referencia para realizar el pago.', 20, 68);
    doc.setFontSize(11);
    doc.text('Una vez realizado el pago, regresa y confirma para recibir tu factura.', 20, 80);
    doc.save(`referencia_oxxo_${referencia}.pdf`);
    setNotification('Referencia Oxxo generada. Descarga el PDF y realiza tu pago.');
    setTimeout(() => setNotification(''), 6000);
  };

  // Nuevo: función para confirmar pago Oxxo y generar factura
  const handleConfirmOxxoPago = () => {
    generarPDF('Oxxo', oxxoReferencia);
    setOxxoPendiente(false);
    setOxxoReferencia('');
  };

  // Función para generar el PDF con datos personalizados
  const generarPDF = (metodo, referenciaOxxo = '') => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleString();
    // Encabezado
    doc.setFillColor(44, 58, 74);
    doc.rect(0, 0, 210, 30, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text('Factura de Compra', 105, 18, { align: 'center' });

    // Datos principales
    doc.setFontSize(12);
    doc.setTextColor(44, 58, 74);
    doc.text(`Fecha: ${fecha}`, 20, 40);
    doc.text(`Método de pago: ${metodo}`, 20, 48);
    doc.text(`Monto total: $${total}`, 20, 56);
    if (metodo === 'Oxxo') {
      doc.text(`Referencia Oxxo: ${referenciaOxxo}`, 20, 64);
      doc.text('Estado: Pagado en Oxxo', 20, 72);
    } else {
      doc.text('Estado: Pagado con PayPal', 20, 64);
    }

    // Tabla de productos
    doc.setFontSize(14);
    doc.setTextColor(82, 202, 157);
    doc.text('Productos:', 20, 85);
    doc.setFontSize(12);
    doc.setTextColor(44, 58, 74);
    doc.setDrawColor(82, 202, 157);
    doc.line(20, 87, 190, 87);
    let y = 95;
    doc.setFont('helvetica', 'bold');
    doc.text('No.', 22, y);
    doc.text('Nombre', 32, y);
    doc.text('Categoría', 92, y);
    doc.text('Precio', 150, y);
    doc.setFont('helvetica', 'normal');
    y += 8;
    cartProducts.forEach((p, i) => {
      doc.text(`${i + 1}`, 22, y);
      doc.text(p.name, 32, y);
      doc.text(p.category, 92, y);
      doc.text(`$${p.price}`, 150, y);
      y += 8;
    });
    doc.line(20, y, 190, y);

    // Pie de página
    doc.setFontSize(12);
    doc.setTextColor(44, 58, 74);
    doc.text('Gracias por tu compra. Red Social Gamer', 105, y + 15, { align: 'center' });

    doc.save(`factura_${Date.now()}.pdf`);
    setNotification('Compra realizada y factura generada');
    setTimeout(() => setNotification(''), 3000);
  };

  return (
    <div style={{background:'#181028', minHeight:'100vh', padding:'32px'}}>
      <h2 style={{textAlign:'center', color:'#b084f7', marginBottom:'32px'}}>Carrito</h2>
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
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(320px, 1fr))', gap:'24px'}}>
        {cartProducts.length === 0 ? (
          <div style={{gridColumn:'1/-1', textAlign:'center', color:'#b084f7', fontSize:'1.2rem'}}>Tu carrito está vacío.</div>
        ) : (
          cartProducts.map((product) => (
            <div key={product.id} style={{
              background:'#231942',
              borderRadius:'16px',
              boxShadow:'0 2px 16px rgba(176,132,247,0.10)',
              padding:'24px',
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              border:'1.5px solid #b084f7',
              position:'relative'
            }}>
              <img src={product.image} alt={product.name} style={{width:'120px', marginBottom:'16px'}} />
              <h3 style={{color:'#b084f7', fontSize:'1.1rem', margin:'8px 0'}}>{product.name}</h3>
              <p style={{color:'#e0d6f7', fontSize:'0.95rem', marginBottom:'8px'}}>{product.description}</p>
              <p style={{fontWeight:'bold', color:'#fff', fontSize:'1.05rem'}}>Precio: ${product.price}</p>
              <p style={{color:'#b084f7', fontSize:'0.9rem'}}>Categoría: {product.category}</p>
              {product.compatibility && product.compatibility.length > 0 && <p style={{color:'#e0d6f7', fontSize:'0.9rem'}}>Compatibilidad: {product.compatibility.join(', ')}</p>}
              <div style={{width:'100%', display:'flex', flexDirection:'column', alignItems:'center', marginTop:'12px'}}>
                <BarcodeGeneratot value={product.id} style={{background:'linear-gradient(90deg, #ffe259 0%, #ffa751 100%)', borderRadius:'8px', padding:'8px'}} />
              </div>
              <div style={{display:'flex', gap:'10px', marginTop:'12px'}}>
                <button onClick={() => navigate('/store')} style={{
                  background:'linear-gradient(90deg, #2d133b 0%, #b084f7 100%)',
                  color:'#fff',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  cursor:'pointer',
                  fontSize:'0.95rem',
                  letterSpacing:'1px'
                }}>Ver en tienda</button>
                <button onClick={() => handleRemove(product.id, product.name)} style={{
                  background:'linear-gradient(90deg, #ffdde1 0%, #ee9ca7 100%)',
                  color:'#231942',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  cursor:'pointer',
                  fontSize:'0.95rem',
                  letterSpacing:'1px'
                }}>Eliminar</button>
              </div>
            </div>
          ))
        )}
      </div>
      <h3 style={{textAlign:'right', color:'#b084f7', marginTop:'32px'}}>Total: ${total}</h3>
      {cartProducts.length > 0 && (
        <div style={{textAlign:'right', marginTop:'24px'}}>
          <button onClick={handleGeneralPay} style={{
            background:'linear-gradient(90deg, #2d133b 0%, #b084f7 100%)',
            color:'#fff',
            border:'none',
            borderRadius:'8px',
            padding:'12px 32px',
            fontWeight:'bold',
            fontSize:'1.1rem',
            boxShadow:'0 1px 8px rgba(176,132,247,0.18)',
            cursor:'pointer',
            letterSpacing:'1px'
          }}>Pagar</button>
        </div>
      )}

      {/* Modal de opciones de pago */}
      {showModal && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100vw',
          height:'100vh',
          background:'rgba(0,0,0,0.3)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:2000
        }}>
          <div style={{
            background:'#fff',
            borderRadius:'16px',
            padding:'24px',
            minWidth:'280px',
            maxWidth:'95vw',
            maxHeight:'90vh',
            overflowY:'auto',
            boxShadow:'0 2px 12px rgba(0,0,0,0.15)'
          }}>
            <h2 style={{marginBottom:'24px'}}>Selecciona método de pago</h2>
            <div style={{display:'flex', flexDirection:'column', gap:'16px'}}>
              <button onClick={() => setSelectedMethod('Oxxo')} style={{
                background:selectedMethod==='Oxxo'?'#ffe259':'#f6f8fa',
                color:'#2d3a4a',
                border:'2px solid #ffa751',
                borderRadius:'8px',
                padding:'10px 24px',
                fontWeight:'bold',
                cursor:'pointer'
              }}>Oxxo</button>
              <button onClick={() => setSelectedMethod('PayPal')} style={{
                background:selectedMethod==='PayPal'?'#e3ffe7':'#f6f8fa',
                color:'#2d3a4a',
                border:'2px solid #82ca9d',
                borderRadius:'8px',
                padding:'10px 24px',
                fontWeight:'bold',
                cursor:'pointer'
              }}>PayPal</button>
            </div>
            {/* Botón de confirmación para Oxxo */}
            {selectedMethod === 'Oxxo' && (
              <div style={{marginTop:'32px', display:'flex', justifyContent:'flex-end', gap:'12px'}}>
                <button onClick={() => setShowModal(false)} style={{
                  background:'#eee',
                  color:'#2d3a4a',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  cursor:'pointer'
                }}>Cancelar</button>
                <button onClick={handleConfirmPay} style={{
                  background:'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
                  color:'#2d3a4a',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  cursor:'pointer'
                }}>Confirmar</button>
              </div>
            )}
            {/* Botón oficial de PayPal */}
            {selectedMethod === 'PayPal' && (
              <div style={{marginTop:'32px', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px'}}>
                <div ref={paypalRef} />
                <button onClick={() => setShowModal(false)} style={{
                  background:'#eee',
                  color:'#2d3a4a',
                  border:'none',
                  borderRadius:'8px',
                  padding:'8px 16px',
                  fontWeight:'bold',
                  cursor:'pointer',
                  marginTop:'12px'
                }}>Cancelar</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal/Notificación para confirmar pago Oxxo y generar factura */}
      {oxxoPendiente && (
        <div style={{
          position:'fixed',
          top:0,
          left:0,
          width:'100vw',
          height:'100vh',
          background:'rgba(0,0,0,0.3)',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          zIndex:2100
        }}>
          <div style={{background:'#fff', borderRadius:'16px', padding:'32px', minWidth:'320px', boxShadow:'0 2px 12px rgba(0,0,0,0.15)'}}>
            <h2 style={{marginBottom:'18px', color:'#2d3a4a'}}>¿Ya realizaste tu pago en Oxxo?</h2>
            <p style={{marginBottom:'24px', color:'#718096'}}>Cuando hayas pagado en Oxxo con la referencia, presiona el botón para generar tu factura.</p>
            <button onClick={handleConfirmOxxoPago} style={{
              background:'linear-gradient(90deg, #ffe259 0%, #ffa751 100%)',
              color:'#2d3a4a',
              border:'none',
              borderRadius:'8px',
              padding:'12px 32px',
              fontWeight:'bold',
              fontSize:'1.1rem',
              boxShadow:'0 1px 4px rgba(0,0,0,0.08)',
              cursor:'pointer'
            }}>Generar factura</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
