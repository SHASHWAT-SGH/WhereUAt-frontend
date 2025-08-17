import EventCard from "@/components/EventCard";
import FadedLineText from "@/components/FadedLineText";
import FilterBar from "@/components/FilterBar";
import { getNoEventsFoundTag } from "@/utils/getNoEventsFoundTags";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EventDetails } from "@/types/api/event";

interface props {
  events: EventDetails[] | null;
  noEventsFoundTag: String;
  setNoEventsFoundTag: (fun: any) => void;
  refreshing: boolean;
  onRefresh: () => void;
  joinEvent: (eventId: string) => void;
}

const EventsView = ({
  events,
  noEventsFoundTag,
  setNoEventsFoundTag,
  refreshing,
  onRefresh,
  joinEvent,
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

      {/* if there is no events, show no events found tag */}
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ flex: 1 }}>
              {events.map((event: EventDetails, idx: number) => (
                <EventCard
                  key={event.event.id || idx}
                  event={event}
                  joinEvent={() => joinEvent(event.event.id)}
                />
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
    backgroundColor: "white",
    borderRadius: 50,
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
