import { MaterialIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { Camera, Search } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FocusAwareStatusBar, Text, View } from '@/ui';

import FAB from './fab-button';

const HEADER_HEIGHT = 120;
const COLLAPSED_HEIGHT = 60;

export const FeedHeader = ({
  children,
  onCameraOpen,
}: {
  children: React.ReactNode;
  onCameraOpen: () => void;
}) => {
  const scrollY = new Animated.Value(0);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - COLLAPSED_HEIGHT],
    outputRange: [HEADER_HEIGHT, COLLAPSED_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - COLLAPSED_HEIGHT],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const searchBarTop = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT - COLLAPSED_HEIGHT],
    outputRange: [65, 10],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? '#111827' : '#FFFFFF' },
      ]}
    >
      <FocusAwareStatusBar />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.header,
            {
              height: headerHeight,
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
            },
          ]}
        >
          <Animated.View
            style={[styles.topContainer, { opacity: headerOpacity }]}
          >
            <View style={styles.logoContainer}>
              <Text
                style={[
                  styles.logoText,
                  { color: isDark ? '#FFFFFF' : '#000000' },
                ]}
              >
                Snaplist
              </Text>
            </View>
            <View style={styles.actionsContainer}>
              <Link asChild href="/feed/new-marketplace">
                <Pressable style={styles.actionButton}>
                  <MaterialIcons
                    name="add"
                    size={24}
                    color={isDark ? '#FFFFFF' : '#000000'}
                  />
                </Pressable>
              </Link>
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.searchContainer, { top: searchBarTop }]}
          >
            <View className="w-full bg-transparent px-4">
              <View
                className={`flex-row items-center rounded-xl ${isDark ? 'bg-gray-700' : 'bg-gray-100'} px-4 py-2`}
              >
                <Search
                  width={20}
                  height={20}
                  color={isDark ? '#9CA3AF' : '#0891b2'}
                />
                <Pressable
                  onPress={() => router.push('/(app)/search')}
                  className="flex-1"
                >
                  <Text
                    className={`mx-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}
                    numberOfLines={1}
                  >
                    Search on Snaplist
                  </Text>
                </Pressable>
                <View className="flex-row gap-2">
                  <Pressable
                    onPress={onCameraOpen}
                    className="p-2"
                    accessibilityLabel="Image search"
                  >
                    <Camera
                      width={20}
                      height={20}
                      color={isDark ? '#9CA3AF' : '#0891b2'}
                    />
                  </Pressable>
                </View>
              </View>
            </View>
          </Animated.View>
        </Animated.View>
        <Animated.ScrollView
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false },
          )}
          scrollEventThrottle={16}
          style={[
            styles.scrollView,
            {
              backgroundColor: isDark ? '#111827' : '#FFFFFF',
            },
          ]}
        >
          <View style={{ marginTop: HEADER_HEIGHT }}>{children}</View>
        </Animated.ScrollView>
        <FAB />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 20,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  searchContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  scrollView: {
    flex: 1,
  },
});
