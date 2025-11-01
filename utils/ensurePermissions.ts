import * as Location from "expo-location";

export const ensurePermissions = async () => {
  const { status: fgStatus } = await Location.requestForegroundPermissionsAsync();
  if (fgStatus !== "granted") {
    throw new Error("Foreground location permission denied");
  }

  const { status: bgStatus } = await Location.requestBackgroundPermissionsAsync();
  if (bgStatus !== "granted") {
    throw new Error("Background location permission denied");
  }
};