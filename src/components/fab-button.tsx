import { router } from 'expo-router';
import { CameraIcon, PlusCircle, Search } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const FAB = () => {
  const firstValue = useSharedValue(30);
  const secondValue = useSharedValue(30);
  const thirdValue = useSharedValue(30);
  const firstWidth = useSharedValue(60);
  const secondWidth = useSharedValue(60);
  const thirdWidth = useSharedValue(60);
  const isOpen = useSharedValue(false);
  const opacity = useSharedValue(0);
  const progress = useDerivedValue(() =>
    isOpen.value ? withTiming(1) : withTiming(0),
  );

  const handlePress = () => {
    const config = {
      easing: Easing.bezier(0.68, -0.6, 0.32, 1.6),
      duration: 500,
    };
    if (isOpen.value) {
      firstWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          firstValue.value = withTiming(30, config);
        }
      });
      secondWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          secondValue.value = withDelay(50, withTiming(30, config));
        }
      });
      thirdWidth.value = withTiming(60, { duration: 100 }, (finish) => {
        if (finish) {
          thirdValue.value = withDelay(100, withTiming(30, config));
        }
      });
      opacity.value = withTiming(0, { duration: 100 });
    } else {
      firstValue.value = withDelay(200, withSpring(130));
      secondValue.value = withDelay(100, withSpring(210));
      thirdValue.value = withSpring(290);
      firstWidth.value = withDelay(1200, withSpring(200));
      secondWidth.value = withDelay(1100, withSpring(200));
      thirdWidth.value = withDelay(1000, withSpring(200));
      opacity.value = withDelay(1200, withSpring(1));
    }
    isOpen.value = !isOpen.value;
  };

  const handleCreateListing = () => {
    const initialData = {
      title: '',
      description: '',
      price: '',
      pictures: [''],
      category: '',
      condition: '',
      specifics: {
        publisher: '',
        author: '',
        language: '',
      },
      shipping: {
        service: 'USPSMedia',
        cost: 2.5,
        dispatchDays: 3,
      },
      returns: {
        accepted: true,
        period: 30,
        shippingPaidBy: 'Buyer',
      },
    };

    // Encode the initialData before passing it as a parameter
    const encodedInitialData = encodeURIComponent(JSON.stringify(initialData));

    router.push({
      pathname: '/scan/create-listing',
      params: { initialData: encodedInitialData },
    });
  };

  const opacityText = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const firstWidthStyle = useAnimatedStyle(() => {
    return {
      width: firstWidth.value,
    };
  });
  const secondWidthStyle = useAnimatedStyle(() => {
    return {
      width: secondWidth.value,
    };
  });
  const thirdWidthStyle = useAnimatedStyle(() => {
    return {
      width: thirdWidth.value,
    };
  });

  const firstIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      firstValue.value,
      [30, 130],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: firstValue.value,
      transform: [{ scale: scale }],
    };
  });

  const secondIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      secondValue.value,
      [30, 210],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: secondValue.value,
      transform: [{ scale: scale }],
    };
  });

  const thirdIcon = useAnimatedStyle(() => {
    const scale = interpolate(
      thirdValue.value,
      [30, 290],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      bottom: thirdValue.value,
      transform: [{ scale: scale }],
    };
  });

  const plusIcon = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${progress.value * 45}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <AnimatedTouchable
        onPress={handleCreateListing}
        style={[styles.contentContainer, thirdIcon, thirdWidthStyle]}
      >
        <View style={styles.iconContainer}>
          <PlusCircle size={26} color="#fff" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>Create</Animated.Text>
      </AnimatedTouchable>
      <AnimatedTouchable
        onPress={() => router.push('/scan/scan')}
        style={[styles.contentContainer, secondIcon, secondWidthStyle]}
      >
        <View style={styles.iconContainer}>
          <CameraIcon size={26} color="#fff" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>Scan</Animated.Text>
      </AnimatedTouchable>
      <AnimatedTouchable
        onPress={() => router.push('/(app)/search')}
        style={[styles.contentContainer, firstIcon, firstWidthStyle]}
      >
        <View style={styles.iconContainer}>
          <Search size={26} color="#fff" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>Search</Animated.Text>
      </AnimatedTouchable>
      <Pressable
        style={styles.contentContainer}
        onPress={() => {
          handlePress();
        }}
      >
        <Animated.View style={[styles.iconContainer, plusIcon]}>
          <PlusCircle size={26} color="#fff" />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default FAB;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    zIndex: 1000,
    backgroundColor: '#00BCD4',
    position: 'absolute',
    bottom: 30,
    right: 30,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 26,
    height: 26,
  },
  text: {
    color: 'white',
    fontSize: 18,
  },
});
