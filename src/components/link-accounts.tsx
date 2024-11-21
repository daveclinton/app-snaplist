import { Loader2, Plus, Store } from 'lucide-react-native';
import React from 'react';

import { type SUPPORTED_MARKETPLACES } from '@/core/constants';
import { Image, Pressable, Text, View } from '@/ui';

const MarketplaceIcon = ({
  isLinked,
  iconUrl,
  isSupported,
  name,
}: {
  isLinked: boolean;
  iconUrl: string;
  isSupported: boolean;
  name: string;
}) => (
  <View className="mr-4 items-center">
    <View
      className={`size-10 items-center justify-center rounded-full ${
        isLinked
          ? 'bg-cyan-50 dark:bg-cyan-900'
          : 'bg-gray-100 dark:bg-gray-700'
      }`}
    >
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
    <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
      {name}
    </Text>
  </View>
);

export const LinkedAccountsBar = ({
  accounts,
  handleMarketplace,
  isLoading = false,
}: {
  accounts: typeof SUPPORTED_MARKETPLACES;
  handleMarketplace: () => void;
  isLoading?: boolean;
}) => (
  <View className="mb-6 flex-row items-center rounded-xl bg-white p-4 dark:bg-gray-800">
    <View className="flex-1 flex-row">
      {accounts.map(({ id, is_linked, icon_url, is_supported, name }) => (
        <MarketplaceIcon
          key={id}
          isLinked={is_linked}
          iconUrl={icon_url}
          isSupported={is_supported}
          name={name}
        />
      ))}
    </View>
    <Pressable
      onPress={handleMarketplace}
      disabled={isLoading}
      className="relative"
    >
      {isLoading ? (
        <Loader2 size={24} color="#006064" className="animate-spin" />
      ) : (
        <Plus size={24} color="#006064" />
      )}
    </Pressable>
  </View>
);
