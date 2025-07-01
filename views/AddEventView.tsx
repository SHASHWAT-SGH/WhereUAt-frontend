import ZoomableCard from "@/components/ZoomableCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { LocationObject } from "expo-location";
import React from "react";
import {
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
  isDateModalVisible: boolean;
  setDateModalIsVisible: (visible: boolean) => void;
  date: Date;
  setDate: (date: Date) => void;
  isTimeModalVisible: boolean;
  setTimeModalIsVisible: (visible: boolean) => void;
  time: Date;
  setTime: (time: Date) => void;
  handleMapPress: (event: MapPressEvent) => void;
  location: LocationObject | null;
  selectedLocation: {
    latitude: number;
    longitude: number;
  } | null;
}

const AddEventView = ({
  isDateModalVisible,
  setDateModalIsVisible,
  date,
  setDate,
  isTimeModalVisible,
  setTimeModalIsVisible,
  time,
  setTime,
  handleMapPress,
  location,
  selectedLocation,
}: props) => {
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
          {/* <MapView
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
          </MapView> */}
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            // Handle form submission logic here
            console.log("Event Created");
          }}
        >
          <Text style={styles.buttonText}>Create Event</Text>
        </TouchableOpacity>
        <ZoomableCard>
          <MapView
            style={{ width: "100%", height: 150, borderRadius: 12 }} // Apply height here for the minimized state
            initialRegion={{
              latitude: 28.6139,
              longitude: 77.209,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </ZoomableCard>
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
  map: { width: "100%", borderRadius: 12 },
});
