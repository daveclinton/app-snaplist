import { Camera as ExpoCamera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { Camera } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

const PermissionsScreen = ({
  handleContinue,
}: {
  handleContinue: () => void;
}) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [mediaPermission, setMediaPermission] = useState(false);

  const requestCameraPermission = async () => {
    const { status } = await ExpoCamera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  const requestMediaPermission = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    setMediaPermission(status === 'granted');
  };

  return (
    <View className="flex-1 px-6 py-8">
      {/* Header Section */}
      <View className="flex-1">
        <Text className="mb-8 text-lg text-gray-600 dark:text-gray-300">
          We gotta set up your permissions before diving in, champ! You wanna
          scan products, right? You'll need your camera for that.
        </Text>
        {/* Permissions Section */}
        <View className="space-y-4">
          {/* Camera Permission */}
          <View className="rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <View className="mb-3 flex-row items-center">
              <Camera className="size-6 text-cyan-500" />
              <Text className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                Camera Access
              </Text>
            </View>
            <Text className="mb-3 text-gray-600 dark:text-gray-300">
              Give us the green light to use your camera. It's not just for
              selfies; it's how you'll scan products in the app! You want that,
              don't you?
            </Text>
            <Pressable
              onPress={requestCameraPermission}
              className={`w-full items-center rounded-lg py-3 ${
                cameraPermission ? 'bg-green-500' : 'bg-cyan-500'
              }`}
            >
              <Text className="font-semibold text-white">
                {cameraPermission
                  ? 'Permission Granted ✓'
                  : 'Allow Camera Access'}
              </Text>
            </Pressable>
          </View>

          {/* Media Library Permission */}
          <View className="mt-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
            <View className="mb-3 flex-row items-center">
              <View className="size-6">
                <Text className="text-cyan-500">🖼️</Text>
              </View>
              <Text className="ml-2 text-lg font-semibold text-gray-900 dark:text-white">
                Photo Library Access
              </Text>
            </View>
            <Text className="mb-3 text-gray-600 dark:text-gray-300">
              We need access to your photos too! So you can share your scans and
              keep them organized. You know how it is—keeping track of
              everything is key!
            </Text>
            <Pressable
              onPress={requestMediaPermission}
              className={`w-full items-center rounded-lg py-3 ${
                mediaPermission ? 'bg-green-500' : 'bg-cyan-500'
              }`}
            >
              <Text className="font-semibold text-white">
                {mediaPermission
                  ? 'Permission Granted ✓'
                  : 'Allow Photo Library Access'}
              </Text>
            </Pressable>
          </View>
          <View className="mt-6">
            <Pressable
              onPress={handleContinue}
              disabled={!cameraPermission || !mediaPermission}
              className={`w-full items-center rounded-lg py-4 ${
                cameraPermission && mediaPermission
                  ? 'bg-cyan-500'
                  : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <Text
                className={`font-semibold ${
                  cameraPermission && mediaPermission
                    ? 'text-white'
                    : 'text-gray-500'
                }`}
              >
                Continue
              </Text>
            </Pressable>
            {(!cameraPermission || !mediaPermission) && (
              <Text className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                Hey, don't forget to grant both permissions if you wanna roll
                with us!
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default PermissionsScreen;
