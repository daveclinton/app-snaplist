import { router, Stack, useLocalSearchParams } from 'expo-router';
import { MotiImage, MotiView } from 'moti';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  type ListRenderItem,
  Pressable,
} from 'react-native';

import { FocusAwareStatusBar, Image, Text, View } from '@/ui';

interface ProductResult {
  id: string;
  title: string;
  price: string;
  imageUrl: string;
  description: string;
  source: string;
}

// Extracted animation constants
const FADE_ANIMATION = {
  from: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { type: 'timing', duration: 300 },
} as const;

const SLIDE_ANIMATION = {
  from: { opacity: 0, translateY: 20 },
  animate: { opacity: 1, translateY: 0 },
  transition: { type: 'timing', duration: 300 },
} as const;

const LoadingState = ({ message }: { message: string }) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <MotiView className="mb-8 items-center" {...FADE_ANIMATION}>
      <View className="mb-4 size-16 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900">
        <ActivityIndicator
          size="large"
          color={isDark ? '#22d3ee' : '#0891b2'}
        />
      </View>
      <Text className="text-lg font-medium text-gray-600 dark:text-gray-300">
        {message}
      </Text>
    </MotiView>
  );
};

const ProductCard: React.FC<{
  item: ProductResult;
  index: number;
  imageSize: number;
}> = ({ item, index, imageSize }) => {
  // Function to safely encode product data
  const handleProductPress = () => {
    const encodedProduct = encodeURIComponent(
      JSON.stringify({
        id: item.id,
        title: item.title,
        price: item.price,
        imageUrl: item.imageUrl,
        description: item.description,
        source: item.source,
      }),
    );

    router.push({
      pathname: '/feed/[id]',
      params: {
        id: item.id,
        productData: encodedProduct,
      },
    });
  };

  return (
    <MotiView
      className="mb-4"
      {...SLIDE_ANIMATION}
      transition={{
        ...SLIDE_ANIMATION.transition,
        delay: index * 100,
      }}
    >
      <Pressable
        className="overflow-hidden rounded-lg bg-white p-4 shadow-md dark:bg-gray-900"
        onPress={handleProductPress}
      >
        <Image
          source={{ uri: item.imageUrl }}
          style={{
            width: imageSize - 16,
            height: imageSize - 16,
          }}
          contentFit="cover"
          transition={1000}
        />
        <Text className="text-sm" numberOfLines={2}>
          {item.source}
        </Text>
        <Text className="text-lg" numberOfLines={2}>
          {item.title}
        </Text>
        <Text className="text-lg text-primary-900">{item.price}</Text>
      </Pressable>
    </MotiView>
  );
};

export default function ScanResults() {
  const local = useLocalSearchParams<{ id: string }>();
  const decodedUri = local.id ? decodeURIComponent(local.id) : '';
  const [isUploading, setIsUploading] = React.useState(true);
  const [isSearching, setIsSearching] = React.useState(false);
  const [products, setProducts] = React.useState<ProductResult[]>([]);

  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const windowWidth = Dimensions.get('window').width;
  const imageSize = (windowWidth - 48) / 2;

  // Simulate upload and search progress with custom hook
  React.useEffect(() => {
    const uploadTimer = setTimeout(() => {
      setIsUploading(false);
      setIsSearching(true);

      const searchTimer = setTimeout(() => {
        setIsSearching(false);
        setProducts([
          {
            id: '1',
            title: 'Wireless Headphones',
            price: '$59.99',
            imageUrl: 'https://picsum.photos/700',
            description:
              'High-quality wireless headphones with noise cancellation.',
            source: 'Amazon.com',
          },
          // ... other products
        ]);
      }, 2000);

      return () => clearTimeout(searchTimer);
    }, 2000);

    return () => clearTimeout(uploadTimer);
  }, []);

  const renderItem: ListRenderItem<ProductResult> = ({ item, index }) => (
    <ProductCard item={item} index={index} imageSize={imageSize} />
  );

  const ListHeader = () => (
    <>
      <View className="mb-6 overflow-hidden rounded-lg bg-white shadow-lg dark:bg-gray-900">
        {decodedUri ? (
          <MotiView className="items-center" {...SLIDE_ANIMATION}>
            <MotiImage
              source={{ uri: decodedUri }}
              className="rounded-lg"
              style={{ width: '100%', height: 200 }}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 300 }}
            />
          </MotiView>
        ) : (
          <View className="h-48 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
            <Text className="text-gray-500 dark:text-gray-400">
              No image found
            </Text>
          </View>
        )}
      </View>

      {isUploading && <LoadingState message="Processing your image..." />}
      {!isUploading && isSearching && (
        <LoadingState message="Finding similar products..." />
      )}

      {!isUploading && !isSearching && products.length > 0 && (
        <Text className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
          Similar Products
        </Text>
      )}
    </>
  );

  const EmptyComponent = () =>
    !isUploading &&
    !isSearching && (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-lg text-gray-500 dark:text-gray-400">
          No matching products found
        </Text>
      </View>
    );

  return (
    <View className={`flex-1 ${isDark ? 'bg-gray-950' : 'bg-gray-50'}`}>
      <Stack.Screen
        options={{
          title: 'Scan Results',
          headerBackTitle: 'Feed',
          headerStyle: {
            backgroundColor: isDark ? '#030712' : '#f9fafb',
          },
          headerTintColor: isDark ? '#f3f4f6' : '#111827',
        }}
      />
      <FocusAwareStatusBar />

      <FlatList
        data={!isUploading && !isSearching ? products : []}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={EmptyComponent}
        renderItem={renderItem}
      />
    </View>
  );
}
