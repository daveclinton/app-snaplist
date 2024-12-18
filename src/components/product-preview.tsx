import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView } from 'react-native';

import { type ProductResult } from '@/api/types';
import { Button, Image, Text, View } from '@/ui';

const ProductPreviewScreen = () => {
  const router = useRouter();
  const { productData } = useLocalSearchParams<{
    id: string;
    productData: string;
  }>();

  const product = React.useMemo(() => {
    if (!productData) return null;
    try {
      return JSON.parse(decodeURIComponent(productData)) as ProductResult;
    } catch (error) {
      console.error('Error parsing product data:', error);
      return null;
    }
  }, [productData]);

  const handleCreateListing = () => {
    const initialData = {
      title: product?.title,
      description: product?.description,
      price: product?.price,
      pictures: [product?.imageUrl],
      category: '',
      condition: '',
      specifics: {
        publisher: '',
        author: '',
        language: '',
      },
      shipping: {
        service: 'USPSMedia',
        cost: 2.5,
        dispatchDays: 3,
      },
      returns: {
        accepted: true,
        period: 30,
        shippingPaidBy: 'Buyer',
      },
    };

    const encodedInitialData = encodeURIComponent(JSON.stringify(initialData));

    router.push({
      pathname: '/scan/create-listing',
      params: { initialData: encodedInitialData },
    });
  };

  if (!product) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No product data found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-gray-900">
      <View className="flex-1">
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={{ uri: product.imageUrl }}
            className="h-72 w-full rounded-lg"
            transition={1000}
          />

          <View className="mt-6">
            <Text className="text-2xl font-bold dark:text-gray-100">
              {product.title}
            </Text>

            <Text className="mt-2 text-lg font-bold text-cyan-500 dark:text-cyan-400">
              {product.price}
            </Text>

            <Text className="mt-4 text-base text-gray-700 dark:text-gray-400">
              {product.description}
            </Text>

            <Text className="mt-2 text-sm text-gray-500">
              Source: {product.source}
            </Text>
          </View>
        </ScrollView>

        {/* Fixed Button at Bottom */}
        <View className="absolute inset-x-0 bottom-0 bg-white p-4 dark:bg-gray-900">
          <Button
            label="Start Listing"
            onPress={handleCreateListing}
            className="w-full"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ProductPreviewScreen;
