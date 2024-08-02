import React from 'react';

import HomeScreen from '../screens/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';
// r
export const NavigationStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
  );
};