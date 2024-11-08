// app/components/FeedHeader.tsx
import { MaterialIcons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { FocusAwareStatusBar, Text, View } from '@/ui';

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
              {/* <Pressable style={styles.actionButton}>
                <MaterialIcons
                  name="notifications-none"
                  size={24}
                  color={isDark ? '#FFFFFF' : '#000000'}
                />
              </Pressable> */}
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
            <Pressable
              onPress={onCameraOpen}
              style={[
                styles.searchBar,
                {
                  backgroundColor: isDark ? '#374151' : '#f3f4f6',
                },
              ]}
            >
              <Text
                style={[
                  styles.searchPrompt,
                  {
                    color: isDark ? '#9CA3AF' : '#6B7280',
                  },
                ]}
              >
                Click camera to search
              </Text>
              <View style={styles.actionButton}>
                <MaterialIcons
                  name="camera-alt"
                  size={24}
                  color={isDark ? '#9CA3AF' : '#6B7280'}
                />
              </View>
            </Pressable>
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
    paddingHorizontal: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 8,
    justifyContent: 'space-between',
  },
  searchPrompt: {
    fontSize: 16,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
});
