import {
  router,
  Stack,
  useFocusEffect,
  useLocalSearchParams,
} from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { AlertCircle } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { getUserSessionIdTwo } from '@/api/common/auth';
import { useMarkeplaces } from '@/api/marketplaces/use-marketplaces';
import { BottomCTA } from '@/components/bottom-cta';
import { MarketplaceCard } from '@/components/marketplace-card';
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

// Skeleton Loader Component
const SkeletonLoader = () => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <View className="flex-1 bg-white p-6 dark:bg-gray-900">
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
      <View className="mb-6">
        <View className="mb-4 h-8 w-48 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <View className="mb-6 h-4 w-64 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <View className="mb-6 h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
      </View>

      <View className="flex-row flex-wrap justify-between">
        {[...Array(4)].map((_, index) => (
          <View
            key={index}
            className="mb-4 w-[48%] rounded-lg bg-gray-200 p-4 dark:bg-gray-700"
          >
            <View className="mb-4 h-24 w-full rounded-lg bg-gray-300 dark:bg-gray-600" />
            <View className="mb-2 h-4 w-3/4 rounded-lg bg-gray-300 dark:bg-gray-600" />
            <View className="h-4 w-1/2 rounded-lg bg-gray-300 dark:bg-gray-600" />
          </View>
        ))}
      </View>
    </View>
  );
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
      const sessionId = await getUserSessionIdTwo();
      setUserSupabaseId(sessionId);
      if (!sessionId) {
        router.push('/login');
      }
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

  const handleCreateListing = () => {
    const initialData = {
      title: '',
      description: '',
      price: '',
      pictures: [''],
      category: '',
      condition: '',
      specifics: {
        publisher: '',
        author: '',
        language: '',
      },
      shipping: {
        service: 'USPSMedia',
        cost: 2.5,
        dispatchDays: 3,
      },
      returns: {
        accepted: true,
        period: 30,
        shippingPaidBy: 'Buyer',
      },
    };

    const encodedInitialData = encodeURIComponent(JSON.stringify(initialData));

    router.push({
      pathname: '/scan/create-listing',
      params: { initialData: encodedInitialData },
    });
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      handleCreateListing();
    } catch (error) {
      console.error('Continue Error:', error);
      setError('Failed to proceed');
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return <SkeletonLoader />;
  }

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-6 dark:bg-gray-900">
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
        <View className="items-center rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
          <AlertCircle size={48} color="#EF4444" className="mb-4" />
          <Text className="mb-2 text-center text-xl font-semibold text-red-600 dark:text-red-300">
            Oops! Something went wrong.
          </Text>
          <Text className="text-center text-red-500 dark:text-red-400">
            Our servers could be down, and we're working hard to fix this.
            Please try again later.
          </Text>
        </View>
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
