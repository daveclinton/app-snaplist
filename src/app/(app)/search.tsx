import { router } from 'expo-router';
import { AlertCircle, ArrowBigLeftIcon, Camera } from 'lucide-react-native';
import React, { useState, useCallback, useMemo } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import debounce from 'lodash/debounce';

import { Image, Pressable, SafeAreaView, Text, View } from '@/ui';
import { useImageSearch } from '@/api/products/use-search';

interface Product {
  id: string;
  title: string;
  images: string[];
  priceRange?: string[];
  description?: string;
  freeShipping: boolean;
}

interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue?: string;
}

interface ProductCardProps {
  product: Product;
  onPress?: (product: Product) => void;
}

interface SearchResponse {
  products: Product[];
  totalResults: number;
  page: number;
  totalPages: number;
}

interface ImageSearchVariables {
  query: string;
  limit: number;
  page: number;
}

interface UseImageSearchResult {
  data?: SearchResponse;
  isLoading: boolean;
  error?: Error;
  refetch: () => void;
  isFetching: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  initialValue = '',
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  const debouncedSearch = useMemo(
    () => debounce((term: string) => onSearch(term), 500),
    [onSearch],
  );

  const handleChange = (text: string) => {
    setSearchTerm(text);
    debouncedSearch(text);
  };

  return (
    <View className="w-full bg-white p-4 shadow-sm">
      <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-2">
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Go back"
          className="mr-2"
          accessibilityRole="button"
        >
          <ArrowBigLeftIcon width={20} height={20} color="#0891b2" />
        </Pressable>

        <TextInput
          value={searchTerm}
          onChangeText={handleChange}
          placeholder="Search on Snaplist"
          placeholderTextColor="#6b7280"
          className="flex-1 text-gray-800"
          returnKeyType="search"
          accessibilityLabel="Search input"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          onPress={() => router.push('/scan/scan')}
          className="ml-2 p-2"
          accessibilityLabel="Image search"
          accessibilityRole="button"
        >
          <Camera width={20} height={20} color="#0891b2" />
        </Pressable>
      </View>
    </View>
  );
};

const ProductCard: React.FC<ProductCardProps> = ({ product, onPress }) => {
  const handlePress = useCallback(() => {
    onPress?.(product);
  }, [product, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      className="mb-4 overflow-hidden rounded-lg bg-white shadow"
      accessibilityRole="button"
      accessibilityLabel={`View ${product.title}`}
    >
      <View className="flex-row p-4">
        <View className="size-24 rounded-md bg-gray-200">
          <Image
            source={{ uri: product.images[0] }}
            className="size-full rounded-md"
            alt={product.title}
          />
        </View>

        <View className="ml-4 flex-1">
          <Text
            className="text-lg font-medium text-gray-900"
            numberOfLines={2}
            accessibilityRole="header"
          >
            {product.title}
          </Text>

          {product.priceRange && product.priceRange.length > 0 && (
            <Text className="mt-1 text-cyan-600">
              {product.priceRange.join(' - ')}
            </Text>
          )}

          <View className="mt-2 flex-row">
            {product.freeShipping && (
              <Text className="text-sm text-gray-500">Free shipping</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
};

const SearchResults: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 20;

  const { data, isLoading, error, refetch } = useImageSearch({
    variables: {
      query: searchTerm,
      limit: ITEMS_PER_PAGE,
      page,
    },
    enabled: !!searchTerm,
  });

  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term);
    setPage(1);
  }, []);

  const handleProductPress = useCallback((product: Product) => {
    router.push(`/product/${product.id}`);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!isLoading && data?.products.length === ITEMS_PER_PAGE) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [isLoading, data?.products.length]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const isCloseToBottom =
        layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

      if (isCloseToBottom) {
        handleLoadMore();
      }
    },
    [handleLoadMore],
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0891b2" />
          <Text className="mt-4 text-gray-600">Searching for products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
        <View className="flex-1 items-center justify-center p-4">
          <AlertCircle width={48} height={48} color="#ef4444" />
          <Text className="mt-4 text-center text-red-500">
            {error.message || 'An error occurred while searching'}
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-4 rounded-full bg-cyan-600 px-6 py-2"
            accessibilityRole="button"
            accessibilityLabel="Try searching again"
          >
            <Text className="text-white">Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
      <ScrollView
        className="flex-1"
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <View className="p-4">
          {data?.products.map((product) => (
            <ProductCard
              key={product?.id}
              product={product}
              onPress={handleProductPress}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchResults;