import { Platform } from 'react-native';

export const uploadToCloudinary = async (
  imageUri: string,
  uploadPreset: string,
  cloudName: string,
): Promise<string> => {
  if (!imageUri || !uploadPreset || !cloudName) {
    throw new Error('Missing required upload parameters');
  }

  const normalizedUri =
    Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

  const formData = new FormData();
  formData.append('file', {
    uri: normalizedUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  formData.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Upload failed: ${errorData}`);
    }

    const data = await response.json();
    if (!data.secure_url) {
      throw new Error('No secure_url in response');
    }

    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
