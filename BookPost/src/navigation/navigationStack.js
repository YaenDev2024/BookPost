import React from 'react';

import HomeScreen from '../screens/HomeScreen';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import MainPageUser from '../components/Profile/MainPageUser';
import EditPerfilInformation from '../components/Profile/EditPerfilInformation';
import EditPerfilScreen from '../screens/EditPerfilScreen';
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
      <Stack.Screen name="EditPerfilUser" component={EditPerfilInformation} />
      <Stack.Screen name="PerfilSettings" component={EditPerfilScreen} />
    </Stack.Navigator>
  );
};
