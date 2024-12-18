import React, { useMemo } from 'react';
import { Text, TextInput, View } from 'react-native';

import { type SpecificsFormProps } from '@/api';
import { type OptionType, Select } from '@/ui/select';

const PUBLISHERS: OptionType[] = [
  { value: 'penguin', label: 'Penguin Random House' },
  { value: 'hachette', label: 'Hachette Book Group' },
  { value: 'harpercollins', label: 'HarperCollins' },
  { value: 'macmillan', label: 'Macmillan Publishers' },
  { value: 'simon', label: 'Simon & Schuster' },
  { value: 'other', label: 'Other' },
] as const;

const LANGUAGES: OptionType[] = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
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

  const showCustomPublisher = useMemo(() => {
    return (
      formData.specifics?.publisher === 'other' ||
      !PUBLISHERS.some((p) => p.value === formData.specifics?.publisher)
    );
  }, [formData.specifics?.publisher]);

  const showCustomLanguage = useMemo(() => {
    return (
      formData.specifics?.language === 'other' ||
      !LANGUAGES.some((l) => l.value === formData.specifics?.language)
    );
  }, [formData.specifics?.language]);

  return (
    <View className="space-y-6 p-4">
      <FormField
        label="Publisher"
        error={errors.publisher}
        helperText="Select from common publishers or enter a custom one"
        required
      >
        <View className="space-y-2">
          <Select
            value={formData.specifics?.publisher}
            onSelect={handleUpdate('publisher')}
            options={PUBLISHERS}
            placeholder="Select publisher"
            error={errors.publisher}
          />
          {showCustomPublisher && (
            <StyledTextInput
              value={formData.specifics?.publisher || ''}
              onChangeText={handleUpdate('publisherCustom')}
              placeholder="Enter custom publisher"
              error={errors.publisherCustom}
            />
          )}
        </View>
      </FormField>

      <FormField
        label="Author"
        error={errors.author}
        helperText="Enter the full name of the book's author(s)"
        required
      >
        <StyledTextInput
          value={formData.specifics?.author}
          onChangeText={handleUpdate('author')}
          placeholder="Enter author name"
          error={errors.author}
          autoCapitalize="words"
        />
      </FormField>

      <FormField
        label="Language"
        error={errors.language}
        helperText="Select the primary language of the book"
        required
      >
        <View className="space-y-2">
          <Select
            value={formData.specifics?.language}
            onSelect={handleUpdate('language')}
            options={LANGUAGES}
            placeholder="Select language"
            error={errors.language}
          />
          {showCustomLanguage && (
            <StyledTextInput
              value={formData.specifics?.language || ''}
              onChangeText={handleUpdate('languageCustom')}
              placeholder="Enter custom language"
              error={errors.languageCustom}
              autoCapitalize="words"
            />
          )}
        </View>
      </FormField>
    </View>
  );
}
