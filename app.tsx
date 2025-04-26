import { useEffect } from "react";
import { View } from "react-native";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AuthProvider } from "./context/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // You can add custom fonts here if you want
    // 'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    // 'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
  });

  useEffect(() => {
    // Hide the splash screen when fonts and resources are loaded
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <View style={{ flex: 1 }}>
        {/* Expo Router starts here */}
        <ScreensRoot />
      </View>
    </GestureHandlerRootView>
  );
}

// This registers the screens and routes
function ScreensRoot() {
  return require("./app/index");
}
