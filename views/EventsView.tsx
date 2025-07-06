import BottomSheetAddEvent from "@/components/BottomSheetAddEvent";
import EventCard from "@/components/EventCard";
import FadedLineText from "@/components/FadedLineText";
import FilterBar from "@/components/FilterBar";
import { getNoEventsFoundTag } from "@/utils/getNoEventsFoundTags";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { LocationObject } from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MapPressEvent } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

interface props {
  events: any;
  noEventsFoundTag: String;
  setNoEventsFoundTag: (fun: any) => void;
}

const EventsView = ({
  events,
  noEventsFoundTag,
  setNoEventsFoundTag,
}: props) => {
  useEffect(() => {
    setNoEventsFoundTag(getNoEventsFoundTag());
  }, []);

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* events */}

      <FadedLineText text="All Events" />
      <FilterBar />

      {!events || events.length === 0 ? (
        <>
          <View style={styles.emptyImgContainer}>
            <Image
              source={require("@/assets/images/no-events-calender.png")}
              resizeMode="contain"
              style={{
                width: "50%",
                height: "50%",
              }}
            />
            <Text style={[styles.noEventText]}>{noEventsFoundTag}</Text>
          </View>
        </>
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              {events.map((event: any, idx: number) => (
                <EventCard key={event.id || idx} />
              ))}
            </View>
          </ScrollView>
        </>
      )}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          router.push("/addEvent");
        }}
      >
        <Ionicons
          name="add-circle-sharp"
          size={52}
          color="#6366f1"
          style={styles.addIcon}
        />
      </TouchableOpacity>
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
    alignItems: "center",
    marginTop: 80,
  },
  noEventText: {
    fontSize: 16,
    color: "#4b5563",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 20,
  },
});
