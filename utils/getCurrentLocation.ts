import * as Location from "expo-location"


export async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Permission to access location was denied");
    }

    try {
        const location: Location.LocationObject = await Location.getCurrentPositionAsync({});
        console.log("Location:", location);
        return location;
    } catch (error) {
        throw new Error("Failed to get current location");
    }
}