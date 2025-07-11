import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartProducts, setCartProducts] = useState([]);

  const addToCart = (product) => {
    setCartProducts((prev) => [...prev, product]);
  };

  const removeFromCart = (id) => {
    setCartProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const clearCart = () => setCartProducts([]);

  return (
    <CartContext.Provider value={{ cartProducts, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
