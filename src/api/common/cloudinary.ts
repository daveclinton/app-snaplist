// utils/cloudinary.ts
import { Platform } from 'react-native';

export const uploadToCloudinary = async (imageUri: string): Promise<string> => {
  // On iOS, we need to remove the 'file://' prefix
  const normalizedUri =
    Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

  const formData = new FormData();
  formData.append('file', {
    uri: normalizedUri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  formData.append('upload_preset', 'listing');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dazawvf2g/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};
