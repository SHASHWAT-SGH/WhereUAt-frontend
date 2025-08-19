import AddedUser from "@/components/AddedUser";
import FadedLineText from "@/components/FadedLineText";
import ZoomableCard from "@/components/ZoomableCard";
import { useLocation } from "@/context/LocationContext";
import { UserSearchedDTO } from "@/types/api/user";
import { EventFormState } from "@/types/EventFormState";
import DateTimePicker from "@react-native-community/datetimepicker";
import React from "react";
import {
  ActivityIndicator,
  LayoutRectangle,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { MapPressEvent, Marker } from "react-native-maps";

interface props {
  handleChange: (field: keyof EventFormState, value: any) => void;
  setDateModalIsVisible: (visible: boolean) => void;
  setTimeModalIsVisible: (visible: boolean) => void;
  isTimeModalVisible: boolean;
  isDateModalVisible: boolean;
  formState: EventFormState;
  handleZoomRequest: (
    origin: LayoutRectangle,
    content: React.ReactNode
  ) => void;
  handleMapPress: (event: MapPressEvent) => void;
  handleSearchUser: (query: string) => void;
  searchedUsers: UserSearchedDTO[] | null;
  handleAddUserPressed: (user: UserSearchedDTO) => void;
  isAddingEvent: boolean;
  setIsAddingEvent: (isAdding: boolean) => void;
  handleCreateEvent: () => void;
}

const AddEventView = ({
  handleChange,
  setDateModalIsVisible,
  setTimeModalIsVisible,
  isTimeModalVisible,
  isDateModalVisible,
  formState,
  handleZoomRequest,
  handleMapPress,
  handleSearchUser,
  searchedUsers,
  handleAddUserPressed,
  isAddingEvent,
  setIsAddingEvent,
  handleCreateEvent,
}: props) => {
  const { location } = useLocation();
  return (
    <>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "white",
          padding: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.formText}>Event Name</Text>
        <TextInput
          style={styles.inputBox}
          onChangeText={(text) => {
            handleChange("eventName", text);
          }}
        />
        <Text style={styles.formText}>Event Description</Text>
        <TextInput
          style={{ ...styles.inputBox, height: 80 }}
          multiline={true}
          numberOfLines={3}
          maxLength={200}
          onChangeText={(text) => {
            handleChange("eventDescription", text);
          }}
        />
        <Text style={styles.formText}>Event Date</Text>
        <Pressable
          style={styles.inputBox}
          onPress={() => {
            setDateModalIsVisible(true);
          }}
        >
          <Text>
            {formState.eventDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })}
          </Text>
        </Pressable>
        {isDateModalVisible && (
          <DateTimePicker
            value={formState.eventDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setDateModalIsVisible(false);
              if (selectedDate) {
                handleChange("eventDate", selectedDate);
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
            {formState.eventTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </Text>
        </Pressable>
        {isTimeModalVisible && (
          <DateTimePicker
            value={formState.eventTime}
            mode="time"
            display="spinner"
            is24Hour={false}
            onChange={(event, selectedTime) => {
              setTimeModalIsVisible(false);
              if (selectedTime) {
                handleChange("eventTime", selectedTime);
              }
            }}
          />
        )}
        {/* Maps */}
        <View style={{ flexDirection: "row", gap: 6 }}>
          <Text style={styles.formText}>
            Event Location {formState.selectedLocationAddress ? ":" : ""}
          </Text>
          <Text style={styles.formText}>
            {formState.selectedLocationAddress || ""}
          </Text>
        </View>
        {/* Use the updated ZoomableCard */}
        <ZoomableCard onZoomRequest={handleZoomRequest}>
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
            zoomTapEnabled={true}
            onPress={handleMapPress}
          >
            {formState.eventLatitude && formState.eventLongitude && (
              <Marker
                coordinate={{
                  latitude: formState.eventLatitude,
                  longitude: formState.eventLongitude,
                }}
                title="Selected Location"
                description={`Lat: ${formState.eventLatitude}, Lng: ${formState.eventLongitude}`}
              />
            )}
          </MapView>
        </ZoomableCard>
        {/* ---------- Add People ----------------------- */}
        <Text style={styles.formText}>Add People</Text>
        <TextInput
          style={styles.inputBox}
          placeholder="Enter email or username"
          placeholderTextColor="#A2A2A2"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(text) => {
            handleSearchUser(text);
          }}
        />
        {searchedUsers && searchedUsers.length > 0 ? (
          searchedUsers.map((user: UserSearchedDTO) => (
            <AddedUser
              key={user.id}
              name={user.firstName + " " + user.lastName}
              email={user.userEmail}
              imageUri={
                user.profileImageUrl ||
                "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
              }
              isSelected={formState.eventMembers.some(
                (member) => member.id === user.id
              )}
              onPress={() => handleAddUserPressed(user)}
            />
          ))
        ) : (
          <Text style={{ color: "#A2A2A2" }}>No users found</Text>
        )}
        <FadedLineText text="Selected Users" />
        <View style={{ gap: 10, marginTop: 10 }}>
          {formState.eventMembers.map((user: UserSearchedDTO) => (
            <AddedUser
              key={user.id}
              name={user.firstName + " " + user.lastName}
              email={user.userEmail}
              imageUri={
                user.profileImageUrl ||
                "https://cdn-icons-png.flaticon.com/512/9187/9187604.png"
              }
              isSelected={formState.eventMembers.some(
                (member) => member.id === user.id
              )}
              onPress={() => handleAddUserPressed(user)}
            />
          ))}
        </View>

        {/* ---------- Add People ----------------------- */}
        <TouchableOpacity
          style={styles.button}
          disabled={isAddingEvent}
          onPress={() => {
            // Handle form submission logic here
            handleCreateEvent();
            console.log("Event Created");
          }}
        >
          {isAddingEvent ? (
            <ActivityIndicator color={"white"} size={16} />
          ) : (
            <Text style={styles.buttonText}>Create Event</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

export default AddEventView;

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: "#6366f1",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  buttonText: {
    color: "white",
  },
  formText: {
    fontSize: 12,
    marginBottom: 6,
    // color: "#A2A2A2",
    color: "black",
    fontWeight: "500",
  },
  inputBox: {
    height: 40,
    borderWidth: 1,
    borderColor: "#d3d5db",
    borderRadius: 4,
    paddingHorizontal: 8,
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },
  wrapper: {
    // height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    overflow: "hidden",
  },
  map: { width: "100%", height: 100, marginBottom: 10 },
});
