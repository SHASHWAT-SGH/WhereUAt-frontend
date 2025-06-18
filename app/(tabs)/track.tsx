import { View, Text, StyleSheet, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import MapView, { MapPressEvent, Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function HomeScreen() {
  const { user } = useAuth();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("Location: ", location);

      setLocation(location);
    }

    getCurrentLocation();
  }, []);

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    console.log("Tapped Location: ", coordinate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <MapView
          style={styles.map}
          provider="google"
          initialRegion={
            location
              ? {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : {
                  latitude: 25.2460742,
                  longitude: 82.996315,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
          }
          showsUserLocation={true}
          showsMyLocationButton={true}
          zoomEnabled={true}
          showsCompass={true}
          showsIndoors={true}
          showsBuildings={true}
          showsScale={true}
          zoomControlEnabled={true}
          zoomTapEnabled={true}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title="Selected Location"
              description={`Lat: ${selectedLocation.latitude}, Lng: ${selectedLocation.longitude}`}
            />
          )}
        </MapView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
