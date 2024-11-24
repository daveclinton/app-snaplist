import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { Alert } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { supabase } from '@/core/supabase';
import { Button, ControlledInput, Pressable, Text, View } from '@/ui';
import { ControlledPasswordInput } from '@/ui/password';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading?: boolean;
  error?: string | null;
};

export const LoginForm = ({
  onSubmit = () => {},
  isLoading = false,
  error = null,
}: LoginFormProps) => {
  const { handleSubmit, control, getValues } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const resetPassword = async () => {
    const { email } = getValues();
    if (!email) {
      setResetMessage(
        'Please enter your email address to reset your password.',
      );
      return;
    }
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'com.snaplist://auth/reset-password',
      });
      if (error) {
        setResetMessage(`Error: ${error.message}`);
      } else {
        Alert.alert(
          'Check your email',
          'We have sent you a password reset link',
        );
        setResetMessage('Password reset email sent successfully!');
      }
    } catch (error) {
      setResetMessage('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <Text
          testID="form-title"
          className="pb-6 text-center text-2xl font-bold text-primary-600"
        >
          Sign In
        </Text>
        {error && (
          <Text
            className="mb-4 text-center text-red-500"
            testID="error-message"
          >
            {error}
          </Text>
        )}

        <ControlledInput
          testID="email-input"
          control={control}
          name="email"
          label="Email"
          editable={!isLoading}
          placeholder="example@xyz.com"
        />

        <ControlledPasswordInput
          name="password"
          control={control}
          label="Password"
          placeholder="Enter your password"
          testID="password-input"
        />
        <Button
          testID="login-button"
          label={isLoading ? 'Signing in...' : 'Login'}
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
          loading={isLoading}
          className="h-12"
        />
        <Pressable onPress={resetPassword}>
          <Text className="text-center text-sm text-primary-600">
            Forgot your password?
          </Text>
        </Pressable>
        {resetMessage && (
          <Text className="mt-4 text-center text-sm text-gray-600">
            {resetMessage}
          </Text>
        )}

        <View className="mt-4 flex-row justify-center">
          <Text className="text-gray-600">Don't have an account? </Text>
          <Link href="/signup" asChild>
            <Pressable>
              <Text className="font-semibold text-primary-600">Create one</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
