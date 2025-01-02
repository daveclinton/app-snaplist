// components/ProductListPreview.tsx
import { Link } from 'expo-router';
import React from 'react';

import useProductListings from '@/api/common/use-product-listings';
import { Image, Text, TouchableOpacity, View } from '@/ui';

const ProductListPreview = () => {
  const { data, error, isLoading } = useProductListings();

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  if (!data || data.length === 0) {
    return (
      <View className="items-center justify-center p-4">
        <Text>No listings found.</Text>
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
