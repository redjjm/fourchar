import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { colors } from "@/constants/colors";

export const unstable_settings = {
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.backgroundLight,
        },
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{ 
          title: "사자성어 퀴즈",
          headerTitleAlign: 'center',
        }} 
      />
      <Stack.Screen 
        name="quiz/[level]" 
        options={{ 
          title: "퀴즈",
          headerTitleAlign: 'center',
          headerBackTitle: "홈",
        }} 
      />
      <Stack.Screen 
        name="results" 
        options={{ 
          title: "결과",
          headerTitleAlign: 'center',
          headerBackTitle: "홈",
        }} 
      />
      <Stack.Screen 
        name="history" 
        options={{ 
          title: "기록",
          headerTitleAlign: 'center',
          headerBackTitle: "홈",
        }} 
      />
    </Stack>
  );
}