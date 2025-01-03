import React from 'react';

import { Image, Text, TouchableOpacity, View } from '@/ui';

const ProductItem = ({ item }: { item: any }) => {
  return (
    <TouchableOpacity
      className="mb-4 rounded-xl bg-white p-4 shadow-sm"
      activeOpacity={0.7}
    >
      <View className="flex-row">
        {item.images.length > 0 && (
          <Image
            source={{ uri: item.images[0] }}
            className="mr-4 size-24 rounded-lg"
          />
        )}

        <View className="flex-1">
          <Text className="mb-2 text-lg font-bold text-gray-900">
            {item.title}
          </Text>

          <Text className="mb-3 text-sm text-gray-600" numberOfLines={2}>
            {item.description}
          </Text>

          <View className="mb-3 flex-row flex-wrap">
            {item.categories.map((category: any) => (
              <View
                key={category}
                className="mb-2 mr-2 rounded-full bg-cyan-50 px-3 py-1"
              >
                <Text className="text-xs font-medium text-cyan-600">
                  {category}
                </Text>
              </View>
            ))}
          </View>

          <View className="mb-3 flex-row justify-between">
            <Text className="text-sm text-gray-500">
              <Text className="font-semibold">Stock:</Text>{' '}
              {item.stock_quantity}
            </Text>
            <Text className="text-sm text-gray-500">
              <Text className="font-semibold">Condition:</Text> {item.condition}
            </Text>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-gray-900">
              ${Number(item.price).toFixed(2)}
            </Text>
            {item.discount_percentage > 0 && (
              <Text className="text-sm font-semibold text-green-600">
                {item.discount_percentage}% OFF
              </Text>
            )}
          </View>

          {item.tags && item.tags.length > 0 && (
            <View className="flex-row flex-wrap">
              {item.tags.map((tag: any) => (
                <View
                  key={tag}
                  className="mb-2 mr-2 rounded-full bg-cyan-50 px-3 py-1"
                >
                  <Text className="text-xs font-medium text-cyan-600">
                    {tag}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductItem;
