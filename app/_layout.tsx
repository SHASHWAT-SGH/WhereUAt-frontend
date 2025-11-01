import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Stack } from "expo-router";
import { LocationProvider } from "@/context/LocationContext";
import ToastManager from "expo-react-native-toastify";

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { AppState } from "react-native";
import { Client } from "@stomp/stompjs";

// ---- CONFIG ----
const LOCATION_TASK = "LIVE_LOCATION_TASK";
const STOMP_URL = "wss://aaf3bcbabb7c.ngrok-free.app/ws/websocket";
// ⚠️ SockJS endpoint expands to `/ws/websocket`
const STOMP_DESTINATION = "/app/locations.update";
const INTERVAL_SECONDS = 30; // send every X seconds

// Define TS type for location message
interface LocationUpdateRequest {
  eventId: string;
  latitude: number;
  longitude: number;
}

// ---- STOMP CLIENT CREATOR ----
function createStompClient(onConnect: (client: Client) => void) {
  const client = new Client({
    brokerURL: STOMP_URL,
    reconnectDelay: 5000, // auto-reconnect
    debug: (msg) => console.log("STOMP:", msg),
    onConnect: () => onConnect(client),
  });

  return client;
}

// ---- BACKGROUND LOCATION TASK ----
TaskManager.defineTask(LOCATION_TASK, async ({ data, error }) => {
  if (error) {
    console.error("Location task error:", error);
    return;
  }
  if (data) {
    const { locations } = data as { locations: Location.LocationObject[] };
    const now = new Date();
    const hour = now.getHours();

    if (hour >= 17 && hour < 18) {
      const location = locations[0];
      if (location) {
        const payload: LocationUpdateRequest = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          eventId: "your_event_id", // Replace with actual event ID
        };

        // connect STOMP and publish
        const client = createStompClient((c) => {
          c.publish({
            destination: STOMP_DESTINATION,
            body: JSON.stringify(payload),
          });
          c.deactivate(); // disconnect after sending
        });

        client.activate();
      }
    }
  }
});

// ---- START LOCATION UPDATES ----
async function startBackgroundLocation() {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    console.log("Permission denied for location");
    return;
  }

  const bgStatus = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus.status !== "granted") {
    console.log("Background location not allowed");
    return;
  }

  const isRegistered = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK
  );
  if (!isRegistered) {
    await Location.startLocationUpdatesAsync(LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: INTERVAL_SECONDS * 1000,
      distanceInterval: 0,
      deferredUpdatesInterval: 1000,
      showsBackgroundLocationIndicator: true, // iOS
      foregroundService: {
        notificationTitle: "WhereUAt Location Sharing",
        notificationBody: "Sharing your location between 3-4 PM",
        notificationColor: "#FF0000",
      },
    });
    console.log("Background location task started");
  }
}

export default function RootLayout() {
  useEffect(() => {
    startBackgroundLocation();

    const sub = AppState.addEventListener("change", (state) => {
      if (state === "active") startBackgroundLocation();
    });

    return () => sub.remove();
  }, []);

  return (
    <AuthProvider>
      <LocationProvider>
        <ToastManager />
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
