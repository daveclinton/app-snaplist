import { Link, router } from 'expo-router';
import {
  Camera,
  ChevronRight,
  HamIcon,
  HelpCircle,
  Plus,
  ShoppingCart,
  Store,
} from 'lucide-react-native';
import { MotiScrollView } from 'moti';
import React, { useCallback } from 'react';
import { Alert, Linking } from 'react-native';

import { FeedHeader } from '@/components/feed-screen';
import RecentListings from '@/components/recent-listings';
import {
  useCameraPermission,
  usePhotoLibraryPermission,
} from '@/core/hooks/use-permissions';
import { FocusAwareStatusBar, Text, TouchableOpacity, View } from '@/ui';

export const userData = {
  name: 'John',
  notifications: 3,
  linkedAccounts: [
    {
      id: 1,
      name: 'Facebook',
      icon: HamIcon,
      isLinked: true,
      isSupported: true,
    },
    { id: 2, name: 'eBay', icon: Store, isLinked: false, isSupported: true },
    {
      id: 3,
      name: 'Amazon',
      icon: ShoppingCart,
      isLinked: false,
      isSupported: true,
    },
    { id: 4, name: 'Etsy', icon: Store, isLinked: false, isSupported: false },
  ],
  recentScans: [
    {
      id: 1,
      name: 'Vintage Camera',
      image: '/placeholder-image.jpg',
      description: 'Retro film camera in excellent condition',
      postedOn: ['eBay', 'Facebook'],
      date: '2h ago',
    },
    {
      id: 2,
      name: 'Gaming Console',
      image: '/placeholder-image.jpg',
      description: 'Latest generation gaming system',
      postedOn: ['Facebook'],
      date: '5h ago',
    },
  ],
};

export default function Feed() {
  const isNewUser = true;
  const { requestCameraAccessIfNeeded } = useCameraPermission();
  const { requestPhotoAccessIfNeeded } = usePhotoLibraryPermission();
  const onPressTakePicture = useCallback(async () => {
    try {
      if (!(await requestCameraAccessIfNeeded())) {
        return;
      }
      if (!(await requestPhotoAccessIfNeeded())) {
        return;
      }
      await router.push('/scan/scan');
    } catch (err: any) {
      // ignore
      Alert.alert(
        'Permissions needed',
        `Snaplist does not have permission to access your permissions.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
  }, [requestCameraAccessIfNeeded, requestPhotoAccessIfNeeded]);

  return (
    <FeedHeader onCameraOpen={onPressTakePicture}>
      <View className="flex-1 bg-white px-4 dark:bg-gray-900">
        <MotiScrollView className="px-3" showsVerticalScrollIndicator={false}>
          <FocusAwareStatusBar />
          <Header />
          <LinkedAccountsBar accounts={userData.linkedAccounts} />

          {isNewUser && <NewUserGuide />}

          {/* Scan Button */}
          <ScanButton onPress={onPressTakePicture} />

          {/* Recent Scans */}
          <RecentListings scans={userData.recentScans} viewAll />
        </MotiScrollView>
      </View>
    </FeedHeader>
  );
}

const Header = () => (
  <View className=" mt-2 flex-row items-center justify-start">
    <Text className="text-xl text-gray-700 dark:text-gray-400">
      Connect Marketplaces
    </Text>
  </View>
);

const LinkedAccountsBar = ({
  accounts,
}: {
  accounts: typeof userData.linkedAccounts;
}) => (
  <View className="mb-6 flex-row items-center rounded-xl bg-white p-4 dark:bg-gray-800">
    <View className="flex-1 flex-row">
      {accounts.map((account) => (
        <View key={account.id} className="mr-4 items-center">
          <View
            className={`size-10 items-center justify-center rounded-full ${
              account.isLinked
                ? 'bg-cyan-50 dark:bg-cyan-900'
                : 'bg-gray-100 dark:bg-gray-700'
            }`}
          >
            <account.icon
              size={20}
              color={account.isLinked ? '#0891b2' : '#94a3b8'}
            />
          </View>
          <Text className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {account.name}
          </Text>
        </View>
      ))}
    </View>
    <Link href="/feed/new-marketplace" asChild>
      <TouchableOpacity>
        <Plus size={24} color="#006064" />
      </TouchableOpacity>
    </Link>
  </View>
);

const NewUserGuide = () => (
  <View className="mb-6 rounded-xl bg-cyan-50 p-4 dark:bg-cyan-900">
    <View className="flex-row items-start">
      <View className="mr-3 size-8 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-800">
        <HelpCircle size={20} color="#0891b2" />
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-base font-medium text-cyan-900 dark:text-cyan-50">
          Quick Start Guide
        </Text>
        <Text className="mb-3 text-sm text-cyan-700 dark:text-cyan-200">
          Start by scanning your first item. Just tap the camera button and
          point at your product!
        </Text>
        <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
          <Text className="mr-1 text-sm font-medium text-cyan-600 dark:text-cyan-300">
            Learn More
          </Text>
          <ChevronRight size={16} color="#0891b2" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const ScanButton = ({ onPress }: { onPress: () => void }) => (
  <View className="mb-8 items-center">
    <TouchableOpacity
      className="mb-2 size-16 items-center justify-center rounded-full bg-cyan-500 shadow-lg dark:bg-cyan-600"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Camera size={32} color="white" />
    </TouchableOpacity>
    <Text className="text-sm text-gray-600 dark:text-gray-400">
      Tap to scan item
    </Text>
  </View>
);
