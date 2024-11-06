import * as MediaLibrary from 'expo-media-library';
import { router, Stack } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import Animated from 'react-native-reanimated';

import FullScreenCamera from '@/components/Camera/full-camera';
import CameraSection from '@/components/Camera/small-camera';
import { Image, SafeAreaView, View } from '@/ui';

const { width: screenWidth } = Dimensions.get('window');
const numColumns = 4;
const gap = 4;
const imageSize = (screenWidth - 32 - (numColumns - 1) * gap) / numColumns;
const ITEMS_PER_PAGE = 20;
const LOAD_MORE_THRESHOLD = 0.7;

const MemoizedImage = React.memo(
  ({ uri }: { uri: string }) => (
    <Image
      style={{
        width: imageSize,
        height: imageSize,
        margin: gap / 2,
      }}
      source={{ uri }}
      transition={1000}
      cachePolicy="memory-disk"
    />
  ),
  (prevProps, nextProps) => prevProps.uri === nextProps.uri,
);

const GalleryItem = React.memo(
  ({ asset }: { asset: MediaLibrary.Asset }) => (
    <TouchableOpacity>
      <MemoizedImage uri={asset.uri} />
    </TouchableOpacity>
  ),
  (prevProps, nextProps) => prevProps.asset.id === nextProps.asset.id,
);

export default function ScanProduct() {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const handleOpenCamera = useCallback(() => {
    setIsCameraOpen(true);
  }, []);

  const handleCloseCamera = useCallback(() => {
    setIsCameraOpen(false);
  }, []);

  const [assets, setAssets] = useState<MediaLibrary.Asset[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const endCursor = useRef<string | undefined>();

  const loadAssets = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const fetchedAssets = await MediaLibrary.getAssetsAsync({
        first: ITEMS_PER_PAGE,
        after: endCursor.current,
        sortBy: ['creationTime'],
        mediaType: ['photo', 'video'],
      });

      endCursor.current = fetchedAssets.endCursor;
      setHasMore(fetchedAssets.hasNextPage);
      setAssets((prev) => [...prev, ...fetchedAssets.assets]);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore]);

  useEffect(() => {
    loadAssets();
  }, [loadAssets]);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } =
        event.nativeEvent;
      const scrollPosition =
        (contentOffset.y + layoutMeasurement.height) / contentSize.height;

      if (scrollPosition > LOAD_MORE_THRESHOLD) {
        loadAssets();
      }
    },
    [loadAssets],
  );

  const keyExtractor = useCallback((item: MediaLibrary.Asset) => item.id, []);

  const renderItem = useCallback(
    ({ item }: { item: MediaLibrary.Asset }) => <GalleryItem asset={item} />,
    [],
  );

  return (
    <View
      style={{ flex: 1, backgroundColor: isDarkMode ? '#111827' : '#ffffff' }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      {isCameraOpen && <FullScreenCamera onClose={handleCloseCamera} />}
      <Animated.View style={[{ flex: 1, width: '100%' }]}>
        <SafeAreaView
          className="w-full flex-1"
          style={{ backgroundColor: isDarkMode ? '#111827' : '#ffffff' }}
        >
          <FlatList
            className="flex-1"
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <CameraSection
                onOpenCamera={handleOpenCamera}
                onClose={() => router.back()}
              />
            }
            data={assets}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            onScroll={handleScroll}
            numColumns={numColumns}
            initialNumToRender={12}
            maxToRenderPerBatch={8}
            windowSize={5}
            removeClippedSubviews={true}
            ListHeaderComponentStyle={{ marginBottom: 16 }}
            contentContainerStyle={{
              paddingHorizontal: 0,
              backgroundColor: isDarkMode ? '#111827' : '#ffffff',
            }}
            columnWrapperStyle={{
              justifyContent: 'flex-start',
              paddingHorizontal: 10,
            }}
          />
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
