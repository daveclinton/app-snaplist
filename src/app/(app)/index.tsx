import { router } from 'expo-router';
import { MotiScrollView } from 'moti';
import React from 'react';

import { useCreateUser } from '@/api/user';
import { FeedHeader } from '@/components/feed-screen';
import { CustomHeader } from '@/components/header';
import { LinkedAccountsBar } from '@/components/link-accounts';
import MediaPickerCard from '@/components/new-user-guide';
import RecentListings from '@/components/recent-listings';
import { show as showToast } from '@/components/toast';
import { getUserSessionId } from '@/core/auth/utils';
import { SUPPORTED_MARKETPLACES } from '@/core/constants';
import { userData } from '@/core/data';
import { useImagePicker } from '@/core/hooks/image-picker';
import {
  useCameraPermission,
  usePhotoLibraryPermission,
} from '@/core/hooks/use-permissions';
import { useInitiated } from '@/core/hooks/user-initiated';
import { FocusAwareStatusBar, View } from '@/ui';

const useMarketplaceConnection = () => {
  const [isInitiated, setIsInitated] = useInitiated();
  const { mutate: addUser, isPending } = useCreateUser({
    onSuccess: () => {
      showToast('Marketplace initiated successfully', 'success');
      router.push('/feed/new-marketplace');
      setIsInitated(true);
    },
    onError: (error) => {
      if (error.response?.status === 409) {
        router.push('/feed/new-marketplace');
        return;
      }
      showToast('Error adding user instance', 'error');
    },
  });

  const handleCreateUser = async () => {
    if (isInitiated) {
      return router.push('/feed/new-marketplace');
    }
    try {
      const supabaseSessionId = await getUserSessionId();
      await addUser({ supabase_user_id: supabaseSessionId });
    } catch (error) {
      console.error('Error creating user:', error);
      showToast('Failed to connect marketplace', 'error');
    }
  };

  return { handleCreateUser, isPending };
};

export default function Feed() {
  const { requestCameraAccessIfNeeded } = useCameraPermission();
  const { requestPhotoAccessIfNeeded } = usePhotoLibraryPermission();
  const { handleCreateUser, isPending } = useMarketplaceConnection();
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
            handleMarketplace={handleCreateUser}
            isLoading={isPending}
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
