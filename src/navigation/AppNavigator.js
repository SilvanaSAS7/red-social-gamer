
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Store from '../screens/Store';
import Cart from '../screens/Cart';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tienda" component={Store} />
      <Stack.Screen name="Carrito" component={Cart} />
    </Stack.Navigator>
  );
}
