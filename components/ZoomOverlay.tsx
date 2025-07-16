// ZoomOverlay.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react"; // Import useState
import { Dimensions, Pressable, StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

type Props = {
  origin: { x: number; y: number; width: number; height: number };
  onClose: () => void;
  children: React.ReactNode;
};

export default function ZoomOverlay({ origin, onClose, children }: Props) {
  const insets = useSafeAreaInsets();

  const width = useSharedValue(origin.width);
  const height = useSharedValue(origin.height);
  const top = useSharedValue(origin.y);
  const left = useSharedValue(origin.x);
  const opacity = useSharedValue(0);

  // State to manage if the component is being closed (to start exit animation)
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Animate to full screen when component mounts
    width.value = withTiming(SCREEN_WIDTH, { duration: 300 });
    height.value = withTiming(SCREEN_HEIGHT, { duration: 300 });
    top.value = withTiming(0, { duration: 300 });
    left.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });

    // The cleanup function for mounting effect - this runs when component is unmounted
    // We will use this to start the close animation if it's being unmounted
    return () => {
      // This part ensures that if the component unmounts for any reason
      // it tries to animate out. However, a cleaner way is to manage `isClosing`
      // state and trigger the animation based on that.
      // Let's modify the useEffect for cleaner entry/exit animation.
    };
  }, [origin]); // Depend only on origin for initial animation

  // New useEffect to handle closing animation
  useEffect(() => {
    if (isClosing) {
      width.value = withTiming(origin.width, { duration: 250 });
      height.value = withTiming(origin.height, { duration: 250 });
      top.value = withTiming(origin.y, { duration: 250 });
      left.value = withTiming(origin.x, { duration: 250 });
      opacity.value = withTiming(0, { duration: 250 }, (isFinished) => {
        if (isFinished) {
          // IMPORTANT: Call onClose AFTER the animation is truly finished
          runOnJS(onClose)();
        }
      });
    }
  }, [isClosing, origin, onClose]); // Depend on isClosing to trigger this effect

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
    height: height.value,
    top: top.value,
    left: left.value,
    position: "absolute",
    zIndex: 999,
    backgroundColor: "#fff",
    opacity: opacity.value,
    borderRadius: withTiming(0), // No border radius when full screen
  }));

  // Pressable to trigger the close animation
  const handlePressClose = () => {
    setIsClosing(true); // Start the closing animation
  };

  return (
    <Animated.View style={animatedStyle}>
      <View style={[styles.closeButtonContainer, { top: insets.top + 10 }]}>
        <Pressable onPress={handlePressClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} style={styles.closeText} />
        </Pressable>
      </View>
      <View style={styles.fullScreenContent}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement, {
                style: [
                  child.props.style,
                  { flex: 1, width: "100%", height: "100%" },
                ],
              })
            : child
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  closeButtonContainer: {
    position: "absolute",
    right: 20,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  closeText: {
    color: "#000",
    fontSize: 18,
  },
  fullScreenContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
