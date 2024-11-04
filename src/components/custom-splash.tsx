// components/custom-splash.tsx
import React from 'react';
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native';

import { Env } from '@/core/env';
import { Image } from '@/ui/image';
import { Text } from '@/ui/text';

const { width, height } = Dimensions.get('window');

export const CustomSplash = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/splash.png')}
          className="size-full"
          contentFit="cover"
        />

        <View style={styles.loaderContainer}>
          <ActivityIndicator color="white" />
        </View>

        {Env.APP_ENV !== 'production' && (
          <View style={styles.environmentBadge}>
            <Text style={styles.environmentText}>{Env.APP_ENV}</Text>
            <Text style={styles.versionText}>v{Env.VERSION}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#2E3C4B',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 100,
  },
  environmentBadge: {
    position: 'absolute',
    top: 44,
    right: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  environmentText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E3C4B',
    textTransform: 'uppercase',
  },
  versionText: {
    fontSize: 10,
    color: '#2E3C4B',
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
  },
});
