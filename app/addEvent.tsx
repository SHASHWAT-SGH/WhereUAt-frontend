import ZoomOverlay from "@/components/ZoomOverlay";
import { EventFormData } from "@/types/EventFormData";
import api from "@/utils/axiosInstance";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { reverseGeocode } from "@/utils/reverseGeocode";
import AddEventView from "@/views/AddEventView";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutRectangle, StyleSheet, View } from "react-native";
import { MapPressEvent } from "react-native-maps";
import { User } from "@/types/User";
import { debounce } from "lodash";
import { useAuth } from "@/context/AuthContext";

const AddEvent = () => {
  const { user } = useAuth();

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

  const [selectedLocationAddress, setSelectedLocationAddress] = useState<
    string | null
  >(null);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [overlayData, setOverlayData] = useState<{
    origin: LayoutRectangle;
    content: React.ReactNode;
  } | null>(null);

  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);

  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    eventDescription: "",
    eventLatitude: 0,
    eventLongitude: 0,
    eventTimeStamp: new Date(),
    eventImageUrl: "",
    eventOrganizerId: user?.user.id || "",
    eventMembers: [],
  });

  const [searchedUsers, setSearchedUsers] = useState<User | null>(null);

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

    setFormData((prevData) => ({
      ...prevData,
      eventLatitude: coordinate.latitude,
      eventLongitude: coordinate.longitude,
    }));

    console.log("Tapped Location: ", coordinate);
  };

  const createEvent = async () => {
    setIsAddingEvent(true);

    const formattedData = {
      ...formData,
      eventOrganizerId: user?.user.id || "",
      eventMembersId: formData.eventMembers.map((member) => member.id),
    };
    console.log("formattedData: ", formattedData);

    try {
      const response = await api.post("/api/v1/event/create", formattedData);
      if (response.status === 201) {
        console.log("Created event: ", response.data);
      } else {
        console.error("Failed creating event:", response.statusText);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
    setIsAddingEvent(false);
  };

  const searchUser = async (query: string) => {
    if (query.length < 1) {
      setSearchedUsers(null);
      return;
    }
    try {
      const response = await api.get(`/api/v1/user/search/${query}`);
      if (response.status === 200) {
        if (response.data.length === 0) {
          setSearchedUsers(null);
        } else {
          setSearchedUsers(response.data);
        }
      } else {
        console.error("Failed to search users:", response.statusText);
        setSearchedUsers(null);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchedUsers(null);
    }
  };

  // Debounced version of searchUser
  const debouncedSearchUser = useMemo(() => debounce(searchUser, 500), []);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearchUser.cancel();
    };
  }, []);

  const handleAddUserPressed = (user: User) => {
    setFormData((prevData) => ({
      ...prevData,
      eventMembers: [...prevData.eventMembers, user],
    }));
  };

  useEffect(() => {
    const handleGetSelectedLocationAddress = async () => {
      try {
        const address = await reverseGeocode(selectedLocation);
        if (address) {
          const formattedAddress = address.formattedAddress;
          setSelectedLocationAddress(formattedAddress);
        }
      } catch (error: any) {}
    };

    handleGetSelectedLocationAddress();
  }, [selectedLocation]);

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
        createEvent={createEvent}
        isAddingEvent={isAddingEvent}
        formData={formData}
        setFormData={setFormData}
        selectedLocationAddress={selectedLocationAddress}
        searchUser={debouncedSearchUser}
        searchedUsers={searchedUsers}
        handleAddUserPressed={handleAddUserPressed}
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
