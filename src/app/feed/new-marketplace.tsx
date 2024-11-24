import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useMarkeplaces } from '@/api/marketplaces/use-marketplaces';
import { BottomCTA } from '@/components/bottom-cta';
import { MarketplaceCard } from '@/components/marketplace-card';
import { getUserSessionId } from '@/core/auth/utils';
import { ScrollView, Text, View } from '@/ui';

type MarketplaceData = {
  connectionStatus: string;
  marketplace: {
    icon_url: string;
    id: number;
    is_linked: boolean;
    is_supported: boolean;
    mobile_app: any;
    name: string;
    oauth: any;
    slug: string;
  };
  oauth_url: string;
};

export default function MarketplaceOAuthScreen() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { data, isPending, isError, refetch } = useMarkeplaces({
    variables: { userSupabaseId: userSupabaseId! },
    enabled: !!userSupabaseId,
  });

  const params = useLocalSearchParams();

  useFocusEffect(
    React.useCallback(() => {
      if (params?.status === 'success') {
        refetch();
      }
    }, [params?.status, refetch]),
  );

  useEffect(() => {
    const fetchSessionId = async () => {
      const sessionId = await getUserSessionId();
      setUserSupabaseId(sessionId);
    };
    fetchSessionId();
  }, []);

  useEffect(() => {
    console.log('New Marketplace Page - Params:', params);
  }, [params]);

  const initiateOAuth = async (authUrl: string) => {
    try {
      await WebBrowser.openAuthSessionAsync(authUrl);
    } catch (error) {
      console.error('OAuth Error:', error);
      setError('Failed to open authentication page');
    }
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      router.back();
    } catch (error) {
      console.error('Continue Error:', error);
      setError('Failed to proceed');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        <Text>Loading marketplaces...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        <Text>Failed to load marketplaces</Text>
      </View>
    );
  }

  const connectedCount =
    data?.filter((item: MarketplaceData) => item.connectionStatus === 'ACTIVE')
      .length ?? 0;

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <Stack.Screen
        options={{
          title: 'Connect Marketplaces',
          headerBackTitle: 'Home',
          headerStyle: {
            backgroundColor: isDark ? '#030712' : '#f9fafb',
          },
          headerTintColor: isDark ? '#f3f4f6' : '#111827',
        }}
      />
      <ScrollView
        className="flex-[0.8] px-6 pb-4 pt-6"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Link Your Marketplaces
        </Text>
        <Text className="mb-4 text-base text-gray-600 dark:text-gray-400">
          Connect your online stores to manage all your listings from one place
        </Text>

        <View className="mb-4 flex-row items-center rounded-lg bg-cyan-50 p-3 dark:bg-cyan-900">
          <Text className="font-medium text-cyan-700 dark:text-cyan-200">
            {connectedCount} of {data?.length ?? 0} Linked
          </Text>
        </View>

        {error && (
          <View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900">
            <Text className="text-red-700 dark:text-red-200">{error}</Text>
          </View>
        )}

        <View className="flex-row flex-wrap justify-between">
          {data?.map((item: MarketplaceData) => (
            <MarketplaceCard
              key={item.marketplace.id}
              marketplace={item}
              onPress={() => initiateOAuth(item.oauth_url)}
            />
          ))}
        </View>
      </ScrollView>

      <BottomCTA
        connectedCount={connectedCount}
        onContinue={handleContinue}
        loading={loading}
      />
    </View>
  );
}
