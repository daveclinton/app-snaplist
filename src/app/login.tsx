import { router } from 'expo-router';
import React, { useState } from 'react';

import { hideLoader, showLoader } from '@/components/loader';
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
      showLoader();
      setIsLoading(true);
      await signInWithEmail(data.email, data.password);
      router.replace('/(app)/');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message, 'error');
        // Alert.alert('Sign In Failed', error.message);
      } else {
        console.log('Sign In Failed', 'error');
      }
    } finally {
      hideLoader();
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
