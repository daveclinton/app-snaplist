/* eslint-disable react/react-in-jsx-scope */
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ThemeProvider } from "@react-navigation/native";
import { SplashScreen, Stack, useNavigationContainerRef } from "expo-router";
import { StyleSheet } from "react-native";
import FlashMessage from "react-native-flash-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export { ErrorBoundary } from "expo-router";

// Import  global CSS file
import "../global.css";
import { APIProvider } from "@/api/common/api-provider";
import { loadSelectedTheme, useSelectedTheme } from "@/core/use-selected-theme";
import { useThemeConfig } from "@/core/use-theme-config";
import { useEffect } from "react";

export const unstable_settings = {
  initialRouteName: "(app)",
};

// hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="connect-market" options={{ headerShown: false }} />
        <Stack.Screen name="create-account" options={{ headerShown: false }} />
        <Stack.Screen
          name="otp-verification"
          options={{ headerShown: false }}
        />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  const { setSelectedTheme } = useSelectedTheme();

  useEffect(() => {
    setSelectedTheme("light");
  }, [setSelectedTheme]);
  return (
    <GestureHandlerRootView style={styles.container} className={undefined}>
      <ThemeProvider value={theme}>
        <APIProvider>
          <BottomSheetModalProvider>
            {children}
            <FlashMessage position="top" />
          </BottomSheetModalProvider>
        </APIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
