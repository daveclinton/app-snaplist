import { colorScheme, useColorScheme } from "nativewind";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SELECTED_THEME = "SELECTED_THEME";
export type ColorSchemeType = "light" | "dark" | "system";

/**
 * This hook should only be used while selecting the theme.
 * This hook will return the selected theme which is stored in AsyncStorage.
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'.
 * Don't use this hook if you want to use it to style your component based on the theme. Use useColorScheme from nativewind instead.
 */
export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme();
  const [theme, setTheme] = React.useState<ColorSchemeType>("system");

  React.useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(SELECTED_THEME);
        if (storedTheme !== null) {
          setTheme(storedTheme as ColorSchemeType);
          setColorScheme(storedTheme as ColorSchemeType);
        }
      } catch (e) {
        console.error("Failed to load theme.", e);
      }
    };

    loadTheme();
  }, [setColorScheme]);

  const setSelectedTheme = React.useCallback(
    async (t: ColorSchemeType) => {
      try {
        await AsyncStorage.setItem(SELECTED_THEME, t);
        setTheme(t);
        setColorScheme(t);
      } catch (e) {
        console.error("Failed to set theme.", e);
      }
    },
    [setColorScheme]
  );

  const selectedTheme = theme;
  return { selectedTheme, setSelectedTheme } as const;
};

// To be used in the root file to load the selected theme from AsyncStorage
export const loadSelectedTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(SELECTED_THEME);
    if (theme !== null) {
      console.log("theme", theme);
      colorScheme.set(theme as ColorSchemeType);
    }
  } catch (e) {
    console.error("Failed to load theme from storage.", e);
  }
};
