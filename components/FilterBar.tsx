import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons"; // For dropdown icon

const filters = [
  { label: "Filters", hasDropdown: true },
  { label: "Today" },
  { label: "Tomorrow" },
  { label: "This weekend" },
];

const FilterBar = () => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity key={index} style={styles.filterBox}>
            <Text style={styles.filterText}>{filter.label}</Text>
            {filter.hasDropdown && (
              <Ionicons
                name="chevron-down"
                size={14}
                color="#555"
                style={styles.icon}
              />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FilterBar;

const styles = StyleSheet.create({
  container: {
    height: 50,
    marginVertical: 10,
  },
  scrollContainer: {
    alignItems: "center", // vertically align filter items
    paddingHorizontal: 10,
  },
  filterBox: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "white",
    borderRadius: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "black",
  },
  filterText: {
    fontSize: 14,
    color: "black",
  },
  icon: {
    marginLeft: 6,
  },
});
