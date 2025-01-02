import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { Box, ChevronRight } from 'lucide-react-native';
import React, { useCallback } from 'react';
import { FlatList } from 'react-native';

import { useProducts } from '@/api/products/use-products';
import { Image, Text, TouchableOpacity, View } from '@/ui';

type RecentListingsProps = {
  viewAll?: boolean;
  limit?: number;
};

const RecentListings = ({
  viewAll = false,
  limit, // Optional limit for the number of items to display
}: RecentListingsProps) => {
  const { data, error, isLoading, refetch } = useProducts({
    variables: { id: '563a3473-dbcb-48ba-8ed3-c6f34f11ae26' },
  });

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (isLoading) {
    return (
      <View className="mb-6 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6 items-center justify-center">
        <Text>Error: {error.message}</Text>
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
          {viewAll && (
            <View className="flex-row items-center">
              <Link
                href="/(app)/listings"
                className="mr-1 text-sm text-cyan-600 dark:text-cyan-400"
              >
                View All
              </Link>
              <ChevronRight size={16} color="#0891b2" />
            </View>
          )}
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

  // Apply the limit if provided
  const displayedData = limit ? data.slice(0, limit) : data;

  const renderItem = ({ item }: { item: (typeof data)[0] }) => (
    <TouchableOpacity
      className="mb-3 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
      activeOpacity={0.7}
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
  );

  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white">
          Recent Listings
        </Text>
        {viewAll && (
          <View className="flex-row items-center">
            <Link
              href="/(app)/listings"
              className="mr-1 text-sm text-cyan-600 dark:text-cyan-400"
            >
              View All
            </Link>
            <ChevronRight size={16} color="#0891b2" />
          </View>
        )}
      </View>

      <FlatList
        data={displayedData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RecentListings;
