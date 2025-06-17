import React from "react";
import { Modal, StyleSheet, View, Pressable, Dimensions } from "react-native";

interface Props {
  isVisible: boolean;
  setIsVisible: (val: boolean) => void;
  children?: React.ReactNode;
  height?: number; // Optional height prop to customize the bottom sheet height
}

const BottomSheet: React.FC<Props> = ({
  isVisible,
  setIsVisible,
  children,
  height = 0.5, // Default height is 50% of the screen height
}) => {
  const screenHeight = Dimensions.get("window").height;
  // Clamp height value between 0 and 1
  const sheetHeight =
    height > 1 ? screenHeight : height < 0 ? 0 : height * screenHeight;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={() => setIsVisible(false)}
      statusBarTranslucent={true}
      hardwareAccelerated={true}
    >
      <View style={styles.modalOverlay}>
        {/* Tap outside to close */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsVisible(false)}
        />

        {/* Bottom Sheet Content */}
        <View style={[styles.modalContent, { height: sheetHeight }]}>
          <View style={styles.dragHandle} />
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default BottomSheet;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
});
