import { createEvent } from "@/api/event.api";
import { searchUsers } from "@/api/user.api";
import ZoomOverlay from "@/components/ZoomOverlay";
import { useAuth } from "@/context/AuthContext";
import { eventFormReducer } from "@/reducers/eventFormReducer";
import { CreateEventDTO } from "@/types/api/event";
import { UserSearchedDTO } from "@/types/api/user";
import { EventFormState, initialFormState } from "@/types/EventFormState";
import { User } from "@/types/User";
import api from "@/utils/axiosInstance";
import { LocationType, reverseGeocode } from "@/utils/reverseGeocode";
import AddEventView from "@/views/AddEventView";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { debounce } from "lodash";
import React, { useEffect, useMemo, useReducer, useState } from "react";
import { LayoutRectangle, View } from "react-native";
import { MapPressEvent } from "react-native-maps";
import { Toast } from "expo-react-native-toastify";

const AddEvent = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [formState, dispatch] = useReducer(eventFormReducer, initialFormState);

  const [isTimeModalVisible, setTimeModalIsVisible] = useState<boolean>(false);
  const [isDateModalVisible, setDateModalIsVisible] = useState<boolean>(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [overlayData, setOverlayData] = useState<{
    origin: LayoutRectangle;
    content: React.ReactNode;
  } | null>(null);

  const [isAddingEvent, setIsAddingEvent] = useState<boolean>(false);

  const [searchedUsers, setSearchedUsers] = useState<UserSearchedDTO[] | null>(
    null
  );

  const handleChange = (field: keyof EventFormState, value: any) => {
    dispatch({ type: "UPDATE_FIELD", field, value });
  };

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
    handleChange("eventLatitude", coordinate.latitude);
    handleChange("eventLongitude", coordinate.longitude);

    console.log("Tapped Location: ", coordinate);
  };

  const getEventDateTime = (date: Date, time: Date): Date => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(time.getSeconds());
    combined.setMilliseconds(time.getMilliseconds());
    return combined;
  };

  const handleCreateEvent = async () => {
    setIsAddingEvent(true);
    let eventTimeStamp = getEventDateTime(
      formState.eventDate,
      formState.eventTime
    );

    const createEventDTO: CreateEventDTO = {
      eventName: formState.eventName,
      eventDescription: formState.eventDescription,
      eventLatitude: formState.eventLatitude || 0,
      eventLongitude: formState.eventLongitude || 0,
      eventTimeStamp: eventTimeStamp,
      eventImageUrl: formState.eventImageUrl,
      eventOrganizerId: user?.user.id || "",
      eventMembersId: formState.eventMembers.map((member) => member.id),
    };

    try {
      const response = await createEvent(createEventDTO);
      if (response) {
        console.log("Event created successfully:", response);
        // Reset form state after successful event creation
        dispatch({ type: "RESET" });
        // navigate to event events page
        router.back();
        Toast.success("Event created successfully.");
      } else {
        console.error("Failed to create event");
        Toast.error("Failed to create event.");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      Toast.error("Failed to create event.");
    }
    setIsAddingEvent(false);
  };

  const handleSearchUser = async (query: string) => {
    if (query.length < 1) {
      setSearchedUsers(null);
      return;
    }
    try {
      const data = await searchUsers(query);
      if (data) {
        if (data.length === 0) {
          setSearchedUsers(null);
        } else {
          setSearchedUsers(data);
        }
      } else {
        console.error("Failed to search users:");
        setSearchedUsers(null);
      }
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchedUsers(null);
    }
  };

  // Debounced version of searchUser
  const debouncedSearchUser = useMemo(
    () => debounce(handleSearchUser, 500),
    []
  );

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedSearchUser.cancel();
    };
  }, []);

  const handleAddUserPressed = (user: UserSearchedDTO) => {
    if (formState.eventMembers.some((member) => member.id === user.id)) {
      return;
    }
    handleChange("eventMembers", [...formState.eventMembers, user]);
  };

  useEffect(() => {
    const handleGetSelectedLocationAddress = async () => {
      try {
        const selectedLocation: LocationType = {
          latitude: formState.eventLatitude || 0,
          longitude: formState.eventLongitude || 0,
        };

        const address = await reverseGeocode(selectedLocation);
        if (address) {
          const formattedAddress = address.formattedAddress;
          handleChange("selectedLocationAddress", formattedAddress);
        }
      } catch (error: any) {}
    };

    handleGetSelectedLocationAddress();
  }, [formState.eventLatitude, formState.eventLongitude]);

  return (
    <View style={{ flex: 1 }}>
      <AddEventView
        handleChange={handleChange}
        setDateModalIsVisible={setDateModalIsVisible}
        setTimeModalIsVisible={setTimeModalIsVisible}
        isDateModalVisible={isDateModalVisible}
        isTimeModalVisible={isTimeModalVisible}
        formState={formState}
        handleZoomRequest={handleZoomRequest}
        handleMapPress={handleMapPress}
        handleSearchUser={debouncedSearchUser}
        searchedUsers={searchedUsers}
        handleAddUserPressed={handleAddUserPressed}
        isAddingEvent={isAddingEvent}
        setIsAddingEvent={setIsAddingEvent}
        handleCreateEvent={handleCreateEvent}
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
