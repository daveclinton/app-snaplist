import { router } from 'expo-router';
import { MotiScrollView } from 'moti';
import React, { useCallback } from 'react';
import { Alert, Linking } from 'react-native';

import { useCreateUser } from '@/api/user';
import { FeedHeader } from '@/components/feed-screen';
import { CustomHeader } from '@/components/header';
import { LinkedAccountsBar } from '@/components/link-accounts';
import { NewUserGuide } from '@/components/new-user-guide';
import RecentListings from '@/components/recent-listings';
import { ScanButton } from '@/components/scan-button';
import { show as showToast } from '@/components/toast';
import { getUserSessionId } from '@/core/auth/utils';
import { SUPPORTED_MARKETPLACES } from '@/core/constants';
import { userData } from '@/core/data';
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
  const isNewUser = true;
  const { requestCameraAccessIfNeeded } = useCameraPermission();
  const { requestPhotoAccessIfNeeded } = usePhotoLibraryPermission();
  const { handleCreateUser, isPending } = useMarketplaceConnection();

  const onPressTakePicture = useCallback(async () => {
    console.log('Here');
    try {
      if (!(await requestCameraAccessIfNeeded())) {
        return;
      }
      if (!(await requestPhotoAccessIfNeeded())) {
        return;
      }
      await router.push('/scan/scan');
    } catch (err) {
      Alert.alert(
        'Permissions needed',
        'Snaplist needs camera and photo access to continue',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
  }, [requestCameraAccessIfNeeded, requestPhotoAccessIfNeeded]);

  return (
    <FeedHeader onCameraOpen={onPressTakePicture}>
      <View className="relative flex-1 bg-white px-4 dark:bg-gray-900">
        <MotiScrollView className="px-3" showsVerticalScrollIndicator={false}>
          <FocusAwareStatusBar />
          <CustomHeader />
          <LinkedAccountsBar
            accounts={SUPPORTED_MARKETPLACES}
            handleMarketplace={handleCreateUser}
            isLoading={isPending}
          />

          {isNewUser && <NewUserGuide />}
          <ScanButton onPress={onPressTakePicture} />
          <RecentListings scans={userData.recentScans} viewAll />
        </MotiScrollView>
      </View>
    </FeedHeader>
  );
}
