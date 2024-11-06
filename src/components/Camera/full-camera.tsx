import { CameraView } from 'expo-camera';
import { ImageIcon, X } from 'lucide-react-native';
import React from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

import { TouchableOpacity, View } from '@/ui';

const FullScreenCamera = React.memo(({ onClose }: { onClose: () => void }) => {
  return (
    <Animated.View
      entering={FadeIn}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
        zIndex: 1000,
      }}
    >
      {/* Top Left Close Button */}
      <TouchableOpacity
        onPress={onClose}
        style={{
          position: 'absolute',
          top: 40,
          left: 40,
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: 'rgba(255,255,255,0.3)',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1001,
        }}
      >
        <X size={24} color="white" />
      </TouchableOpacity>

      <CameraView
        style={{
          flex: 1,
        }}
        facing="back"
      />

      {/* Bottom Controls Container */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          paddingBottom: 40,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 40,
        }}
      >
        {/* Back to Gallery Button */}
        <TouchableOpacity
          onPress={onClose}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.3)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ImageIcon size={24} color="white" />
        </TouchableOpacity>

        {/* Capture Button */}
        <TouchableOpacity
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 4,
            borderColor: 'rgba(255,255,255,0.3)',
          }}
        >
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: 'white',
            }}
          />
        </TouchableOpacity>

        {/* Empty View for Layout Balance */}
        <View style={{ width: 44, height: 44 }} />
      </View>
    </Animated.View>
  );
});

export default FullScreenCamera;
