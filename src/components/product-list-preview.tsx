import { Link } from 'expo-router';
import { AlertCircle, Box, ChevronRight } from 'lucide-react-native';
import React from 'react';

import useProductListings from '@/api/common/use-product-listings';
import { Image, Text, TouchableOpacity, View } from '@/ui';

const SkeletonLoader = () => {
  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View className="h-6 w-32 rounded-lg bg-gray-200 dark:bg-gray-700" />
        <View className="h-4 w-20 rounded-lg bg-gray-200 dark:bg-gray-700" />
      </View>

      {[...Array(3)].map((_, index) => (
        <View
          key={index}
          className="mb-3 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
        >
          <View className="flex-row">
            <View className="mr-3 size-24 rounded-lg bg-gray-200 dark:bg-gray-700" />
            <View className="flex-1">
              <View className="mb-2 h-6 w-3/4 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <View className="mb-2 h-4 w-full rounded-lg bg-gray-200 dark:bg-gray-700" />
              <View className="mb-2 h-4 w-2/3 rounded-lg bg-gray-200 dark:bg-gray-700" />
              <View className="flex-row items-center justify-between">
                <View className="h-4 w-16 rounded-lg bg-gray-200 dark:bg-gray-700" />
                <View className="h-4 w-16 rounded-lg bg-gray-200 dark:bg-gray-700" />
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};

const ProductListPreview = () => {
  const { data, error, isLoading } = useProductListings();

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (error) {
    return (
      <View className="items-center justify-center p-6">
        <View className="items-center rounded-lg bg-red-50 p-6 dark:bg-red-900/20">
          <AlertCircle size={48} color="#EF4444" className="mb-4" />
          <Text className="mb-2 text-center text-xl font-semibold text-red-600 dark:text-red-300">
            Oops! Something went wrong.
          </Text>
          <Text className="text-center text-red-500 dark:text-red-400">
            Our servers could be down, and we're working hard to fix this.
            Please try again later.
          </Text>
        </View>
      </View>
    );
  }

  if (!data || data.length === 0) {
    return (
      <View className="mb-6 items-center justify-center">
        <View className="mb-4 w-full flex-row items-center justify-between">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Listings
          </Text>

          <View className="flex-row items-center">
            <Link
              href="/(app)/listings"
              className="mr-1 text-sm text-cyan-600 dark:text-cyan-400"
            >
              View All
            </Link>
            <ChevronRight size={16} color="#0891b2" />
          </View>
        </View>

        <View className="w-full items-center rounded-xl bg-white p-6 dark:bg-gray-800">
          <View className="mb-4 size-24 items-center justify-center rounded-full bg-cyan-50 dark:bg-cyan-900">
            <Box size={48} color="#0891b2" strokeWidth={1.5} />
          </View>

          <Text className="mb-2 text-center text-xl font-semibold text-gray-900 dark:text-white">
            No Recent Listings
          </Text>

          <Text className="mb-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Looks like you haven't scanned any listings yet. Start exploring and
            add your first listing!
          </Text>
        </View>
      </View>
    );
  }

  const displayedData = data.slice(0, 3);

  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Recent Listings</Text>
        <Link href="/(app)/listings" className="text-sm text-cyan-600">
          View All
        </Link>
      </View>

      {displayedData.map((item) => (
        <TouchableOpacity
          className="mb-3 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
          activeOpacity={0.7}
          key={item.id}
        >
          <View className="flex-row">
            {item.images.length > 0 && (
              <Image
                source={{ uri: item.images[0] }}
                className="mr-3 size-24 rounded-lg"
              />
            )}
            <View className="flex-1">
              <Text className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
                {item.title}
              </Text>
              <Text
                className="mb-2 text-sm text-gray-600 dark:text-gray-300"
                numberOfLines={2}
              >
                {item.description}
              </Text>
              <View className="mb-2 flex-row flex-wrap">
                {item.categories.map((category) => (
                  <View
                    key={category}
                    className="mb-2 mr-2 rounded-full bg-cyan-50 px-3 py-1 dark:bg-cyan-900"
                  >
                    <Text className="text-xs text-cyan-600 dark:text-cyan-300">
                      {category}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Stock: {item.stock_quantity}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Condition: {item.condition}
                </Text>
              </View>
              <View className="mt-2 flex-row items-center justify-between">
                <Text className="text-sm text-gray-500 dark:text-gray-400">
                  Discount: {item.discount_percentage}%
                </Text>
                {Array.isArray(item.tags) && item.tags.length > 0 && (
                  <View className="flex-row flex-wrap">
                    {item.tags.map((tag) => (
                      <View
                        key={tag}
                        className="mr-2 rounded-full bg-cyan-50 px-3 py-1 dark:bg-cyan-900"
                      >
                        <Text className="text-xs text-cyan-600 dark:text-cyan-300">
                          {tag}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProductListPreview;
