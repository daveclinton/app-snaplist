import * as React from 'react';
import { FlatList } from 'react-native';

import useProductListings from '@/api/common/use-product-listings';
import ProductItem from '@/components/product-item';
import ProductListPreview from '@/components/product-list-preview';
import { FocusAwareStatusBar, SafeAreaView, View } from '@/ui';

export default function Style() {
  const { data, error, isLoading } = useProductListings();

  if (isLoading || error || !data || data.length === 0) {
    return <ProductListPreview />;
  }
  return (
    <SafeAreaView>
      <FocusAwareStatusBar />
      <View className="px-4">
        <FlatList
          data={data}
          renderItem={({ item }) => <ProductItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}
