import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import * as z from 'zod';

import { Button, ControlledInput, Pressable, Text, View } from '@/ui';
import { ControlledPasswordInput } from '@/ui/password';

const schema = z
  .object({
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
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type FormType = z.infer<typeof schema>;

export type SignupFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading?: boolean;
  error?: string | null;
};

export const SignupForm = ({
  onSubmit = () => {},
  isLoading = false,
  error = null,
}: SignupFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

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
          Create Account
        </Text>

        {error && (
          <Text
            className="mb-4 text-center text-red-500"
            testID="error-message"
          >
            {error}
          </Text>
        )}

        <View className="space-y-4">
          <ControlledInput
            testID="email-input"
            control={control}
            name="email"
            label="Email"
            editable={!isLoading}
            textContentType="emailAddress"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            placeholder="example@xyz.com"
          />

          <ControlledPasswordInput
            name="password"
            control={control}
            label="Password"
            placeholder="Enter your password"
            testID="password-input"
            editable={!isLoading}
            textContentType="newPassword"
            autoComplete="password-new"
          />

          <ControlledPasswordInput
            name="confirmPassword"
            control={control}
            label="Confirm Password"
            placeholder="Confirm your password"
            testID="confirm-password-input"
            editable={!isLoading}
            textContentType="newPassword"
            autoComplete="password-new"
          />

          <Button
            testID="signup-button"
            label={isLoading ? 'Creating Account...' : 'Create Account'}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            loading={isLoading}
          />

          <View className="mt-4 flex-row justify-center space-x-1">
            <Text className="text-gray-600">Already have an account?</Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text className="font-semibold text-primary-600">Sign In</Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
