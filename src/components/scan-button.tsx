import { Camera } from 'lucide-react-native';

import { Text, TouchableOpacity, View } from '@/ui';

export const ScanButton = ({ onPress }: { onPress: () => void }) => (
  <View className="mb-8 items-center">
    <TouchableOpacity
      className="mb-2 size-16 items-center justify-center rounded-full bg-cyan-500 shadow-lg dark:bg-cyan-600"
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Camera size={32} color="white" />
    </TouchableOpacity>
    <Text className="text-sm text-gray-600 dark:text-gray-400">
      Tap to scan item
    </Text>
  </View>
);
