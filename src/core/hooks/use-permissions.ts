import { useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Linking } from 'react-native';

const openPermissionAlert = (perm: string) => {
  Alert.alert(
    'Permission needed',
    `Snaplist does not have permission to access your ${perm}.`,
    [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ],
  );
};

export function useCameraPermission() {
  const [status, requestCameraPermission] = useCameraPermissions();
  const requestCameraAccessIfNeeded = async () => {
    if (status?.granted) {
      return true;
    } else if (
      !status ||
      status?.canAskAgain ||
      status?.status === 'undetermined'
    ) {
      const updateResponse = await requestCameraPermission();
      return updateResponse?.granted;
    } else {
      openPermissionAlert('camera');
      return false;
    }
  };
  return { requestCameraAccessIfNeeded };
}

export function usePhotoLibraryPermission() {
  const [permissionResponse, mediaLibraryPermission] =
    MediaLibrary.usePermissions({ granularPermissions: ['photo'] });

  const requestPhotoAccessIfNeeded = async () => {
    if (permissionResponse?.granted) {
      return true;
    } else if (
      !permissionResponse ||
      permissionResponse.status === 'undetermined' ||
      permissionResponse.canAskAgain
    ) {
      const { canAskAgain, granted, status } = await mediaLibraryPermission();
      if (!canAskAgain && status === 'undetermined') {
        openPermissionAlert('photo library');
      }
      return granted;
    } else {
      openPermissionAlert('photo library');
      return false;
    }
  };
  return { requestPhotoAccessIfNeeded };
}
