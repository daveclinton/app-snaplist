import { StatusBar } from 'expo-status-bar';
import { View, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';

type ScreenProps = {
  children: React.ReactNode;
  scrollable?: boolean;
  padded?: boolean;
  centered?: boolean;
  contained?: boolean;
};

export const Screen = ({
  children,
  scrollable = true,
  padded = true,
  centered = false,
  contained = true,
}: ScreenProps) => {
  const { width } = useWindowDimensions();
  const maxWidth = 640;
  const dynamicPadding = width < 400 ? 8 : 16;

  const Container = scrollable ? ScrollView : View;

  return (
    <SafeAreaView className="bg-background-primary flex-1">
      <StatusBar style="auto" />
      <Container
        className={`flex-1 ${padded ? `px-${dynamicPadding}` : ''}`}
        contentContainerStyle={centered ? { flexGrow: 1, justifyContent: 'center' } : {}}>
        <View
          className={`flex-1 ${centered ? 'items-center justify-center' : ''}`}
          style={
            contained
              ? {
                  maxWidth: width < maxWidth ? width : maxWidth, // Set maxWidth dynamically
                  alignSelf: 'center',
                  width: '100%',
                }
              : undefined
          }>
          {children}
        </View>
      </Container>
    </SafeAreaView>
  );
};
