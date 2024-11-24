import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import LottieView from 'lottie-react-native';
import { useColorScheme } from 'nativewind';
import React, { useRef } from 'react';

import { useIsFirstTime } from '@/core';
import { Button, SafeAreaView, Text, View } from '@/ui';

const OnboardingScreen = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();

  const animation = useRef<LottieView>(null);

  return (
    <SafeAreaView className={`flex-1 bg-white dark:bg-gray-900`}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="mt-6 flex-[0.3] items-center justify-center px-6">
        <View className=" size-64 items-center justify-center">
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

      <View className="flex-[0.5] justify-end gap-2 p-6">
        <View className="mt-10 space-y-3">
          <Text className="mt-4 text-center text-4xl font-bold text-gray-800 dark:text-white">
            Post and Sell
            <Text className="text-3xl text-green-500"> with Ease!</Text>
          </Text>

          <Text className="text-center text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            Ready to save some time? Start posting your items to top
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
            className="h-16"
          />

          <Text className="text-center text-sm text-gray-500 dark:text-gray-400">
            Scan, List, and Sell Effortlessly with just a few taps
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
