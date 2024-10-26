import { useRouter } from 'expo-router';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react-native';
import React, { useState } from 'react';
import { View, TextInput, Text, Alert, Pressable } from 'react-native';
import { z } from 'zod';

import { Button } from '~/components/Button';
import { Column } from '~/components/layouts/Column';
import { Screen } from '~/components/layouts/Screen';
import { supabase } from '~/utils/supabase';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      return true;
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
      return false;
    }
  };

  async function signInWithEmail() {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      setError('');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
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

  async function resetPassword() {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      Alert.alert('Password Reset', 'Check your email for password reset instructions');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Screen centered padded>
      <View className="w-full max-w-sm p-4">
        <Column spacing="lg">
          <Text className="text-center text-2xl font-bold">Welcome Back</Text>

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
          <Button
            title="Sign In"
            onPress={signInWithEmail}
            isLoading={isLoading}
            loadingText="Signing in..."
            fullWidth
          />
          <Pressable onPress={resetPassword}>
            <Text className="text-center text-sm text-blue-600">Forgot your password?</Text>
          </Pressable>
          <View className="flex-row justify-center space-x-1">
            <Text className="text-gray-600">Don't have an account?</Text>
            <Pressable onPress={() => router.push('/auth/signup')}>
              <Text className="font-semibold text-blue-600">Sign up</Text>
            </Pressable>
          </View>
        </Column>
      </View>
    </Screen>
  );
};

export default Login;
