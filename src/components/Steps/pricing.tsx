import {
  type ImagePickerOptions,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from 'expo-image-picker';
import { Camera, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import * as ImagePicker from 'react-native-image-crop-picker';

import { type ListingFormData } from '@/api';
import { uploadToCloudinary } from '@/api/common/cloudinary';
import { Button, Image, Text, View } from '@/ui';
import PriceInput from '@/ui/price-input';

const CLOUDINARY_UPLOAD_PRESET = 'listing';
const CLOUDINARY_CLOUD_NAME = 'dazawvf2g';

interface PricingFormProps {
  formData: ListingFormData;
  updateForm: (field: keyof ListingFormData, value: any) => void;
  errors: Record<string, string>;
}

const blurhash =
  '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

const FormField = ({
  label,
  error,
  children,
  helperText,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  helperText?: string;
}) => (
  <View className="space-y-2">
    <Text className="text-base font-medium dark:text-gray-200">{label}</Text>
    {children}
    {helperText && (
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        {helperText}
      </Text>
    )}
    {error && (
      <Text className="text-sm text-red-500 dark:text-red-400">{error}</Text>
    )}
  </View>
);

const ImagePreview = ({
  url,
  onRemove,
}: {
  url: string;
  onRemove: () => void;
}) => (
  <View className="relative">
    <Image
      source={{ uri: url }}
      className="size-32 rounded-lg"
      transition={1000}
      contentFit="cover"
      placeholder={{ blurhash }}
      cachePolicy="disk"
    />
    <Pressable
      onPress={onRemove}
      className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1"
    >
      <X size={16} color="white" />
    </Pressable>
  </View>
);

export default function PricingForm({
  formData,
  updateForm,
  errors,
}: PricingFormProps) {
  const [isSelectingImage, setIsSelectingImage] = useState(false);

  const handleImageSelect = async () => {
    if (isSelectingImage) return;

    setIsSelectingImage(true);
    try {
      const pickerOptions: ImagePickerOptions = {
        mediaTypes: MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      const result = await launchImageLibraryAsync(pickerOptions);

      if (result.canceled) {
        setIsSelectingImage(false);
        return;
      }

      const selectedImage = result.assets[0];

      let croppedImage;
      try {
        croppedImage = await ImagePicker.openCropper({
          path: selectedImage.uri,
          width: 800,
          height: 800,
          cropperCircleOverlay: false,
          cropping: true,
          compressImageQuality: 0.8,
          mediaType: 'photo',
        });
      } catch (cropError) {
        console.error('Error cropping:', cropError);
        setIsSelectingImage(false);
        return;
      }

      try {
        const cloudinaryUrl = await uploadToCloudinary(
          croppedImage.path,
          CLOUDINARY_UPLOAD_PRESET,
          CLOUDINARY_CLOUD_NAME,
        );

        if (!cloudinaryUrl) {
          throw new Error('No URL returned from Cloudinary');
        }

        updateForm('images', [...(formData.images || []), cloudinaryUrl]);
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        Alert.alert(
          'Upload Failed',
          'Failed to upload image. Please try again.',
        );
      }
    } catch (error) {
      console.error('Selection error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsSelectingImage(false);
    }
  };

  const handleCameraCapture = async () => {
    if (isSelectingImage) return;

    setIsSelectingImage(true);
    try {
      const image = await ImagePicker.openCamera({
        width: 800,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
      });

      try {
        const cloudinaryUrl = await uploadToCloudinary(
          image.path,
          CLOUDINARY_UPLOAD_PRESET,
          CLOUDINARY_CLOUD_NAME,
        );

        if (!cloudinaryUrl) {
          throw new Error('No URL returned from Cloudinary');
        }

        updateForm('images', [...(formData.images || []), cloudinaryUrl]);
      } catch (uploadError) {
        console.error('Upload error:', uploadError);
        Alert.alert(
          'Upload Failed',
          'Failed to upload image. Please try again.',
        );
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsSelectingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const newPictures = [...(formData.images || [])];
    newPictures.splice(index, 1);
    updateForm('images', newPictures);
  };

  const MAX_IMAGES = 12;

  return (
    <View className="space-y-6 p-4">
      <FormField
        label="Price"
        error={errors.price}
        helperText="Set a competitive price based on the book's condition and market value"
      >
        <PriceInput
          value={formData.price?.toString() || ''}
          onChangeText={(value) => updateForm('price', value)}
          error={errors.price}
        />
      </FormField>

      <FormField
        label="Pictures"
        error={errors.pictures}
        helperText={`Add up to ${MAX_IMAGES} clear photos of your book (front, back, spine, and any notable features)`}
      >
        <View className="space-y-4">
          <View className="flex-row flex-wrap gap-4">
            {formData.images?.map((url, index) => (
              <ImagePreview
                key={`${url}-${index}`}
                url={url}
                onRemove={() => removeImage(index)}
              />
            ))}

            {(formData.images?.length || 0) < MAX_IMAGES && (
              <View className="flex-row gap-2">
                <Pressable
                  onPress={handleImageSelect}
                  className="flex size-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                >
                  <Camera className="mb-2 text-gray-400" />
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Gallery
                  </Text>
                </Pressable>

                <Pressable
                  onPress={handleCameraCapture}
                  className="flex size-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
                >
                  <Camera className="mb-2 text-gray-400" />
                  <Text className="text-sm text-gray-500 dark:text-gray-400">
                    Camera
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {isSelectingImage && (
            <Button
              variant="secondary"
              label="Selecting..."
              loading={true}
              disabled={true}
            />
          )}
        </View>
      </FormField>
    </View>
  );
}
