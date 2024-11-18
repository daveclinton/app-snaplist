import { router } from 'expo-router';
import { ArrowBigLeftIcon, Camera } from 'lucide-react-native';
import React from 'react';
import { TextInput } from 'react-native';

import { Pressable, View } from '@/ui';

export default function SearchComponent() {
  return (
    <View className="w-full max-w-3xl bg-white p-4">
      <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
        <Pressable
          onPress={() => {
            router.back();
          }}
          accessibilityLabel="Go back"
        >
          <ArrowBigLeftIcon width={20} height={20} color="#0891b2" />
        </Pressable>

        <TextInput
          placeholder="Search on Snaplist"
          placeholderTextColor="#6b7280"
          className="mx-2 flex-1 text-gray-800"
        />
        <View className="flex-row gap-2">
          <Pressable
            onPress={() => {
              router.push('/scan/scan');
            }}
            className="p-2"
            accessibilityLabel="Image search"
          >
            <Camera width={20} height={20} color="#0891b2" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
