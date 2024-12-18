import { Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';

import ProductPreviewScreen from '@/components/product-preview';
import { FocusAwareStatusBar, View } from '@/ui';

export default function ProductPreview() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  return (
    <View className="flex-1 p-3">
      <Stack.Screen
        options={{
          title: 'Product Preview',
          headerBackTitle: 'Scan Results',
          headerStyle: {
            backgroundColor: isDark ? '#030712' : '#f9fafb',
          },
          headerTintColor: isDark ? '#f3f4f6' : '#111827',
        }}
      />
      <FocusAwareStatusBar />
      <ProductPreviewScreen />
    </View>
  );
}
