import { useRouter } from 'expo-router';
import React from 'react';

import { useIsFirstTime } from '@/core/hooks';
import {
  Button,
  FocusAwareStatusBar,
  Image,
  SafeAreaView,
  Text,
  View,
} from '@/ui';

const OnboardingScreen = () => {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();

  return (
    <View className="flex h-full py-10">
      <FocusAwareStatusBar />
      <View className="flex-1">
        <View className="flex-1 items-center justify-center">
          <Image
            className="w-full flex-1"
            source={require('../../assets/onboarding.svg')}
            transition={1000}
          />
        </View>
        <View className="bg-surface-900 dark:bg-surface-800 rounded-t-3xl px-6 py-4">
          <Text className="mb-4 text-center text-4xl font-bold">
            Scan, List, and Sell Effortlessly
          </Text>
          <Text className="mb-6 text-center text-lg text-gray-400 dark:text-gray-400">
            AI-Powered Listings on Multiple Marketplaces
          </Text>
          <View className="mb-6 grid grid-cols-3 gap-4">
            <View className="flex items-center">
              <Text className="mb-2 text-3xl font-bold text-[#8E2DE2]">🔍</Text>
              <Text className="text-base font-medium">Scan with AI</Text>
              <Text className="text-base text-gray-400 dark:text-gray-400">
                Automatic descriptions and price suggestions
              </Text>
            </View>
            <View className="flex items-center">
              <Text className="mb-2 text-3xl font-bold text-[#8E2DE2]">📤</Text>
              <Text className="text-base font-medium">Post Everywhere</Text>
              <Text className="text-base text-gray-400 dark:text-gray-400">
                One-click listing on major marketplaces
              </Text>
            </View>
          </View>
          <SafeAreaView>
            <Button
              label="Start Scanning Now"
              onPress={() => {
                setIsFirstTime(false);
                router.replace('/login');
              }}
            />
          </SafeAreaView>
          <Text className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Your data stays secure with us.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default OnboardingScreen;
