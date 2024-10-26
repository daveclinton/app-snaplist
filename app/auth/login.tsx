import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';

import { Column } from '~/components/layouts/Column';
import { Screen } from '~/components/layouts/Screen';
import { supabase } from '~/utils/supabase';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  async function signInWithEmail() {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
  }

  return (
    <Screen centered>
      <View className="w-full max-w-sm">
        <Column spacing="lg">
          <Text className="text-center text-2xl font-bold">Login</Text>
          <TextInput value={email} onChangeText={setEmail} placeholder="Enter your email" />
          <TextInput
            value={password}
            placeholder="Enter your password"
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Login" onPress={signInWithEmail} />
          <Text onPress={() => router.push('/auth/signup')}>Don’t have an account? Sign up</Text>
        </Column>
      </View>
    </Screen>
  );
};

export default Login;
