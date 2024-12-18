import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

const DescriptionInput = ({
  value,
  onChangeText,
  placeholder,
  error,
  itemTypeLabel = 'Item',
  maxLength = 8000,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  itemTypeLabel?: string;
  maxLength?: number;
}) => {
  const [charCount, setCharCount] = useState(value.length);

  const handleChangeText = (text: string) => {
    setCharCount(text.length);
    onChangeText(text);
  };

  return (
    <View className="space-y-2">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-medium dark:text-gray-200">
          Description
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {charCount}/{maxLength}
        </Text>
      </View>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={
          placeholder || `Describe the ${itemTypeLabel.toLowerCase()}`
        }
        multiline
        textAlignVertical="top"
        maxLength={maxLength}
        className={`
          min-h-[150px] 
          rounded-lg 
          border 
          border-gray-300 
          bg-white 
          px-4 
          py-2 
          text-base 
          dark:border-gray-700 
          dark:bg-gray-800 
          dark:text-gray-100
          ${error ? 'border-red-500 dark:border-red-400' : ''}
        `}
        placeholderTextColor="#9CA3AF"
      />
      {error && (
        <Text className="text-sm text-red-500 dark:text-red-400">{error}</Text>
      )}
    </View>
  );
};

export default DescriptionInput;
