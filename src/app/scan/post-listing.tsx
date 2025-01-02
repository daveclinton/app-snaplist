/* eslint-disable max-lines-per-function */
import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { getUserSessionIdTwo } from '@/api/common/auth';
import { useAddProduct } from '@/api/products/use-add-product';

type ListingStatus = 'draft' | 'pending' | 'listed';

export default function ProductListingPage() {
  const [status, setStatus] = useState<ListingStatus>('draft');
  const [isLoading, setIsLoading] = useState(false);
  const [userSupabaseId, setUserSupabaseId] = useState<string | null>(null);

  const { initialData } = useLocalSearchParams<{ initialData: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const parsedData = React.useMemo(() => {
    return initialData
      ? JSON.parse(decodeURIComponent(initialData))
      : {
          title: 'Red I Note 15 pro',
          description: 'Redmi 12, 16 inches, 255GB',
          price: 1000,
          categories: ['Phones', 'Smartphones'],
          images: [
            'https://res.cloudinary.com/dazawvf2g/image/upload/v1735813324/kwsnijjzeuvc7wcuejbn.jpg',
          ],
          stock_quantity: 10,
          condition: 'new',
          discount_percentage: 10,
          tags: ['Phones', 'Smart'],
          shipping: {
            cost: 2.5,
            dispatchDays: 3,
            service: 'USPSMedia',
          },
          returns: {
            accepted: true,
            period: 10,
            shippingPaidBy: 'Buyer',
          },
        };
  }, [initialData]);

  // Log parsedData for debugging
  useEffect(() => {
    console.log('Parsed Data:', parsedData);
  }, [parsedData]);

  const { mutateAsync: addProduct } = useAddProduct();

  // Fetch the user session ID
  useEffect(() => {
    const fetchSessionId = async () => {
      const sessionId = await getUserSessionIdTwo();
      setUserSupabaseId(sessionId);
    };
    fetchSessionId();
  }, []);

  const postProduct = async () => {
    if (!userSupabaseId) {
      Alert.alert('Error', 'User session ID is missing. Please try again.');
      return;
    }

    try {
      const productData = {
        title: parsedData?.title,
        description: parsedData?.description,
        price: parsedData?.price,
        categories: [parsedData?.categoryId, parsedData?.categoryName],
        images: parsedData?.images,
        stock_quantity: parsedData?.shipping?.stock_quantity,
        condition: 'new',
        discount_percentage: parsedData?.shipping?.discount_percentage,
        tags: parsedData?.shipping.tags,
        userId: userSupabaseId,
      };

      console.log('Posting product:', productData);
      await addProduct(productData);
      setStatus('pending');
    } catch (error) {
      console.error('Error posting product:', error);
      Alert.alert('Error', 'Failed to post product. Please try again.');
      setStatus('draft');
    }
  };

  const listProductOnMarketplaces = async () => {
    try {
      // List on eBay
      const ebayResponse = await fetch('/listings/ebay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!ebayResponse.ok) {
        throw new Error('Failed to list on eBay');
      }

      // List on Facebook Marketplace
      const facebookResponse = await fetch('/listings/facebook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedData),
      });

      if (!facebookResponse.ok) {
        throw new Error('Failed to list on Facebook Marketplace');
      }

      setStatus('listed');
    } catch (error) {
      console.error('Error listing product:', error);
      Alert.alert('Error', 'Failed to list product. Please try again.');
      setStatus('pending');
    }
  };

  const handleStatusChange = async () => {
    setIsLoading(true);

    try {
      if (status === 'draft') {
        await postProduct();
      } else if (status === 'pending') {
        await listProductOnMarketplaces();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'draft':
        return 'Post';
      case 'pending':
        return 'List on Marketplaces';
      case 'listed':
        return 'Listed';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-500';
      case 'pending':
        return 'bg-blue-500';
      case 'listed':
        return 'bg-green-500';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <Stack.Screen
        options={{
          title: 'Post Product',
          headerBackTitle: 'Create Listing',
          headerStyle: {
            backgroundColor: isDark ? '#030712' : '#f9fafb',
          },
          headerTintColor: isDark ? '#f3f4f6' : '#111827',
        }}
      />
      <View className="p-4">
        <View className="mb-4 flex-row items-center justify-between">
          <View className={`rounded-full px-3 py-1 ${getStatusColor()}`}>
            <Text className="font-medium capitalize text-white">{status}</Text>
          </View>
          <Pressable
            onPress={handleStatusChange}
            disabled={isLoading || status === 'listed'}
            className={`rounded-lg px-6 py-3 ${
              isLoading || status === 'listed' ? 'bg-gray-300' : 'bg-cyan-500'
            }`}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="font-medium text-white">{getButtonText()}</Text>
            )}
          </Pressable>
        </View>

        {/* Images */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {parsedData?.images?.length > 0 ? (
            parsedData.images.map((url: string, index: number) => (
              <Image
                key={index}
                source={url}
                className="mr-2 size-72 rounded-lg"
                contentFit="cover"
                transition={1000}
              />
            ))
          ) : (
            <Text className="text-gray-500">No images available</Text>
          )}
        </ScrollView>

        {/* Title and Price */}
        <Text className="mb-2 text-2xl font-bold">
          {parsedData?.title || 'No title available'}
        </Text>
        <Text className="mb-4 text-xl font-semibold text-cyan-600">
          ${parsedData?.price ?? '0'}
        </Text>

        {/* Description */}
        <Text className="mb-6 text-gray-600">
          {parsedData?.description || 'No description available'}
        </Text>

        {/* Product Details */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold">Product Details</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Category</Text>
              <Text>{parsedData?.categoryName}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Stock Quantity</Text>
              <Text>{parsedData?.shipping?.stock_quantity || '0'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Condition</Text>
              <Text>{parsedData?.condition || 'New'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Discount Percentage</Text>
              <Text>{parsedData?.shipping?.discount_percentage || '0'}%</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Tags</Text>
              <Text>
                {parsedData?.shipping.tags?.join(', ') || 'No tags available'}
              </Text>
            </View>
          </View>
        </View>

        {/* Shipping */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold">Shipping</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Service</Text>
              <Text>
                {parsedData?.shipping?.service || 'No service specified'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Cost</Text>
              <Text>${parsedData?.shipping?.cost ?? '0'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Dispatch Time</Text>
              <Text>{parsedData?.shipping?.dispatchDays || '0'} days</Text>
            </View>
          </View>
        </View>

        {/* Returns */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold">Returns</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Accepted</Text>
              <Text>{parsedData?.returns?.accepted ? 'Yes' : 'No'}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Period</Text>
              <Text>{parsedData?.returns?.period || '0'} days</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Shipping Paid By</Text>
              <Text className="capitalize">
                {parsedData?.returns?.shippingPaidBy || 'No information'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
