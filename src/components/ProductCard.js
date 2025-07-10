// src/components/ProductCard.js
import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  const { name, price, image } = product;

  return (
    <div style={{
      width: 200,
      border: '1px solid #ccc',
      borderRadius: 10,
      padding: 16,
      textAlign: 'center',
      boxShadow: '2px 2px 10px rgba(0,0,0,0.1)'
    }}>
      <img src={image} alt={name} style={{ width: '100%', height: 120, objectFit: 'contain' }} />
      <h3>{name}</h3>
      <p><strong>${price}</strong></p>
      <button onClick={() => onAddToCart(product)}>Agregar al carrito</button>
    </div>
  );
};

export default ProductCard;
