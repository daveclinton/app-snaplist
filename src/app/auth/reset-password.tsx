import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { supabase } from '@/core/supabase';
import { Button, ControlledInput, Text, View } from '@/ui';

// Constants
const MIN_PASSWORD_LENGTH = 8;

// Form validation schema
const schema = z
  .object({
    password: z
      .string({
        required_error: 'Password is required',
      })
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      ),
    confirmPassword: z
      .string({
        required_error: 'Confirm password is required',
      })
      .min(
        MIN_PASSWORD_LENGTH,
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormType = z.infer<typeof schema>;

interface ResetPasswordState {
  isLoading: boolean;
  error: string | null;
  token: string | null;
  type: string | null;
}

export default function ResetPassword() {
  const [state, setState] = useState<ResetPasswordState>({
    isLoading: false,
    error: null,
    token: null,
    type: null,
  });

  const router = useRouter();

  const { handleSubmit, control } = useForm<FormType>({
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    const getInitialParams = async () => {
      try {
        const response = await Linking.parseInitialURLAsync();
        if (response?.queryParams) {
          const { token, type } = response.queryParams as {
            token?: string;
            type?: string;
          };
          if (token && type) {
            setState((prev) => ({
              ...prev,
              token,
              type,
            }));
          } else {
            handleInvalidToken();
          }
        }
      } catch (error) {
        console.error('Error parsing initial URL:', error);
        handleInvalidToken();
      }
    };

    getInitialParams();

    // Listen for incoming links while the app is open
    const subscription = Linking.addEventListener('url', (response) => {
      const { queryParams } = response.url
        ? Linking.parse(response.url)
        : { queryParams: null };
      if (queryParams?.token && queryParams?.type) {
        setState((prev) => ({
          ...prev,
          token: queryParams.token as string,
          type: queryParams.type as string,
        }));
      } else {
        handleInvalidToken();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleInvalidToken = () => {
    Alert.alert(
      'Invalid Reset Link',
      'This password reset link is invalid or has expired.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/login'),
          style: 'default',
        },
      ],
      { cancelable: false },
    );
  };

  const onSubmit = async (data: FormType) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      if (!state.token || state.type !== 'recovery') {
        handleInvalidToken();
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (updateError) {
        throw new Error(updateError.message);
      }

      handleSuccess();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error:
          err instanceof Error ? err.message : 'An unexpected error occurred',
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleSuccess = () => {
    Alert.alert(
      'Success',
      'Your password has been reset successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.replace('/login'),
          style: 'default',
        },
      ],
      { cancelable: false },
    );
  };

  // Don't render the form if there's no token
  if (!state.token) return null;

  const { isLoading, error } = state;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
      accessible={true}
      accessibilityLabel="Reset Password Form"
    >
      <View className="flex-1 justify-center p-4">
        <Text
          className="pb-6 text-center text-2xl font-bold text-primary-600"
          accessibilityRole="header"
        >
          Reset Password
        </Text>

        {error && (
          <Text
            className="mb-4 text-center text-red-500"
            accessibilityRole="alert"
          >
            {error}
          </Text>
        )}

        <ControlledInput
          control={control}
          name="password"
          label="New Password"
          placeholder="Enter your new password"
          secureTextEntry={true}
          editable={!isLoading}
          accessibilityLabel="New Password Input"
          accessibilityHint="Enter a strong password with at least 8 characters"
        />

        <ControlledInput
          control={control}
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your new password"
          secureTextEntry={true}
          editable={!isLoading}
          accessibilityLabel="Confirm Password Input"
          accessibilityHint="Re-enter your new password"
        />

        <Button
          label={isLoading ? 'Resetting...' : 'Reset Password'}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          loading={isLoading}
          accessibilityLabel={
            isLoading ? 'Resetting password' : 'Reset Password'
          }
          accessibilityRole="button"
        />
      </View>
    </KeyboardAvoidingView>
  );
}
