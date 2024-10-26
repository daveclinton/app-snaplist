import { View, ActivityIndicator } from 'react-native';

export const LoadingScreen = () => (
  <View className="bg-background-primary flex-1 items-center justify-center">
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
);
