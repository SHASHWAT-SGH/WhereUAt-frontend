import { useAuth } from "@/context/AuthContext";
import { EventDetails, EventMember } from "@/types/api/event";
import { JoinStatus } from "@/types/enums/JoinStatus";
import { reverseGeocode } from "@/utils/reverseGeocode";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

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

interface props {
  event: EventDetails;
  joinEvent: () => void;
}

const EventCard = ({ event, joinEvent }: props) => {
  const { user } = useAuth();

  const [address, setAddress] = useState<string>("...");
  const [hasJoined, setHasJoined] = useState<JoinStatus | null>(
    JoinStatus.PENDING
  );

  // update location of event when coordinates of event changes
  useEffect(() => {
    let isMounted = true;
    const fetchAddress = async () => {
      if (event.event.eventLocation) {
        const result = await reverseGeocode({
          latitude: event.event.eventLocation.coordinates[1],
          longitude: event.event.eventLocation.coordinates[0],
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
  }, [event.event.eventLocation]);

  // check if this user has joined the event : set its status
  useEffect(() => {
    const _user = event.members?.find(
      (member: EventMember) => member.userId === user?.user.id
    );
    setHasJoined(_user ? _user.status : null);
  }, [event.members, user?.user.id]);

  return (
    <View style={styles.eventCard}>
      {user?.user.id === event.organizer?.userId && (
        <View style={styles.organizer}>
          <Text style={styles.hostText}>Host</Text>
        </View>
      )}
      <View style={styles.imgContainer}>
        {event.event.eventImageUrl == "" ? (
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
              uri: event.event.eventImageUrl,
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
            {`${new Date(event.event.eventTimeStamp).getDate()}`.padStart(
              2,
              "0"
            )}
          </Text>
          <Text style={styles.calenderMonth}>
            {new Date(event.event.eventTimeStamp).toLocaleString("default", {
              month: "short",
            })}
          </Text>
        </View>
        <View style={styles.userIconContainer}>
          {event.members &&
            event.members
              .slice(0, 4)
              .map((member, index) => <EventMemberIcon key={index} />)}

          <Text style={styles.userCountText}>
            {event.members && event.members.length > 4
              ? `+${event.members.length - 4} others`
              : ""}
          </Text>
        </View>
      </View>

      <Text style={styles.heading}>{event.event.eventName}</Text>
      <Text style={styles.description}>{event.event.eventDescription}</Text>

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
          {new Date(event.event.eventTimeStamp)
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

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 4,
        }}
      >
        {/* Join Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#6366f1",
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
            width:
              hasJoined === JoinStatus.JOINED
                ? "94%"
                : hasJoined === JoinStatus.DECLINED
                ? "6%"
                : "48%",
            opacity: hasJoined === JoinStatus.DECLINED ? 0.8 : 1,
          }}
          onPress={joinEvent}
          disabled={hasJoined !== JoinStatus.PENDING}
        >
          {(hasJoined === JoinStatus.PENDING ||
            hasJoined === JoinStatus.JOINED) && (
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {hasJoined === JoinStatus.JOINED ? "Joined" : "Join"}
            </Text>
          )}
        </TouchableOpacity>

        {/* Decline Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#e04e43",
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: "center",
            marginTop: 8,
            width:
              hasJoined === JoinStatus.DECLINED
                ? "94%"
                : hasJoined === JoinStatus.JOINED
                ? "6%"
                : "48%",
            opacity: hasJoined === JoinStatus.JOINED ? 0.8 : 1,
          }}
          onPress={() => console.log("Decline Event Pressed")}
          disabled={hasJoined !== JoinStatus.PENDING}
        >
          {(hasJoined == JoinStatus.PENDING ||
            hasJoined === JoinStatus.DECLINED) && (
            <Text style={{ color: "white", fontWeight: "bold" }}>
              {hasJoined === JoinStatus.DECLINED ? "Declined" : "Decline"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
  organizer: {
    backgroundColor: "#2a990b",
    padding: 4,
    position: "absolute",
    right: 14,
    top: 14,
    zIndex: 1,
    borderRadius: 6,
    borderTopRightRadius: 10,
  },
  hostText: {
    color: "white",
    fontWeight: "300",
    fontSize: 12,
  },
});
