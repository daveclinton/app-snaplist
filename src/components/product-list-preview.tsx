import { Link, router } from 'expo-router';
import { AlertCircle, Box, MoreHorizontal } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';

import useProductListings from '@/api/common/use-product-listings';
import { Image, Text, TouchableOpacity, View } from '@/ui';

const SkeletonLoader = () => (
  <View className="mb-6">
    <View className="mb-4 flex-row items-center justify-between">
      <View className="h-6 w-32 rounded-lg bg-gray-200" />
      <View className="h-4 w-20 rounded-lg bg-gray-200" />
    </View>
    {[...Array(3)].map((_, index) => (
      <View key={index} className="mb-3 rounded-xl bg-white p-4 shadow-sm">
        <View className="flex-row">
          <View className="mr-3 size-24 rounded-lg bg-gray-200" />
          <View className="flex-1">
            <View className="mb-2 h-6 w-3/4 rounded-lg bg-gray-200" />
            <View className="mb-2 h-4 w-full rounded-lg bg-gray-200" />
            <View className="mb-2 h-4 w-2/3 rounded-lg bg-gray-200" />
            <View className="flex-row items-center justify-between">
              <View className="h-4 w-16 rounded-lg bg-gray-200" />
              <View className="h-4 w-16 rounded-lg bg-gray-200" />
            </View>
          </View>
        </View>
      </View>
    ))}
  </View>
);

interface TagsListProps {
  items: string[];
  limit: number;
}

const TagsList: React.FC<TagsListProps> = ({ items, limit }) => {
  const [showAll, setShowAll] = useState(false);
  const displayItems = showAll ? items : items.slice(0, limit);
  const remainingCount = items.length - limit;

  return (
    <View className="flex-row flex-wrap items-center">
      {displayItems.map((item) => (
        <View
          key={item}
          className="mb-1 mr-2 rounded-full bg-cyan-50 px-2 py-0.5"
        >
          <Text className="text-xs text-cyan-600">{item}</Text>
        </View>
      ))}
      {!showAll && remainingCount > 0 && (
        <TouchableOpacity
          onPress={() => setShowAll(true)}
          className="mb-1 flex-row items-center"
        >
          <MoreHorizontal size={16} className="text-cyan-600" />
          <Text className="ml-1 text-xs text-cyan-600">
            +{remainingCount} more
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const ProductListPreview = () => {
  const { data, error, isLoading, userSupabaseId } = useProductListings();

  useEffect(() => {
    console.log('userSupabaseId:', userSupabaseId);

    let redirectTimer: NodeJS.Timeout;

    if (!userSupabaseId) {
      console.log('Setting redirect timer...');
      redirectTimer = setTimeout(() => {
        console.log('Redirecting to login...');
        router.push('/login');
      }, 20000);
    }

    return () => {
      if (redirectTimer) {
        console.log('Clearing redirect timer...');
        clearTimeout(redirectTimer);
      }
    };
  }, [userSupabaseId]);

  if (isLoading) return <SkeletonLoader />;
  if (error) return <ErrorView />;
  if (!data || data.length === 0) return <EmptyListView />;

  return (
    <View className="mb-6">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="text-lg font-semibold">Recent Listings</Text>
        <Link href="/(app)/listings" className="text-sm text-cyan-600">
          View All
        </Link>
      </View>
      {data.slice(0, 3).map((item) => (
        <ProductItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const ErrorView = () => (
  <View className="items-center justify-center p-6">
    <AlertCircle size={48} color="#EF4444" />
    <Text className="text-xl font-semibold text-red-600">
      Oops! Something went wrong.
    </Text>
  </View>
);

const EmptyListView = () => (
  <View className="mb-6 items-center justify-center">
    <Box size={48} color="#0891b2" />
    <Text className="text-xl font-semibold">No Recent Listings</Text>
  </View>
);

interface ProductItemProps {
  item: {
    id: string;
    title: string;
    price: number;
    images: string[];
    categories: string[];
  };
}

const ProductItem: React.FC<ProductItemProps> = ({ item }) => (
  <TouchableOpacity className="mb-3 rounded-xl bg-white shadow-sm">
    <View className="flex-row">
      {item.images.length > 0 && (
        <View className="relative w-1/3">
          <Image
            source={{ uri: item.images[0] }}
            className="aspect-square w-full"
          />
        </View>
      )}
      <View className="flex-1 p-4">
        <Text className="text-lg font-semibold">{item.title}</Text>
        <Text className="text-base font-semibold">
          ${Number(item.price).toFixed(2)}
        </Text>
        <TagsList items={item.categories} limit={2} />
      </View>
    </View>
  </TouchableOpacity>
);

export default ProductListPreview;
