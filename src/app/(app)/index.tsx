import { router } from 'expo-router';
import { MotiScrollView } from 'moti';
import React from 'react';

import { FeedHeader } from '@/components/feed-screen';
import { CustomHeader } from '@/components/header';
import { LinkedAccountsBar } from '@/components/link-accounts';
import MediaPickerCard from '@/components/new-user-guide';
import RecentListings from '@/components/recent-listings';
import { SUPPORTED_MARKETPLACES } from '@/core/constants';
import { userData } from '@/core/data';
import { useImagePicker } from '@/core/hooks/image-picker';
import {
  useCameraPermission,
  usePhotoLibraryPermission,
} from '@/core/hooks/use-permissions';
import { FocusAwareStatusBar, View } from '@/ui';

export default function Feed() {
  const { requestCameraAccessIfNeeded } = useCameraPermission();
  const { requestPhotoAccessIfNeeded } = usePhotoLibraryPermission();

  const { openCamera, openGallery } = useImagePicker(
    requestCameraAccessIfNeeded,
    requestPhotoAccessIfNeeded,
  );

  return (
    <FeedHeader onCameraOpen={openCamera}>
      <View className="relative flex-1 bg-white px-4 dark:bg-gray-900">
        <MotiScrollView className="px-3" showsVerticalScrollIndicator={false}>
          <FocusAwareStatusBar />
          <CustomHeader />
          <LinkedAccountsBar
            accounts={SUPPORTED_MARKETPLACES}
            handleMarketplace={() => {
              router.push('/feed/new-marketplace');
            }}
          />

          <MediaPickerCard
            onCameraPress={openCamera}
            onGalleryPress={openGallery}
          />
          <RecentListings scans={userData.recentScans} viewAll />
        </MotiScrollView>
      </View>
    </FeedHeader>
  );
}
