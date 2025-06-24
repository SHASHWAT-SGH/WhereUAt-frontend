import EventsView from "@/views/EventsView";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, StyleSheet } from "react-native";
import { MapPressEvent } from "react-native-maps";

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
  const [events, setEvents] = useState(null);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location: Location.LocationObject =
        await Location.getCurrentPositionAsync({});
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
    <EventsView
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      isDateModalVisible={isDateModalVisible}
      setDateModalIsVisible={setDateModalIsVisible}
      date={date}
      setDate={setDate}
      isTimeModalVisible={isTimeModalVisible}
      setTimeModalIsVisible={setTimeModalIsVisible}
      time={time}
      setTime={setTime}
      handleMapPress={handleMapPress}
      location={location}
      selectedLocation={selectedLocation}
      bottomSheetHeight={bottomSheetHeight}
      setBottomSheetHeight={setBottomSheetHeight}
      events={events}
    />
  );
};

export default EventsScreen;
