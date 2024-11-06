import { CameraView } from 'expo-camera';
import { CameraIcon, X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { Dimensions, TouchableOpacity } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { Text } from '@/ui';

const { height: screenHeight } = Dimensions.get('window');

const CameraSection = React.memo(
  ({
    onOpenCamera,
    onClose,
  }: {
    onOpenCamera: () => void;
    onClose: () => void;
  }) => {
    const { colorScheme } = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    return (
      <Animated.View
        entering={FadeIn}
        style={{
          height: screenHeight * 0.35,
          alignItems: 'center',
          justifyContent: 'center',
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          backgroundColor: isDarkMode ? '#1a1a1a' : 'black',
          overflow: 'hidden',
        }}
      >
        <CameraView
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
          facing="back"
        />

        {/* Close button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            position: 'absolute',
            top: 16,
            left: 16,
            zIndex: 10,
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <X size={24} color={isDarkMode ? '#00bcd4' : 'white'} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onOpenCamera}
          className="size-[68px] items-center justify-center rounded-[56px]"
          style={{
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderColor: isDarkMode ? '#00bcd4' : 'white',
          }}
        >
          <CameraIcon size={32} color={isDarkMode ? '#00bcd4' : 'white'} />
        </TouchableOpacity>
        <Text
          className="mt-3 text-lg font-medium"
          style={{ color: isDarkMode ? '#00bcd4' : 'white' }}
        >
          Search with your camera
        </Text>
      </Animated.View>
    );
  },
);

export default CameraSection;
