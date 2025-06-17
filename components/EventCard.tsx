import {
  View,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const EventMemberIcon = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 2,
        width: 28,
        height: 28,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        marginLeft: -14,
      }}
    >
      <Image
        source={require("../assets/images/user-icon.png")}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
        }}
      />
    </View>
  );
};

const EventCard = () => {
  return (
    <View style={styles.eventCard}>
      <View style={styles.imgContainer}>
        <Image
          source={require("../assets/images/event-placeholder-3.png")}
          style={{
            height: "85%",
            width: 240,
            borderRadius: 16,
            resizeMode: "cover",
          }}
        />
        <View style={styles.calender}>
          <Text style={styles.calenderDay}>08</Text>
          <Text style={styles.calenderMonth}>Oct</Text>
        </View>
        <View style={styles.userIconContainer}>
          <EventMemberIcon />
          <EventMemberIcon />
          <EventMemberIcon />
          <EventMemberIcon />
          <Text style={styles.userCountText}>+5 others</Text>
        </View>
      </View>

      <Text style={styles.heading}>Janvi's Birthday</Text>
      <Text style={styles.description}>
        Birthday Party at Janvi's place. Join us for a fun-filled day with
        friends, food, and festivities. Don't miss out on the cake.
      </Text>

      <View style={styles.infoContainer}>
        <Ionicons
          name="location-sharp"
          size={16}
          color="#6366f1"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.infoText}>Meera Colony, BHU, Varanasi</Text>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons
          name="calendar-outline"
          size={16}
          color="#6366f1"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.infoText}>
          Wednesday, October 08, 2025 · 10:00 PM
        </Text>
      </View>

      <TouchableOpacity
        style={{
          backgroundColor: "#6366f1",
          paddingVertical: 8,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 8,
        }}
        onPress={() => console.log("Join Event Pressed")}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Join Event</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    padding: 12,
  },
  imgContainer: {
    backgroundColor: "#FEF7EA",
    borderRadius: 12,
    height: 160,
    width: "100%",
    alignItems: "flex-end",
  },
  calender: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "white",
    width: 50,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calenderDay: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  calenderMonth: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#C23133",
    marginTop: -4,
  },
  userIconContainer: {
    flexDirection: "row",
    paddingLeft: 12,
    position: "absolute",
    bottom: 6,
    left: 6,
  },
  userCountText: {
    color: "black",
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 3,
    alignSelf: "center",
  },
  heading: {
    fontSize: 14,
    fontWeight: "bold",
    color: "black",
    marginTop: 8,
  },
  description: {
    fontSize: 12,
    color: "#6e6d6d",
    textAlign: "justify",
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "black",
    textAlign: "justify",
  },
});
