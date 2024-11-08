import { Camera, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

import { type ListingFormData } from '@/api';
import { Button } from '@/ui';

interface PricingFormProps {
  formData: ListingFormData;
  updateForm: (field: keyof ListingFormData, value: any) => void;
  errors: Record<string, string>;
}

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

const PriceInput = ({
  value,
  onChangeText,
  error,
}: {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
}) => {
  const formatPrice = (input: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = input.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleaned.split('.');
    if (parts.length > 2) return value;

    // Limit to two decimal places
    if (parts[1]?.length > 2) {
      return `${parts[0]}.${parts[1].slice(0, 2)}`;
    }

    return cleaned;
  };

  return (
    <View className="relative">
      <Text className="absolute left-4 top-3 text-gray-500 dark:text-gray-400">
        $
      </Text>
      <TextInput
        value={value}
        onChangeText={(text) => onChangeText(formatPrice(text))}
        placeholder="0.00"
        keyboardType="decimal-pad"
        className={`h-12 rounded-lg border bg-white pl-8 pr-4 text-base
          ${
            error
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-700'
          }
          dark:bg-gray-800 dark:text-gray-100`}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
};

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
      resizeMode="cover"
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
    setIsSelectingImage(true);
    try {
      // Implement image picking logic here
      // This is a placeholder URL for demonstration
      const imageUrl = '/api/placeholder/400/400';
      updateForm('pictures', [...(formData.pictures || []), imageUrl]);
    } catch (error) {
      console.error('Error selecting image:', error);
    } finally {
      setIsSelectingImage(false);
    }
  };

  const removeImage = (index: number) => {
    const newPictures = [...formData.pictures];
    newPictures.splice(index, 1);
    updateForm('pictures', newPictures);
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
            {formData.pictures?.map((url, index) => (
              <ImagePreview
                key={`${url}-${index}`}
                url={url}
                onRemove={() => removeImage(index)}
              />
            ))}

            {(formData.pictures?.length || 0) < MAX_IMAGES && (
              <Pressable
                onPress={handleImageSelect}
                className="flex size-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800"
              >
                <Camera className="mb-2 text-gray-400" />
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Add Photo
                </Text>
              </Pressable>
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
