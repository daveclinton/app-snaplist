import { useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, TextInput, Text, Alert, Pressable } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import { Column } from '~/components/layouts/Column';
import { Screen } from '~/components/layouts/Screen';
import { supabase } from '~/utils/supabase';

const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    try {
      signupSchema.parse({ email, password, confirmPassword });
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  async function signUpWithEmail() {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError('');

      const {
        data: { session },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (!session) {
        Alert.alert('Verification Required', 'Please check your inbox for email verification!', [
          { text: 'OK', onPress: () => router.replace('/auth/login') },
        ]);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen centered padded>
      <View className="w-full max-w-sm p-4">
        <Column spacing="lg">
          <Text className="text-center text-2xl font-bold">Create Account</Text>

          {error ? (
            <View className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
              <Text className="text-sm text-red-800">{error}</Text>
            </View>
          ) : null}

          <View className="relative">
            <View className="absolute left-3 top-3">
              <Mail size={20} color="#9CA3AF" />
            </View>
            <TextInput
              className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pl-10"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setError('');
              }}
              placeholder="Email address"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
            />
          </View>

          <View className="relative">
            <View className="absolute left-3 top-3">
              <Lock size={20} color="#9CA3AF" />
            </View>
            <TextInput
              className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pl-10 pr-10"
              value={password}
              placeholder="Password"
              onChangeText={(text) => {
                setPassword(text);
                setError('');
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoComplete="password"
            />
            <Pressable
              className="absolute right-3 top-3"
              onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </Pressable>
          </View>

          <View className="relative">
            <View className="absolute left-3 top-3">
              <Lock size={20} color="#9CA3AF" />
            </View>
            <TextInput
              className="h-12 w-full rounded-lg border border-gray-300 bg-white px-4 pl-10 pr-10"
              value={confirmPassword}
              placeholder="Confirm Password"
              onChangeText={(text) => {
                setConfirmPassword(text);
                setError('');
              }}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              autoComplete="password"
            />
            <Pressable
              className="absolute right-3 top-3"
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </Pressable>
          </View>

          <Button
            title="Sign Up"
            onPress={signUpWithEmail}
            isLoading={isLoading}
            loadingText="Creating account..."
            fullWidth
          />

          <View className="flex-row justify-center space-x-1">
            <Text className="text-gray-600">Already have an account?</Text>
            <Pressable onPress={() => router.push('/auth/login')}>
              <Text className="font-semibold text-blue-600">Log in</Text>
            </Pressable>
          </View>
        </Column>
      </View>
    </Screen>
  );
};

export default Signup;
