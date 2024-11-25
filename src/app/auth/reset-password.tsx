import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { supabase } from '@/core/supabase';

const PasswordResetScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [token, setToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = async ({ url }: any) => {
      if (url) {
        try {
          const parsedUrl = Linking.parse(url);

          if (parsedUrl.queryParams?.token) {
            setToken(parsedUrl.queryParams.token as any);
          }
        } catch (error) {
          console.error('Error parsing deep link:', error);
          Alert.alert('Error', 'Invalid reset link');
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    };

    getInitialURL();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handlePasswordReset = async () => {
    try {
      if (newPassword !== confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return;
      }

      if (newPassword.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return;
      }

      if (!token) {
        Alert.alert('Error', 'Invalid reset token');
        return;
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      Alert.alert('Success', 'Password has been reset successfully', [
        {
          text: 'OK',
          onPress: () => {
            router.push('/login');
          },
        },
      ]);
    } catch (error) {
      console.error('Error resetting password:', error);
    }
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="mb-4 text-xl font-bold">Reset Password</Text>

      <TextInput
        className="mb-4 rounded border p-2"
        placeholder="New Password"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <TextInput
        className="mb-4 rounded border p-2"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        className="rounded bg-blue-500 p-3"
        onPress={handlePasswordReset}
      >
        <Text className="text-center font-semibold text-white">
          Reset Password
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordResetScreen;
