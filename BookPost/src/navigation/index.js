import React, { useState } from 'react';
import { NavigationStack } from './navigationStack';
import { AuthStack } from './authStack';
import { useAuth } from '../hooks/Autentication';

export const RootNavigation = () => {
  const { user } = useAuth();

  return (
    <>
      { user ? <NavigationStack /> : <AuthStack />}
    </>
  );
};