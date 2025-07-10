// src/navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import StoreScreen from '../screens/StoreScreen';
import CartScreen from '../screens/CartScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tienda" component={StoreScreen} />
      <Stack.Screen name="Carrito" component={CartScreen} />
    </Stack.Navigator>
  );
}
