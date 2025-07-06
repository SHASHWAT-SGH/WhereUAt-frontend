import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import React from "react";

type Props = {
  name: string;
  email: string;
  imageUri: string;
  isSelected: boolean;
  onPress?: () => void; // Optional prop for future use
};

const AddedUser = ({ name, email, imageUri, isSelected, onPress }: Props) => {
  console.log(isSelected);

  return (
    <Pressable
      style={[styles.card, isSelected ? { backgroundColor: "#dee7fc" } : null]}
      onPress={onPress || (() => {})}
    >
      <Image source={{ uri: imageUri }} style={styles.avatar} />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.email} numberOfLines={1}>
          {email}
        </Text>
      </View>
    </Pressable>
  );
};

export default AddedUser;

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: "#e2e8f0",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 2,
  },
});
