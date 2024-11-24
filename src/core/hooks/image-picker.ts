import { router } from 'expo-router';
import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'react-native-image-crop-picker';

type ImagePickerError = {
  code: string;
  message: string;
};

const IMAGE_CONFIG = {
  width: 1200,
  height: 1200,
  cropping: true,
  mediaType: 'photo' as const,
  compressImageQuality: 0.8,
};

const handleError = (error: unknown) => {
  const isImagePickerError = (err: unknown): err is ImagePickerError => {
    return typeof err === 'object' && err !== null && 'code' in err;
  };

  if (isImagePickerError(error) && error.code !== 'E_PICKER_CANCELLED') {
    Alert.alert(
      'Permissions needed',
      'Snaplist needs camera and photo access to continue',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Settings', onPress: () => Linking.openSettings() },
      ],
    );
  }
};

const handleImageSelection = async (image: ImagePicker.Image) => {
  const encodedUri = await encodeURIComponent(image.path);
  await router.push(`/scan/${encodedUri}`);
};

export const useImagePicker = (
  requestCameraPermission: () => Promise<boolean>,
  requestPhotoPermission: () => Promise<boolean>,
) => {
  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const image = await ImagePicker.openCamera(IMAGE_CONFIG);
      handleImageSelection(image);
    } catch (error) {
      handleError(error);
    }
  };

  const openGallery = async () => {
    const hasPermission = await requestPhotoPermission();
    if (!hasPermission) return;

    try {
      const image = await ImagePicker.openPicker(IMAGE_CONFIG);
      handleImageSelection(image);
    } catch (error) {
      handleError(error);
    }
  };

  return {
    openCamera,
    openGallery,
  };
};
