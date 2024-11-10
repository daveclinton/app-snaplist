import { Image } from 'expo-image';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

type ListingStatus = 'draft' | 'published' | 'delisted';

export default function ProductListingPage() {
  const [status, setStatus] = useState<ListingStatus>('draft');
  const [isLoading, setIsLoading] = useState(false);

  const { initialData } = useLocalSearchParams<{ initialData: string }>();

  const parsedData = initialData
    ? JSON.parse(decodeURIComponent(initialData))
    : null;

  console.log(parsedData);

  const handleStatusChange = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    switch (status) {
      case 'draft':
        setStatus('published');
        break;
      case 'published':
        setStatus('delisted');
        break;
      case 'delisted':
        setStatus('published');
        break;
    }
    setIsLoading(false);
  };

  const getButtonText = () => {
    switch (status) {
      case 'draft':
        return 'Post';
      case 'published':
        return 'List';
      case 'delisted':
        return 'De-List';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-500';
      case 'published':
        return 'bg-green-500';
      case 'delisted':
        return 'bg-red-500';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-4">
        {/* Status Badge */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className={`rounded-full px-3 py-1 ${getStatusColor()}`}>
            <Text className="font-medium capitalize text-white">{status}</Text>
          </View>
          <Pressable
            onPress={handleStatusChange}
            disabled={isLoading}
            className={`rounded-lg px-6 py-3 ${
              isLoading ? 'bg-gray-300' : 'bg-cyan-500'
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
          {parsedData?.Item?.PictureDetails?.PictureURL ? (
            <Image
              source={parsedData.Item.PictureDetails.PictureURL}
              className="mr-2 size-72  rounded-lg"
              contentFit="cover"
              transition={1000}
            />
          ) : (
            <Text className="text-gray-500">No images available</Text>
          )}
        </ScrollView>

        {/* Title and Price */}
        <Text className="mb-2 text-2xl font-bold">
          {parsedData?.Item?.Title || 'No title available'}
        </Text>
        <Text className="mb-4 text-xl font-semibold text-cyan-600">
          ${parsedData?.Item?.StartPrice ?? '0'}
        </Text>

        {/* Description */}
        <Text className="mb-6 text-gray-600">
          {parsedData?.Item?.Description || 'No description available'}
        </Text>

        {/* Details */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold">Product Details</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Category</Text>
              <Text>
                {parsedData?.Item?.PrimaryCategory?.CategoryID || '-'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Condition</Text>
              <Text>{parsedData?.Item?.Condition || '-'}</Text>
            </View>
          </View>
        </View>

        {/* Specifics */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold">Specifications</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Publisher</Text>
              <Text>
                {parsedData?.Item?.ItemSpecifics?.find(
                  (spec: { Name: string }) => spec.Name === 'Publisher',
                )?.Value || '-'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Author</Text>
              <Text>
                {parsedData?.Item?.ItemSpecifics?.find(
                  (spec: { Name: string }) => spec.Name === 'Author',
                )?.Value || '-'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Language</Text>
              <Text>
                {parsedData?.Item?.ItemSpecifics?.find(
                  (spec: { Name: string }) => spec.Name === 'Language',
                )?.Value || '-'}
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
                {parsedData?.Item?.ShippingDetails?.ShippingServiceOptions?.[0]
                  ?.ShippingService || '-'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Cost</Text>
              <Text>
                $
                {parsedData?.Item?.ShippingDetails?.ShippingServiceOptions?.[0]
                  ?.ShippingServiceCost ?? '0'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Dispatch Time</Text>
              <Text>{parsedData?.Item?.DispatchTimeMax || '-'} days</Text>
            </View>
          </View>
        </View>

        {/* Returns */}
        <View className="mb-4 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-2 text-lg font-semibold">Returns</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Accepted</Text>
              <Text>
                {parsedData?.Item?.ReturnPolicy?.ReturnsAcceptedOption ===
                'ReturnsAccepted'
                  ? 'Yes'
                  : 'No'}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Period</Text>
              <Text>
                {parsedData?.Item?.ReturnPolicy?.ReturnsWithinOption || '-'}{' '}
                days
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-500">Shipping Paid By</Text>
              <Text className="capitalize">
                {parsedData?.Item?.ReturnPolicy?.ShippingCostPaidByOption ||
                  '-'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
