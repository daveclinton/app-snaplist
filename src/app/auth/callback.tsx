import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Alert, Text } from 'react-native';

import { supabase } from '@/core/supabase';

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();

  useEffect(() => {
    const handleVerification = async () => {
      try {
        const token = params.token as string;
        const type = params.type as string;

        if (type === 'signup') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup',
          });

          if (error) throw error;

          Alert.alert(
            'Email Verified',
            'Your email has been verified. Please log in.',
            [
              {
                text: 'OK',
                onPress: () => router.push('/login'),
              },
            ],
          );
        }
      } catch (error) {
        console.error('Verification error:', error);
        Alert.alert(
          'Verification Failed',
          'Failed to verify your email. Please try again.',
        );
        router.push('/login');
      }
    };

    if (params.token) {
      handleVerification();
    }
  }, [params.token, params.type, router]);

  return <Text>Verifying your email...</Text>;
}
