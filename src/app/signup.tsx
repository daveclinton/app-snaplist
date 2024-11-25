import { useRouter } from 'expo-router';
import React, { useState } from 'react';

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
      router.push('/login');
    } catch (err) {
      console.log(
        err instanceof Error ? err.message : 'Failed to create account',
      );
      if (err instanceof Error) {
        console.log(err.message, 'error');
      } else {
        console.log('Account creation failed', 'error');
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
