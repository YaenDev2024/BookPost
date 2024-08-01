import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { NavigationStack } from './navigationStack';
import { AuthStack } from './authStack';

export const RootNavigation = () => {
    const { user } = useAuth();
    return (
      <>
        {user ? <NavigationStack /> : <AuthStack />}
        
      </>
    );
  };