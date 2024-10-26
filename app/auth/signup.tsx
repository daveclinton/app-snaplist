import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';

import { Column } from '~/components/layouts/Column';
import { Screen } from '~/components/layouts/Screen';
import { supabase } from '~/utils/supabase';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert('Please check your inbox for email verification!');
    setLoading(false);
    router.replace('/auth/login');
    console.log('Login Here', loading);
  }

  return (
    <Screen padded centered>
      <View className="w-full max-w-sm">
        <Column spacing="lg">
          <Text>Sign Up</Text>
          <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Sign Up" onPress={signUpWithEmail} />
          <Text onPress={() => router.push('/auth/login')}>Already have an account? Log in</Text>
        </Column>
      </View>
    </Screen>
  );
};

export default Signup;
