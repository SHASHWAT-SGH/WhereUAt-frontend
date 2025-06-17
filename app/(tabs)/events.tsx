import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import EventCard from "@/components/EventCard";
import BottomSheet from "@/components/BottomSheet";

const EventsScreen = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  return (
    <SafeAreaView style={styles.container}>
      {/* events */}
      {/* <View style={styles.emptyImgContainer}>
        <Image
          source={require("../../assets/images/empty-removebg-preview.png")}
          style={{ width: "60%", height: "60%", borderRadius: 16 }}
        />
      </View> */}

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <EventCard />
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => {
          setIsVisible((prev) => !prev);
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
      <BottomSheet
        isVisible={isVisible}
        setIsVisible={setIsVisible}
        height={0.8}
      >
        <View style={styles.bottomSheetContainer}>
          <Text style={styles.formText}>Event Name</Text>
          <TextInput style={styles.inputBox} />

          <Text style={styles.formText}>Event Description</Text>
          <TextInput
            style={{ ...styles.inputBox, height: 80 }}
            multiline={true}
            numberOfLines={3}
            maxLength={200}
          />
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7ff",
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
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
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
  },
  bottomSheetContainer: {
    flex: 1,
    padding: 16,
  },
  formText: {
    fontSize: 12,
    marginBottom: 6,
    color: "#A2A2A2",
    fontWeight: "500",
  },
  inputBox: {
    height: 40,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: "#FFFFFF",
    fontSize: 14,
    color: "#111827",
    marginBottom: 10,
  },
});
