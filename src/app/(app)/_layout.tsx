import { Redirect, SplashScreen, Tabs } from 'expo-router';
import { ListPlus, SearchIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React, { useCallback, useEffect } from 'react';

import { useAuth, useIsFirstTime } from '@/core';
import { Feed as FeedIcon, Settings as SettingsIcon } from '@/ui/icons';

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
          headerShown: false,
          tabBarTestID: 'feed-tab',
        }}
      />

      <Tabs.Screen
        name="listings"
        options={{
          title: 'Listings',
          headerShown: false,
          tabBarIcon: ({ color }) => <ListPlus color={color} />,
          tabBarTestID: 'style-tab',
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Product Search',
          headerShown: false,
          tabBarIcon: ({ color }) => <SearchIcon color={color} />,
          tabBarTestID: 'settings-tab',
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
