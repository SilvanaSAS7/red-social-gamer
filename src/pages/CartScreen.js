import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import BarcodeGenerator from '../components/BarcodeGenerator';

const CartScreen = ({ route }) => {
  const { cart } = route.params || { cart: [] };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handlePayPal = () => {
    // Aquí se va a integrar el paypalService.js o un backend
    console.log("Redirigir a PayPal");
  };

  return (
    <View>
      <FlatList
        data={cart}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <Text>{item.name} - ${item.price}</Text>
        )}
      />
      <Text>Total: ${total}</Text>
      <Button title="Pagar con PayPal" onPress={handlePayPal} />
      <BarcodeGenerator value={`OXXO-${Date.now()}-${total}`} />
    </View>
  );
};

export default CartScreen;
