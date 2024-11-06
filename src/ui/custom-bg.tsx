import { type BottomSheetBackgroundProps } from '@gorhom/bottom-sheet';
import { useColorScheme } from 'nativewind';
import React, { useMemo } from 'react';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  const { colorScheme } = useColorScheme();

  // Define colors based on color scheme
  const colors = useMemo(
    () => ({
      start: colorScheme === 'dark' ? '#111827' : '#FFFFFF',
      end: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
    }),
    [colorScheme],
  );

  // Animated style for smooth color transitions
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      [colors.start, colors.end],
    ),
    // Add subtle shadow or border based on position
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOpacity: withTiming(animatedIndex.value * 0.2),
    shadowRadius: 5,
    elevation: 5,
  }));

  // Combine styles
  const containerStyle = useMemo(
    () => [
      {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: colors.start,
      },
      style,
      containerAnimatedStyle,
    ],
    [style, containerAnimatedStyle, colors.start],
  );

  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;
