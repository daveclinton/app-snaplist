import { router } from 'expo-router';
import { Check, Plus, Store } from 'lucide-react-native';

import { Image, Text, TouchableOpacity, View } from '@/ui';

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

type MarketplaceCardProps = {
  marketplace: MarketplaceData;
  onPress: () => void;
};

export const MarketplaceCard = ({
  marketplace,
  onPress,
}: MarketplaceCardProps) => {
  const { marketplace: details, connectionStatus } = marketplace;
  const isLinked = connectionStatus === 'ACTIVE';

  const isNotLinked = connectionStatus === 'DISCONNECTED';

  const handleManage = () => {
    return router.push('/(app)/settings');
  };
  return (
    <View className="mb-4 w-[48%] rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
      <View className="items-center">
        <View className="mb-2">
          {details.icon_url ? (
            <Image
              source={{ uri: details.icon_url }}
              className="size-8 rounded-md"
              transition={1000}
            />
          ) : (
            <Store
              size={32}
              color={
                !details.is_supported
                  ? '#94a3b8'
                  : isLinked
                    ? '#0891b2'
                    : '#94a3b8'
              }
              strokeWidth={1.5}
            />
          )}
        </View>
        <Text className="mb-2 text-base font-medium text-gray-800 dark:text-gray-100">
          {details.name}
        </Text>
        <View
          className={`mb-3 flex-row items-center rounded-full px-2 py-1 ${
            !details.is_supported
              ? 'bg-gray-100 dark:bg-gray-700'
              : isLinked
                ? 'bg-cyan-50 dark:bg-cyan-900'
                : 'bg-gray-50 dark:bg-gray-700'
          }`}
        >
          {!details.is_supported ? (
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
          onPress={details.is_supported && isNotLinked ? onPress : handleManage}
          className={`w-full flex-row items-center justify-center rounded-lg px-4 py-2 ${
            !details.is_supported
              ? 'bg-gray-100 dark:bg-gray-700'
              : isLinked
                ? 'bg-gray-100 dark:bg-gray-700'
                : 'bg-cyan-500 dark:bg-cyan-600'
          }`}
          disabled={!details.is_supported}
        >
          <Text
            className={`text-sm font-medium ${
              !details.is_supported
                ? 'text-gray-400 dark:text-gray-500'
                : isLinked
                  ? 'text-gray-600 dark:text-gray-300'
                  : 'text-white'
            }`}
          >
            {!details.is_supported
              ? 'Not Available'
              : isLinked
                ? 'Manage'
                : 'Connect'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
