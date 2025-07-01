import AddEventView from "@/views/AddEventView";
import * as Location from "expo-location";
import React, { useState } from "react";
import { StyleSheet } from "react-native";
import { MapPressEvent } from "react-native-maps";

const AddEvent = () => {
  const [isTimeModalVisible, setTimeModalIsVisible] = useState<boolean>(false);
  const [isDateModalVisible, setDateModalIsVisible] = useState<boolean>(false);
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState<Date>(new Date());
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    console.log("Tapped Location: ", coordinate);
  };

  return (
    <AddEventView
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
    />
  );
};

export default AddEvent;

const styles = StyleSheet.create({});
