import EventsView from "@/views/EventsView";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Keyboard, KeyboardEvent, StyleSheet } from "react-native";
import { MapPressEvent } from "react-native-maps";
import api from "@/utils/axiosInstance";
import Header from "@/components/Header";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { getNoEventsFoundTag } from "@/utils/getNoEventsFoundTags";

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

  const [noEventsFoundTag, setNoEventsFoundTag] = useState(
    getNoEventsFoundTag()
  );

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/v1/event/get-all-events");
      if (response.status === 200) {
        setEvents(response.data);
        console.log("Fetched Events: ", response.data);
      } else {
        console.error("Failed to fetch events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleGetLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setLocation(location);
        console.log("location", location);
      } catch (error: any) {
        setErrorMsg(error.message);
        console.error("Location Error:", error.message);
      }
    };

    handleGetLocation();
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
    <>
      <Header location={location} />
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
        noEventsFoundTag={noEventsFoundTag}
        setNoEventsFoundTag={setNoEventsFoundTag}
      />
    </>
  );
};

export default EventsScreen;
