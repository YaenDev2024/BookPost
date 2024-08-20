import React from 'react';

import HomeScreen from '../screens/HomeScreen';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import MainPageUser from '../components/Profile/MainPageUser';
// r
export const NavigationStack = () => {
  const Stack = createStackNavigator();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'vertical',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MainPageUser" component={MainPageUser} />
    </Stack.Navigator>
  );
};
