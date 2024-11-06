/* eslint-disable react/no-unstable-nested-components */
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect } from 'react';

import { useAuth, useIsFirstTime } from '@/core';
import {
  Feed as FeedIcon,
  Settings as SettingsIcon,
  Style as StyleIcon,
} from '@/ui/icons';

export default function TabLayout() {
  const status = useAuth.use.status();
  const [isFirstTime] = useIsFirstTime();
  const hideSplash = useCallback(async () => {
    await SplashScreen.hideAsync();
  }, []);
  useEffect(() => {
    if (status !== 'idle') {
      setTimeout(() => {
        hideSplash();
      }, 1000);
    }
  }, [hideSplash, status]);

  console.log('IsFirstTime', isFirstTime);

  console.log('Status', status);
  const { colorScheme } = useColorScheme();

  if (isFirstTime) {
    return <Redirect href="/onboarding" />;
  }
  if (status === 'unauthenticated') {
    return <Redirect href="/login" />;
  }
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color }) => <FeedIcon color={color} />,
          // headerRight: () => <CreateNewMarketPlace />,
          tabBarTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="style"
        options={{
          title: 'Style',
          headerShown: false,
          tabBarIcon: ({ color }) => <StyleIcon color={color} />,
          tabBarTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => <SettingsIcon color={color} />,
          tabBarTestID: 'settings-tab',
        }}
      />
    </Tabs>
  );
}
