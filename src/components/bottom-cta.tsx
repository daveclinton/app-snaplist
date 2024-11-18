import { Button, Text, View } from '@/ui';

type BottomCTAProps = {
  connectedCount: number;
  onContinue: () => void;
  loading: boolean;
};

export const BottomCTA = ({
  connectedCount,
  onContinue,
  loading,
}: BottomCTAProps) => {
  if (connectedCount === 0) return null;
  return (
    <View className="absolute inset-x-0 bottom-0 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-2 size-4 rounded-full bg-green-500" />
          <Text className="text-sm text-gray-600 dark:text-gray-300">
            {connectedCount} marketplace{connectedCount > 1 ? 's' : ''} ready
          </Text>
        </View>
      </View>

      <Button
        label="Start Creating Listings"
        loading={loading}
        onPress={onContinue}
      />
    </View>
  );
};
