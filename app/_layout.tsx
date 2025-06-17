import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";

// Wrap the root layout with the AuthProvider
export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthRoot />
    </AuthProvider>
  );
}

// This component handles redirecting unauthenticated users
function AuthRoot() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if the user is authenticated
    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!user && !inAuthGroup && !inTabsGroup) {
      // router.replace("/auth/signin");
      router.replace("/(tabs)");
    } else if (user && !inTabsGroup) {
      router.replace("/(tabs)");
    }

    // if (!user && !inAuthGroup) {
    //   // Redirect to sign-in page if not authenticated
    //   router.replace("/auth/signin");
    // } else if (user && inAuthGroup) {
    //   // Redirect to main app when authenticated
    //   router.replace("/(tabs)");
    // }
  }, [user, isLoading, segments]);

  return <Slot />;
}
