import React, { useMemo } from 'react';
import { Text, TextInput, View } from 'react-native';

import { type SpecificsFormProps } from '@/api';
import { type OptionType, Select } from '@/ui/select';

const MANUFACTURERS: OptionType[] = [
  { value: 'sony', label: 'Sony' },
  { value: 'samsung', label: 'Samsung' },
  { value: 'apple', label: 'Apple' },
  { value: 'microsoft', label: 'Microsoft' },
  { value: 'other', label: 'Other' },
] as const;

const CATEGORIES: OptionType[] = [
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'toys', label: 'Toys' },
  { value: 'other', label: 'Other' },
] as const;

const FormField = ({
  label,
  error,
  children,
  helperText,
  required = false,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  helperText?: string;
  required?: boolean;
}) => (
  <View className="space-y-2">
    <View className="flex-row items-center space-x-1">
      <Text className="text-base font-medium dark:text-gray-200">{label}</Text>
      {required && <Text className="text-red-500">*</Text>}
    </View>
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

const StyledTextInput = ({
  error,
  ...props
}: React.ComponentProps<typeof TextInput> & { error?: string }) => (
  <TextInput
    className={`h-12 rounded-lg border bg-white px-4 text-base
      ${
        error
          ? 'border-red-500 dark:border-red-400'
          : 'border-gray-300 dark:border-gray-700'
      }
      dark:bg-gray-800 dark:text-gray-100`}
    placeholderTextColor="#9CA3AF"
    {...props}
  />
);

export default function SpecificsForm({
  formData,
  updateNestedForm,
  errors,
}: SpecificsFormProps) {
  const handleUpdate = (field: string) => (value: string | number) => {
    updateNestedForm('specifics', field, value as string);
  };

  const showCustomManufacturer = useMemo(() => {
    return (
      formData.specifics?.manufacturer === 'other' ||
      !MANUFACTURERS.some((m) => m.value === formData.specifics?.manufacturer)
    );
  }, [formData.specifics?.manufacturer]);

  const showCustomCategory = useMemo(() => {
    return (
      formData.specifics?.category === 'other' ||
      !CATEGORIES.some((c) => c.value === formData.specifics?.category)
    );
  }, [formData.specifics?.category]);

  return (
    <View className="space-y-6 p-4">
      <FormField
        label="Manufacturer"
        error={errors.manufacturer}
        helperText="Select from common manufacturers or enter a custom one"
        required
      >
        <View className="space-y-2">
          <Select
            value={formData.specifics?.manufacturer}
            onSelect={handleUpdate('manufacturer')}
            options={MANUFACTURERS}
            placeholder="Select manufacturer"
            error={errors.manufacturer}
          />
          {showCustomManufacturer && (
            <StyledTextInput
              value={formData.specifics?.manufacturer || ''}
              onChangeText={handleUpdate('manufacturerCustom')}
              placeholder="Enter custom manufacturer"
              error={errors.manufacturerCustom}
            />
          )}
        </View>
      </FormField>

      <FormField
        label="Product Name"
        error={errors.productName}
        helperText="Enter the name of the product"
        required
      >
        <StyledTextInput
          value={formData.specifics?.productName}
          onChangeText={handleUpdate('productName')}
          placeholder="Enter product name"
          error={errors.productName}
        />
      </FormField>

      <FormField
        label="Category"
        error={errors.category}
        helperText="Select the product category"
        required
      >
        <View className="space-y-2">
          <Select
            value={formData.specifics?.category}
            onSelect={handleUpdate('category')}
            options={CATEGORIES}
            placeholder="Select category"
            error={errors.category}
          />
          {showCustomCategory && (
            <StyledTextInput
              value={formData.specifics?.category || ''}
              onChangeText={handleUpdate('categoryCustom')}
              placeholder="Enter custom category"
              error={errors.categoryCustom}
            />
          )}
        </View>
      </FormField>
    </View>
  );
}
