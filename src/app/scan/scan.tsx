import { type CameraCapturedPicture } from 'expo-camera';
import { router, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';

import FullScreenCamera from '@/components/Camera/full-camera';
import { View } from '@/ui';

export default function ScanProduct() {
  const { colorScheme } = useColorScheme();

  const handlePhotoCapture = async (
    photo: CameraCapturedPicture | undefined,
  ) => {
    try {
      console.log('Photo captured:', photo!.uri);
      if (!photo?.uri) {
        console.error('Invalid media URI');
        return;
      }
      const encodedUri = encodeURIComponent(photo.uri);
      await router.push(`/scan/${encodedUri}`);
    } catch (error) {
      console.error('Error handling photo capture:', error);
    }
  };

  const handleMediaSelect = async (media: { uri: string | undefined }) => {
    try {
      if (!media?.uri) {
        console.error('Invalid media URI');
        return;
      }
      const encodedUri = encodeURIComponent(media.uri);
      await router.push(`/scan/${encodedUri}`);
    } catch (error) {
      console.error('Error handling media select:', error);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colorScheme === 'dark' ? '#111827' : '#ffffff',
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <FullScreenCamera
        onClose={() => router.back()}
        onPhotoCapture={handlePhotoCapture}
        onMediaSelect={handleMediaSelect}
      />
    </View>
  );
}
