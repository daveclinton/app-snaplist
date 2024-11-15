/* eslint-disable react-hooks/exhaustive-deps */
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import RootSiblings from 'react-native-root-siblings';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let loaderInstance: RootSiblings | null = null;
let activeTimeoutId: NodeJS.Timeout | null = null;

const LOADER_TIMEOUT = 30000;

const createLoader = () => {
  return new Promise<RootSiblings>((resolve) => {
    const instance = new RootSiblings(
      (
        <Loader
          onRef={() => {
            resolve(instance);
          }}
        />
      ),
    );
  });
};

export const showLoader = async () => {
  if (process.env.NODE_ENV === 'test') return;
  hideLoader();

  try {
    loaderInstance = await createLoader();
    activeTimeoutId = setTimeout(() => {
      hideLoader();
    }, LOADER_TIMEOUT);
  } catch (error) {
    console.error('Error showing loader:', error);
  }
};

export const hideLoader = () => {
  if (activeTimeoutId) {
    clearTimeout(activeTimeoutId);
    activeTimeoutId = null;
  }

  if (loaderInstance) {
    loaderInstance.destroy();
    loaderInstance = null;
  }
};

interface LoaderProps {
  onRef?: (ref: any) => void;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 50,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dark: {
    backgroundColor: '#1f2937',
  },
  lottieContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '100%',
    flex: 1,
  },
});

function Loader({ onRef }: LoaderProps) {
  const { top } = useSafeAreaInsets();
  const [visible] = useState(true);
  const animation = useRef<LottieView>(null);
  const isMounted = useRef(true);

  useEffect(() => {
    if (onRef) {
      onRef(animation.current);
    }
    if (animation.current) {
      animation.current.play();
    }

    return () => {
      isMounted.current = false;
      if (animation.current) {
        animation.current.reset();
      }
      if (activeTimeoutId) {
        clearTimeout(activeTimeoutId);
        activeTimeoutId = null;
      }
      if (loaderInstance) {
        hideLoader();
      }
    };
  }, [onRef]);

  if (!visible || !isMounted.current) return null;

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <Animated.View
        entering={FadeIn.duration(200)}
        exiting={FadeOut.duration(200)}
        style={[styles.container, { marginTop: top }]}
      >
        <View style={styles.lottieContainer}>
          <LottieView
            autoPlay
            loop
            ref={animation}
            style={styles.lottie}
            source={require('../../assets/loader.json')}
            renderMode="AUTOMATIC"
          />
        </View>
      </Animated.View>
    </View>
  );
}

export default Loader;
