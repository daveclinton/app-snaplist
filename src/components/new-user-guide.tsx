import { Camera, Image as ImageIcon } from 'lucide-react-native';

import { Text, TouchableOpacity, View } from '@/ui';

interface MediaPickerCardProps {
  onCameraPress: () => void;
  onGalleryPress: () => void;
}

const MediaPickerCard: React.FC<MediaPickerCardProps> = ({
  onCameraPress,
  onGalleryPress,
}: MediaPickerCardProps) => {
  return (
    <View className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800">
      <Text className="mb-2 text-center text-xl font-semibold text-cyan-950 dark:text-white">
        Scan Your Item
      </Text>
      <Text className="mb-6 text-center text-base text-cyan-700 dark:text-slate-300">
        Take a photo or choose from your gallery to instantly identify and
        catalog your item
      </Text>

      <View className="flex-row items-center justify-center space-x-8">
        <View className="items-center">
          <TouchableOpacity
            className="mb-2 mr-4 flex items-center justify-center rounded-full bg-cyan-100 p-4 dark:bg-cyan-900"
            activeOpacity={0.7}
            onPress={onCameraPress}
          >
            <Camera className="text-cyan-600 dark:text-cyan-200" size={24} />
          </TouchableOpacity>
          <Text className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Camera
          </Text>
        </View>

        <View className="items-center">
          <TouchableOpacity
            className="mb-2 flex items-center justify-center rounded-full bg-cyan-100 p-4 dark:bg-cyan-900"
            activeOpacity={0.7}
            onPress={onGalleryPress}
          >
            <ImageIcon className="text-cyan-600 dark:text-cyan-200" size={24} />
          </TouchableOpacity>
          <Text className="text-sm font-medium text-cyan-700 dark:text-cyan-300">
            Gallery
          </Text>
        </View>
      </View>
    </View>
  );
};

export default MediaPickerCard;
