import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { signInWithEmail } from '@/core';
import { FocusAwareStatusBar } from '@/ui';

interface LoginData {
  email: string;
  password: string;
}

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: LoginFormProps['onSubmit'] = async (data: LoginData) => {
    try {
      setIsLoading(true);
      await signInWithEmail(data.email, data.password);
      router.replace('/(app)/');
    } catch (error) {
      // Handle specific error cases
      if (error instanceof Error) {
        Alert.alert('Sign In Failed', error.message);
      } else {
        Alert.alert('Sign In Failed', 'An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
    </>
  );
}
