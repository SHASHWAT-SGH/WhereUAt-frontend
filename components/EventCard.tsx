import {
  View,
  Text,
  StyleSheet,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { EventFormData } from "@/types/EventFormData";
import { reverseGeocode } from "@/utils/reverseGeocode";

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

const EventCard = ({
  eventName,
  eventDescription,
  eventImageUrl,
  eventLatitude,
  eventLongitude,
  eventMembers,
  eventOrganizerId,
  eventTimeStamp,
}: EventFormData) => {
  const [address, setAddress] = useState<string>("...");

  useEffect(() => {
    let isMounted = true;
    const fetchAddress = async () => {
      if (eventLatitude && eventLongitude) {
        const result = await reverseGeocode({
          latitude: eventLatitude,
          longitude: eventLongitude,
        });
        if (isMounted) {
          setAddress(
            result
              ? `${result.name || ""} ${result.street || ""}, ${
                  result.city || ""
                }, ${result.region || ""}`
              : "Location not available"
          );
        }
      } else {
        setAddress("Location not available");
      }
    };
    fetchAddress();
    return () => {
      isMounted = false;
    };
  }, [eventLatitude, eventLongitude]);

  console.log("EventCard Props:", {
    eventName,
    eventDescription,
    eventImageUrl,
    eventLatitude,
    eventLongitude,
    eventMembers,
    eventOrganizerId,
    eventTimeStamp,
  });

  return (
    <View style={styles.eventCard}>
      <View style={styles.imgContainer}>
        {eventImageUrl == "" ? (
          <Image
            source={require("../assets/images/event-placeholder-3.png")}
            style={{
              height: "85%",
              width: 240,
              borderRadius: 16,
              resizeMode: "cover",
            }}
          />
        ) : (
          <Image
            source={{
              uri: eventImageUrl,
            }}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 16,
              resizeMode: "cover",
            }}
          />
        )}
        <View style={styles.calender}>
          <Text style={styles.calenderDay}>
            {`${new Date(eventTimeStamp).getDay()}`.padStart(2, "0")}
          </Text>
          <Text style={styles.calenderMonth}>
            {new Date(eventTimeStamp).toLocaleString("default", {
              month: "short",
            })}
          </Text>
        </View>
        <View style={styles.userIconContainer}>
          {eventMembers &&
            eventMembers
              .slice(0, 4)
              .map((member, index) => <EventMemberIcon key={index} />)}

          <Text style={styles.userCountText}>
            {eventMembers && eventMembers.length > 4
              ? `+${eventMembers.length - 4} others`
              : ""}
          </Text>
        </View>
      </View>

      <Text style={styles.heading}>{eventName}</Text>
      <Text style={styles.description}>{eventDescription}</Text>

      <View style={styles.infoContainer}>
        <Ionicons
          name="location-sharp"
          size={16}
          color="#6366f1"
          style={{ marginRight: 4 }}
        />

        <Text style={styles.infoText}>{address}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Ionicons
          name="calendar-outline"
          size={16}
          color="#6366f1"
          style={{ marginRight: 4 }}
        />
        <Text style={styles.infoText}>
          {new Date(eventTimeStamp)
            .toLocaleString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .replace("at", " · ")}
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
    backgroundColor: "#dee7fc",
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
