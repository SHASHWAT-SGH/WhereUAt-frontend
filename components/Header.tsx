import { Image, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";
import { reverseGeocode } from "@/utils/reverseGeocode";
import * as Location from "expo-location";
import { User } from "@react-native-google-signin/google-signin";

interface props {
  location: Location.LocationObject | null;
}

const Header = ({ location }: props) => {
  const { user } = useAuth();
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    const handleReverseGeoCode = async () => {
      if (location) {
        const addr = await reverseGeocode({
          latitude: location?.coords.latitude,
          longitude: location?.coords.longitude,
        });
        setAddress(addr);
      }
    };

    handleReverseGeoCode();
  }, [location]);

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={20} color={"black"} />
        <View style={styles.locationTextWrapper}>
          <View style={styles.firstRow}>
            <Text style={styles.locationText}>{address?.name || "..."}</Text>

            <Ionicons
              name="chevron-down"
              size={10}
              color={"black"}
              style={{ marginTop: 2, marginLeft: 4 }}
            />
          </View>
          <Text style={styles.locationCityText}>{address?.city || "..."}</Text>
        </View>
      </View>

      {/* right container */}
      <View style={styles.rightContainer}>
        <Ionicons name="qr-code-outline" size={22} color={"black"} />
        <View>
          {user?.user.photo ? (
            <Image
              source={{ uri: user.user.photo }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.user.name ? user.user.name[0].toUpperCase() : "U"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  locationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  locationTextWrapper: {
    marginLeft: 6,
  },
  locationText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  locationCityText: {
    fontSize: 12,
    marginTop: -2,
  },
  firstRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#e0e7ff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6366f1",
  },
});
