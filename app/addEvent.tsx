import ZoomOverlay from "@/components/ZoomOverlay";
import AddEventView from "@/views/AddEventView";
import * as Location from "expo-location";
import React, { useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
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

  const [overlayData, setOverlayData] = useState<{
    origin: LayoutRectangle;
    content: React.ReactNode;
  } | null>(null);

  const handleZoomRequest = (
    origin: LayoutRectangle,
    content: React.ReactNode
  ) => {
    setOverlayData({ origin, content });
  };

  const handleCloseOverlay = () => {
    // This function is now called by ZoomOverlay *after* its exit animation completes.
    setOverlayData(null); // This will then unmount the ZoomOverlay
  };

  const handleMapPress = (event: MapPressEvent) => {
    const { coordinate } = event.nativeEvent;
    setSelectedLocation({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
    console.log("Tapped Location: ", coordinate);
  };

  return (
    <View style={{ flex: 1 }}>
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
        onZoomRequest={handleZoomRequest}
      />
      {overlayData && (
        <ZoomOverlay origin={overlayData.origin} onClose={handleCloseOverlay}>
          {overlayData.content}
        </ZoomOverlay>
      )}
    </View>
  );
};

export default AddEvent;
