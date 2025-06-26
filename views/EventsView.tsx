import BottomSheetAddEvent from "@/components/BottomSheetAddEvent";
import EventCard from "@/components/EventCard";
import FadedLineText from "@/components/FadedLineText";
import FilterBar from "@/components/FilterBar";
import { Ionicons } from "@expo/vector-icons";
import { LocationObject } from "expo-location";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { MapPressEvent } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
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
  bottomSheetHeight: number;
  setBottomSheetHeight: (height: number) => void;
  events: any;
}

const EventsView = ({
  isVisible,
  setIsVisible,
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
  bottomSheetHeight,
  setBottomSheetHeight,
  events,
}: props) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* events */}

      <FadedLineText text="All Events" />
      <FilterBar />

      {!events || events.length === 0 ? (
        <>
          <View style={styles.emptyImgContainer}>
            <Image
              source={require("@/assets/images/no-event.png")}
              resizeMode="contain"
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
        </>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <EventCard />
            </View>
          </ScrollView>
        </>
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setIsVisible(!isVisible);
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
      <BottomSheetAddEvent
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        bottomSheetHeight={bottomSheetHeight}
        setBottomSheetHeight={setBottomSheetHeight}
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
    </SafeAreaView>
  );
};

export default EventsView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    paddingTop: 6,
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
});
