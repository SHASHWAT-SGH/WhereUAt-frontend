import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableHighlight,
  TouchableOpacity,
  View,
  Keyboard,
  KeyboardEvent,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EventCard from "@/components/EventCard";
import BottomSheet from "@/components/BottomSheet";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Location from "expo-location";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

const EventsScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isTimeModalVisible, setTimeModalIsVisible] = useState<boolean>(false);
  const [isDateModalVisible, setDateModalIsVisible] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [bottomSheetHeight, setBottomSheetHeight] = useState(0.9);

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e: KeyboardEvent) => {
        setBottomSheetHeight(0.55); // Reduce height when keyboard appears
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setBottomSheetHeight(0.9); // Reset height when keyboard hides
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
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
      {/* events */}
      {/* <View style={styles.emptyImgContainer}>
        <Image
          source={require("../../assets/images/empty-removebg-preview.png")}
          style={{ width: "60%", height: "60%", borderRadius: 16 }}
        />
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <EventCard />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setIsVisible((prev) => !prev);
        }}
      >
        <Ionicons
          name="add-circle-sharp"
          size={52}
          color="#6366f1"
          style={styles.addIcon}
        />
      </TouchableOpacity>

      {/* Bottom sheet UI */}

      <BottomSheet
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        height={bottomSheetHeight}
      >
        <ScrollView
          style={{
            flex: 1,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.formText}>Event Name</Text>
          <TextInput style={styles.inputBox} />

          <Text style={styles.formText}>Event Description</Text>
          <TextInput
            style={{ ...styles.inputBox, height: 80 }}
            multiline={true}
            numberOfLines={3}
            maxLength={200}
          />

          <Text style={styles.formText}>Event Date</Text>
          <Pressable
            style={styles.inputBox}
            onPress={() => {
              setDateModalIsVisible(true);
            }}
          >
            <Text>
              {date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </Text>
          </Pressable>

          {isDateModalVisible && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setDateModalIsVisible(false);
                if (selectedDate) {
                  setDate(selectedDate);
                }
              }}
            />
          )}

          <Text style={styles.formText}>Event Time</Text>
          <Pressable
            style={styles.inputBox}
            onPress={() => {
              setTimeModalIsVisible(true);
            }}
          >
            <Text>
              {time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </Pressable>

          {isTimeModalVisible && (
            <DateTimePicker
              value={time}
              mode="time"
              display="spinner"
              is24Hour={false}
              onChange={(event, selectedTime) => {
                setTimeModalIsVisible(false);
                if (selectedTime) {
                  setTime(selectedTime);
                }
              }}
            />
          )}

          {/* Maps */}
          <Text style={styles.formText}>Event Location</Text>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setIsVisible(false);
              // Handle form submission logic here
              console.log("Event Created");
            }}
          >
            <Text style={styles.buttonText}>Create Event</Text>
          </TouchableOpacity>
        </ScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
  },
  addIcon: {
    alignSelf: "center",
    elevation: 5,
  },
  addBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },

  emptyImgContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#6366f1",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 16,
  },
  formText: {
    fontSize: 12,
    marginBottom: 6,
    color: "#A2A2A2",
    fontWeight: "500",
  },
  inputBox: {
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },
  wrapper: {
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#red",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
