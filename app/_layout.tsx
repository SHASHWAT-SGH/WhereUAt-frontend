import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Stack } from "expo-router";
import { LocationProvider } from "@/context/LocationContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <LocationProvider>
        <AuthRoot />
      </LocationProvider>
    </AuthProvider>
  );
}

function AuthRoot() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      router.replace("/auth/signin");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="addEvent"
        options={{
          title: "Add Event",
          headerShown: true,
          headerTitleAlign: "center",
          headerStyle: { backgroundColor: "white" },
          headerTintColor: "#212529",
        }}
      />
      {/* Add more stack-only screens here if needed */}
    </Stack>
  );
}
