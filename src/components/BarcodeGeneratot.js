import React from 'react';
import Barcode from 'react-barcode';


const BarcodeGeneratot = ({ value }) => {
  return (
    <div style={{
      background: 'linear-gradient(90deg, #e3ffe7 0%, #d9e7ff 100%)',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      margin: '10px 0'
    }}>
      <span style={{fontWeight:'bold', color:'#2d3a4a', marginBottom:'8px'}}>Código de producto</span>
      <Barcode value={value} width={2} height={60} displayValue={false} background="#fff" lineColor="#2d3a4a" />
      <span style={{fontSize:'12px', color:'#2d3a4a', marginTop:'8px'}}>ID: {value}</span>
    </div>
  );
};

export default BarcodeGeneratot;
