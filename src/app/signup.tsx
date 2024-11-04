import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert } from 'react-native';

import { SignupForm, type SignupFormProps } from '@/components/signup-form';
import { signUpWithEmail } from '@/core';
import { FocusAwareStatusBar } from '@/ui';

interface SignupData {
  email: string;
  password: string;
}

export default function Signup() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit: SignupFormProps['onSubmit'] = async (data: SignupData) => {
    try {
      setIsLoading(true);
      setError(null);
      await signUpWithEmail(data.email, data.password);
      // If sign in is successful, navigate to home
      router.push('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
      // Handle specific error cases
      if (err instanceof Error) {
        Alert.alert('Sign In Failed', err.message);
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
      <SignupForm onSubmit={onSubmit} isLoading={isLoading} error={error} />
    </>
  );
}
