

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Store from '../screens/Store';
import Cart from '../screens/Cart';
import LiveStream from '../screens/LiveStream';
import LiveViewer from '../screens/LiveViewer';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
  <Stack.Screen name="Tienda" component={Store} />
  <Stack.Screen name="Carrito" component={Cart} />
  <Stack.Screen name="Directo" component={LiveStream} />
  <Stack.Screen name="Visor" component={LiveViewer} />
    </Stack.Navigator>
  );
}
