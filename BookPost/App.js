import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import { RootNavigation } from './src/navigation';
import { AuthProvider } from './src/hooks/Autentication';

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
