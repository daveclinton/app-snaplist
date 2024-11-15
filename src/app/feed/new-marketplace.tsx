import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Check, Plus, Store } from 'lucide-react-native';
import * as React from 'react';
import { useEffect, useState } from 'react';

import { useMarkeplaces } from '@/api/marketplaces/use-marketplaces';
import { getUserSessionId } from '@/core/auth/utils';
import { Button, Image, ScrollView, Text, TouchableOpacity, View } from '@/ui';

type MarketplaceCardProps = {
  name: string;
  isLinked: boolean;
  isSupported?: boolean;
  onPress?: () => void;
  iconUrl?: string;
};

const MarketplaceCard = ({
  name,
  isLinked,
  isSupported = true,
  onPress,
  iconUrl,
}: MarketplaceCardProps) => (
  <View className="mb-4 w-[48%] rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
    <View className="items-center">
      <View className="mb-2">
        {iconUrl ? (
          <Image
            source={{ uri: iconUrl }}
            className="size-8 rounded-md"
            transition={1000}
          />
        ) : (
          <Store
            size={32}
            color={!isSupported ? '#94a3b8' : isLinked ? '#0891b2' : '#94a3b8'}
            strokeWidth={1.5}
          />
        )}
      </View>
      <Text className="mb-2 text-base font-medium text-gray-800 dark:text-gray-100">
        {name}
      </Text>
      <View
        className={`mb-3 flex-row items-center rounded-full px-2 py-1 ${
          !isSupported
            ? 'bg-gray-100 dark:bg-gray-700'
            : isLinked
              ? 'bg-cyan-50 dark:bg-cyan-900'
              : 'bg-gray-50 dark:bg-gray-700'
        }`}
      >
        {!isSupported ? (
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            Coming Soon
          </Text>
        ) : isLinked ? (
          <>
            <Check size={12} color="#0891b2" className="mr-1" />
            <Text className="text-xs text-cyan-600 dark:text-cyan-300">
              Connected
            </Text>
          </>
        ) : (
          <>
            <Plus size={12} color="#94a3b8" className="mr-1" />
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Link Now
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity
        onPress={isSupported ? onPress : undefined}
        className={`w-full flex-row items-center justify-center rounded-lg px-4 py-2 ${
          !isSupported
            ? 'bg-gray-100 dark:bg-gray-700'
            : isLinked
              ? 'bg-gray-100 dark:bg-gray-700'
              : 'bg-cyan-500 dark:bg-cyan-600'
        }`}
        disabled={!isSupported}
      >
        <Text
          className={`text-sm font-medium ${
            !isSupported
              ? 'text-gray-400 dark:text-gray-500'
              : isLinked
                ? 'text-gray-600 dark:text-gray-300'
                : 'text-white'
          }`}
        >
          {!isSupported ? 'Not Available' : isLinked ? 'Manage' : 'Connect'}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

type BottomCTAProps = {
  linkedCount: number;
  onContinue: () => void;
  loading: boolean;
};

const BottomCTA = ({ linkedCount, onContinue, loading }: BottomCTAProps) => {
  if (linkedCount === 0) return null;

  return (
    <View className="absolute inset-x-0 bottom-0 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-2 size-4 rounded-full bg-green-500" />
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {linkedCount} marketplace{linkedCount > 1 ? 's' : ''} ready
          </Text>
        </View>
      </View>

      <Button
        label="Start Creating Listings"
        loading={loading}
        onPress={onContinue}
      />
    </View>
  );
};

export default function MarketplaceOAuthScreen() {
  const [loading, setLoading] = React.useState(false);
  const [connectedMarketplaces] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  const initiateOAuth = async (authUrl: string) => {
    await WebBrowser.openAuthSessionAsync(authUrl);
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

  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessionId = async () => {
      const sessionId = await getUserSessionId();
      setUserSupabaseId(sessionId);
    };
    fetchSessionId();
  }, []);

  const { data, isPending, isError } = useMarkeplaces({
    //@ts-ignore
    variables: { userSupabaseId: userSupabaseId },
  });

  const params = useLocalSearchParams();

  useEffect(() => {
    console.log('New Marketplace Page - Params:', params);
  }, [params]);

  if (isPending) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        <Text>Pending</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-gray-900">
        <Text>Error</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
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
            {connectedMarketplaces.length} of {data.length} Linked
          </Text>
        </View>

        {error && (
          <View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900">
            <Text className="text-red-700 dark:text-red-200">{error}</Text>
          </View>
        )}

        <View className="flex-row flex-wrap justify-between">
          {data.map((marketplace) => (
            <MarketplaceCard
              key={marketplace.id}
              name={marketplace.name}
              iconUrl={marketplace.icon_url}
              isLinked={connectedMarketplaces.includes(marketplace.slug)}
              isSupported={marketplace.is_supported}
              onPress={() => initiateOAuth(marketplace.oauth_url)}
            />
          ))}
        </View>
      </ScrollView>

      <BottomCTA
        linkedCount={connectedMarketplaces.length}
        onContinue={handleContinue}
        loading={loading}
      />
    </View>
  );
}
