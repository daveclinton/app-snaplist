import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { useColorScheme } from 'nativewind';
import React, { useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useIsFirstTime } from '@/core';
import { Button, SafeAreaView, Text, View } from '@/ui';

const OnboardingScreen = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const animation = useRef<LottieView>(null);

  return (
    <SafeAreaView className={`flex-1 bg-white dark:bg-gray-900`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View className="absolute inset-0 opacity-5">
        <View className="flex-1 flex-row flex-wrap">
          {[...Array(100)].map((_, i) => (
            <View
              key={i}
              className="size-8 border border-gray-200 dark:border-gray-700"
            />
          ))}
        </View>
      </View>

      <View className="flex-1">
        <View className="mt-6 flex-[0.6] items-center justify-center px-6">
          <View className="size-72 items-center justify-center">
            <LottieView
              autoPlay
              ref={animation}
              style={{
                width: '100%',
                flex: 1,
              }}
              source={require('../../assets/onboarding.json')}
            />
          </View>
        </View>

        <View className="flex-[0.4] justify-end px-6">
          <View className="mb-8 space-y-3">
            <Text className="text-center text-4xl font-bold text-gray-800 dark:text-white">
              Post and Sell
              <Text className="text-green-500"> with Ease!</Text>
            </Text>

            <Text className="text-center text-lg leading-relaxed text-gray-600 dark:text-gray-300">
              Ready to make some cash? Start posting your items to top
              marketplaces like eBay, Facebook, and Mercari. Simplify your
              selling, and reach buyers in no time!
            </Text>
          </View>

          <View className="space-y-4 pb-6">
            <Button
              label="Start Selling"
              onPress={() => {
                setIsFirstTime(false);
                router.replace('/login');
              }}
            />

            <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
              Scan, List, and Sell Effortlessly with just a few taps
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
