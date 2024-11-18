import { router } from 'expo-router';
import { AlertCircle, ArrowBigLeftIcon, Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput } from 'react-native';

import { Image, Pressable, SafeAreaView, Text, View } from '@/ui';

const SearchResults = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState([
    {
      id: '8121362066967260294',
      title: 'Stanley H2.0 FlowState Quencher Tumbler',
      images: ['https://example.com/placeholder.jpg'],
      priceRange: ['$24', '$32'],
    },
    {
      id: '8121362066967260295',
      title: 'Stanley H2.0 FlowState Quencher Tumbler',
      images: ['https://example.com/placeholder.jpg'],
      priceRange: ['$24', '$32'],
    },
  ]);

  const handleSearch = () => {
    setIsLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      if (Math.random() > 0.8) {
        setError('Failed to fetch results. Please try again.');
      } else {
        setSearchResults(searchResults);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Search Header */}
      <View className="w-full bg-white p-4 shadow-sm">
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
          <Pressable
            onPress={() => router.back()}
            accessibilityLabel="Go back"
            className="mr-2"
          >
            <ArrowBigLeftIcon width={20} height={20} color="#0891b2" />
          </Pressable>

          <TextInput
            placeholder="Search on Snaplist"
            placeholderTextColor="#6b7280"
            className="flex-1 text-gray-800"
            onSubmitEditing={() => handleSearch()}
          />

          <Pressable
            onPress={() => router.push('/scan/scan')}
            className="ml-2 p-2"
            accessibilityLabel="Image search"
          >
            <Camera width={20} height={20} color="#0891b2" />
          </Pressable>
        </View>
      </View>

      {/* Loading State */}
      {isLoading && (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="mt-4 text-gray-600">Searching for products...</Text>
        </View>
      )}

      {/* Error State */}
      {error && (
        <View className="flex-1 items-center justify-center p-4">
          <AlertCircle width={48} height={48} color="#ef4444" />
          <Text className="mt-4 text-center text-red-500">{error}</Text>
          <Pressable
            onPress={() => handleSearch()}
            className="mt-4 rounded-full bg-cyan-600 px-6 py-2"
          >
            <Text className="text-white">Try Again</Text>
          </Pressable>
        </View>
      )}

      {/* Results */}
      {!isLoading && !error && (
        <ScrollView className="flex-1">
          <View className="p-4">
            <Text className="mb-4 text-gray-600">
              {searchResults.length} results found
            </Text>

            {searchResults.map((product) => (
              <Pressable
                key={product.id}
                className="mb-4 overflow-hidden rounded-lg bg-white shadow"
              >
                <View className="flex-row p-4">
                  <View className="size-24 rounded-md bg-gray-200">
                    <Image
                      source="https://picsum.photos/seed/696/3000/2000"
                      className="size-full rounded-md"
                      alt={product.title}
                    />
                  </View>

                  <View className="ml-4 flex-1">
                    <Text
                      className="text-lg font-medium text-gray-900"
                      numberOfLines={2}
                    >
                      {product.title}
                    </Text>

                    {product.priceRange && product.priceRange.length > 0 && (
                      <Text className="mt-1 text-cyan-600">
                        {product.priceRange.join(' - ')}
                      </Text>
                    )}

                    <View className="mt-2 flex-row">
                      <Text className="text-sm text-gray-500">
                        Free shipping
                      </Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default SearchResults;
