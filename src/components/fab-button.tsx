import { router } from 'expo-router';
import { CameraIcon, PlusCircle, Search } from 'lucide-react-native';
import React from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import * as ImagePicker from 'react-native-image-crop-picker';
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

import { useCameraPermission } from '@/core/hooks/use-permissions';

type ImagePickerError = {
  code: string;
  message: string;
};

const { height, width } = Dimensions.get('window');

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
  const { requestCameraAccessIfNeeded } = useCameraPermission();

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
    isOpen.value = !isOpen.value;
  };

  const handleImageSelection = async (image: ImagePicker.Image) => {
    const encodedUri = await encodeURIComponent(image.path);
    await router.push(`/scan/${encodedUri}`);
  };
  const handleError = (error: unknown) => {
    const isImagePickerError = (err: unknown): err is ImagePickerError => {
      return typeof err === 'object' && err !== null && 'code' in err;
    };

    if (isImagePickerError(error) && error.code !== 'E_PICKER_CANCELLED') {
      Alert.alert(
        'Permissions needed',
        'Snaplist needs camera and photo access to continue',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraAccessIfNeeded();
    if (!hasPermission) return;

    try {
      const image = await ImagePicker.openCamera({
        width: 1200,
        height: 1200,
        cropping: true,
        mediaType: 'photo',
        compressImageQuality: 0.8,
      });

      handleImageSelection(image);
    } catch (error) {
      handleError(error);
    }
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
    <View>
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
        onPress={() => {
          openCamera();
          isOpen.value = !isOpen.value;
        }}
        style={[styles.contentContainer, secondIcon, secondWidthStyle]}
      >
        <View style={styles.iconContainer}>
          <CameraIcon size={26} color="#fff" />
        </View>
        <Animated.Text style={[styles.text, opacityText]}>Scan</Animated.Text>
      </AnimatedTouchable>
      <AnimatedTouchable
        onPress={() => {
          router.push('/(app)/search');
          isOpen.value = !isOpen.value;
        }}
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
  contentContainer: {
    zIndex: 1000,
    backgroundColor: '#00BCD4',
    position: 'absolute',
    bottom: height * 0.025,
    right: width * 0.025,
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
