import React from 'react';

import HomeScreen from '../screens/HomeScreen';
// r
export const NavigationStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />

    </Stack.Navigator>
  );
};