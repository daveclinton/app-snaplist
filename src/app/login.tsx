import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { show as showToast } from '@/components/toast';
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
      if (error instanceof Error) {
        showToast(error.message, 'error');
        // Alert.alert('Sign In Failed', error.message);
      } else {
        showToast('Sign In Failed', 'error');
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
