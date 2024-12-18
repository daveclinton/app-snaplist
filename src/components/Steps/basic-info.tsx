import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { type ListingFormData } from '@/api';
import { type OptionType, Select } from '@/ui/select';

import DescriptionInput from '../description-input';

interface BasicInfoFormProps {
  formData: ListingFormData;
  updateForm: (field: keyof ListingFormData, value: string | number) => void;
  errors: Record<string, string>;
  categories: OptionType[];
  itemTypeLabel?: string;
}

const CONDITIONS: OptionType[] = [
  { value: '1', label: 'New' },
  { value: '2', label: 'Like New' },
  { value: '3', label: 'Very Good' },
  { value: '4', label: 'Good' },
  { value: '5', label: 'Acceptable' },
] as const;

const FormField = ({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) => (
  <View className="space-y-2">
    <Text className="text-base font-medium dark:text-gray-200">{label}</Text>
    {children}
    {error && (
      <Text className="text-sm text-red-500 dark:text-red-400">{error}</Text>
    )}
  </View>
);

const StyledTextInput = ({
  multiline = false,
  ...props
}: React.ComponentProps<typeof TextInput>) => (
  <TextInput
    className={`rounded-lg border border-gray-300 bg-white px-4 py-2 text-base dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 ${
      multiline ? 'min-h-[100px]' : 'h-12'
    }`}
    placeholderTextColor="#9CA3AF"
    {...props}
  />
);

export default function BasicInfoForm({
  formData,
  updateForm,
  errors,
  categories,
  itemTypeLabel = 'Item',
}: BasicInfoFormProps) {
  const handleUpdate =
    (field: keyof ListingFormData) => (value: string | number) => {
      updateForm(field, value as string);
    };

  return (
    <View className="space-y-6 p-4">
      <FormField label={`${itemTypeLabel} Title`} error={errors.title}>
        <StyledTextInput
          value={formData.title}
          onChangeText={handleUpdate('title')}
          placeholder={`Enter the ${itemTypeLabel.toLowerCase()} title`}
          maxLength={80}
        />
      </FormField>

      <FormField label="" error={errors.description}>
        <DescriptionInput
          value={formData.description}
          onChangeText={handleUpdate('description')}
          error={errors.description}
          itemTypeLabel={itemTypeLabel}
        />
      </FormField>

      <FormField label="Category" error={errors.category}>
        <Select
          value={formData.categoryId}
          onSelect={(value: string | number) => {
            const selectedCategory = categories.find(
              (category) => category.value === value,
            );
            if (selectedCategory) {
              updateForm('categoryId', selectedCategory.value);
              updateForm('categoryName', selectedCategory.label);
            }
          }}
          options={categories}
          placeholder={`Select ${itemTypeLabel.toLowerCase()} category`}
          error={errors.category}
        />
      </FormField>

      <FormField label="Condition" error={errors.condition}>
        <Select
          value={formData.condition}
          onSelect={handleUpdate('condition')}
          options={CONDITIONS}
          placeholder={`Select ${itemTypeLabel.toLowerCase()} condition`}
          error={errors.condition}
        />
      </FormField>
    </View>
  );
}
