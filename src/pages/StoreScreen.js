// src/screens/StoreScreen.js
import React, { useState } from 'react';
import { View, FlatList } from 'react-native';
import ProductCard from '../components/ProductCard';

const sampleProducts = [
  { id: '1', name: 'Mouse Gamer', price: 800, image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Teclado Mecánico', price: 1200, image: 'https://via.placeholder.com/150' },
];

const StoreScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => setCart([...cart, product]);

  return (
    <View>
      <FlatList
        data={sampleProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onAddToCart={addToCart} />
        )}
      />
    </View>
  );
};

export default StoreScreen;
