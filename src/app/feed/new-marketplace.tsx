import { router, Stack } from 'expo-router';
import { Check, HamIcon, Plus, ShoppingCart, Store } from 'lucide-react-native';
import * as React from 'react';

import { Button, ScrollView, Text, TouchableOpacity, View } from '@/ui';

type Marketplace = {
  id: number;
  name: string;
  icon: any;
  isLinked: boolean;
};

export const MARKETPLACES: Marketplace[] = [
  { id: 1, name: 'Facebook', icon: HamIcon, isLinked: true },
  { id: 2, name: 'eBay', icon: Store, isLinked: false },
  { id: 3, name: 'Amazon', icon: ShoppingCart, isLinked: false },
];

type MarketplaceCardProps = {
  name: string;
  Icon: Marketplace['icon'];
  isLinked: boolean;
  onPress?: () => void;
};

const MarketplaceCard = ({
  name,
  Icon,
  isLinked,
  onPress,
}: MarketplaceCardProps) => (
  <View className="mb-4 w-[48%] rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
    <View className="items-center">
      <View className="mb-2">
        <Icon
          size={32}
          color={isLinked ? '#0891b2' : '#94a3b8'}
          strokeWidth={1.5}
        />
      </View>
      <Text className="mb-2 text-base font-medium text-gray-800 dark:text-gray-100">
        {name}
      </Text>
      <View
        className={`mb-3 flex-row items-center rounded-full px-2 py-1 ${
          isLinked
            ? 'bg-cyan-50 dark:bg-cyan-900'
            : 'bg-gray-50 dark:bg-gray-700'
        }`}
      >
        {isLinked ? (
          <Check size={12} color="#0891b2" className="mr-1" />
        ) : (
          <Plus size={12} color="#94a3b8" className="mr-1" />
        )}
        <Text
          className={`text-xs ${
            isLinked
              ? 'text-cyan-600 dark:text-cyan-300'
              : 'text-gray-500 dark:text-gray-400'
          }`}
        >
          {isLinked ? 'Connected' : 'Link Now'}
        </Text>
      </View>

      <TouchableOpacity
        onPress={onPress}
        className={`w-full flex-row items-center justify-center rounded-lg px-4 py-2 ${
          isLinked
            ? 'bg-gray-100 dark:bg-gray-700'
            : 'bg-cyan-500 dark:bg-cyan-600'
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            isLinked ? 'text-gray-600 dark:text-gray-300' : 'text-white'
          }`}
        >
          {isLinked ? 'Manage' : 'Connect'}
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
          <View className="mr-2 size-2 rounded-full bg-green-500" />
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

export default function AddPost() {
  const linkedCount = MARKETPLACES.filter((m) => m.isLinked).length;
  const [loading, setLoading] = React.useState(false);

  const handleContinue = async () => {
    setLoading(true);
    console.log('Here');
    router.back();
    setLoading(false);
  };

  const handleMarketplacePress = (marketplace: Marketplace) => {
    console.log(`${marketplace.name} pressed`);
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Connect Market',
          headerBackTitle: 'Feed',
        }}
      />
      <View className="flex-1 bg-white p-4 dark:bg-gray-900">
        <View className="px-6 pb-4 pt-6">
          <Text className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
            Link Your Marketplaces
          </Text>
          <Text className="mb-4 text-base text-gray-600 dark:text-gray-400">
            Connect your online stores to manage all your listings from one
            place
          </Text>

          <View className="mb-4 flex-row items-center rounded-lg bg-cyan-50 p-3 dark:bg-cyan-900">
            <Text className="font-medium text-cyan-700 dark:text-cyan-200">
              {linkedCount} of {MARKETPLACES.length} Linked
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="flex-row flex-wrap justify-between">
              {MARKETPLACES.map((marketplace) => (
                <MarketplaceCard
                  key={marketplace.id}
                  name={marketplace.name}
                  Icon={marketplace.icon}
                  isLinked={marketplace.isLinked}
                  onPress={() => handleMarketplacePress(marketplace)}
                />
              ))}
            </View>
            <View className="h-24" />
          </ScrollView>

          <BottomCTA
            linkedCount={linkedCount}
            onContinue={handleContinue}
            loading={loading}
          />
        </View>
      </View>
    </>
  );
}
