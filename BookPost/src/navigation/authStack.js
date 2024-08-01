import React from 'react';
import Login from '../screens/Login';
import Register from '../screens/Register';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import BirthdayScreenRegister from '../screens/RegisterScreens/BirthdayScreenRegister';
const Stack = createStackNavigator();

export const AuthStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
        gestureEnabled:true,
        gestureDirection:'vertical',
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}>
      <Stack.Screen name="Sign In" component={Login} />
      <Stack.Screen name="Sign Up" component={Register} />
      <Stack.Screen name="NextBirthday" component={BirthdayScreenRegister} />
    </Stack.Navigator>
  );
};
