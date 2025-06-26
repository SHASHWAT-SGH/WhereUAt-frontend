import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";

interface FadedLineTextProps {
  text: string;
}

const FadedLineText: React.FC<FadedLineTextProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <ExpoLinearGradient
        colors={["transparent", "#999"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
      <Text style={styles.text}>{text}</Text>
      <ExpoLinearGradient
        colors={["#999", "transparent"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.line}
      />
    </View>
  );
};

export default FadedLineText;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  line: {
    flex: 1,
    height: 1,
  },
  text: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "500",
    color: "black",
  },
});
