import { ChevronRight, HelpCircle } from 'lucide-react-native';

import { Text, TouchableOpacity, View } from '@/ui';

export const NewUserGuide = () => (
  <View className="mb-6 rounded-xl bg-cyan-50 p-4 dark:bg-cyan-900">
    <View className="flex-row items-start">
      <View className="mr-3 size-8 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-800">
        <HelpCircle size={20} color="#0891b2" />
      </View>
      <View className="flex-1">
        <Text className="mb-1 text-base font-medium text-cyan-900 dark:text-cyan-50">
          Quick Start Guide
        </Text>
        <Text className="mb-3 text-sm text-cyan-700 dark:text-cyan-200">
          Start by scanning your first item. Just tap the camera button and
          point at your product!
        </Text>
        <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
          <Text className="mr-1 text-sm font-medium text-cyan-600 dark:text-cyan-300">
            Learn More
          </Text>
          <ChevronRight size={16} color="#0891b2" />
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
