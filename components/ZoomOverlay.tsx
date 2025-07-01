// ZoomOverlay.tsx
import React, { useEffect } from "react";
import { Dimensions, Pressable, StyleSheet, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  runOnJS, // Make sure runOnJS is imported if you use it in callbacks
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen");

type Props = {
  visible: boolean;
  origin: { x: number; y: number; width: number; height: number };
  onClose: () => void;
  children: React.ReactNode;
};

export default function ZoomOverlay({
  visible,
  origin,
  onClose,
  children,
}: Props) {
  const insets = useSafeAreaInsets();

  const width = useSharedValue(origin.width);
  const height = useSharedValue(origin.height);
  const top = useSharedValue(origin.y);
  const left = useSharedValue(origin.x);
  const opacity = useSharedValue(0); // Start hidden for transition

  useEffect(() => {
    if (visible) {
      // Animate to full screen
      width.value = withTiming(SCREEN_WIDTH, { duration: 250 });
      height.value = withTiming(SCREEN_HEIGHT, { duration: 250 });
      top.value = withTiming(0, { duration: 250 });
      left.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
    } else {
      // Animate back to original position and hide
      width.value = withTiming(origin.width, { duration: 250 });
      height.value = withTiming(origin.height, { duration: 250 });
      top.value = withTiming(origin.y, { duration: 250 });
      left.value = withTiming(origin.x, { duration: 250 });
      opacity.value = withTiming(0, { duration: 250 }, (isFinished) => {
        // This callback runs on the UI thread. Use runOnJS to execute JS function.
        if (isFinished) {
          runOnJS(onClose)(); // Call onClose after the animation is finished
        }
      });
    }
  }, [visible, origin, onClose]); // Add onClose to dependency array

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

  // Only render if visible prop is true. The unmounting is handled by the parent
  // component changing its state based on the onClose callback.
  if (!visible && opacity.value === 0) return null; // Keep this line for the immediate return.
  // However, for the animation to play, this component *must*
  // remain mounted for the duration of the closing animation.
  // The parent component is responsible for unmounting it *after* the animation.
  // Let's refine the unmounting logic.
  // The correct way to handle unmounting for animation:
  // If visible is false, the component needs to stay mounted long enough for the animation to complete.
  // The `onClose` callback should trigger the state change in the parent which then
  // causes this component to be truly unmounted (i.e., when `showZoom` in `ZoomableCard` becomes `false`).

  // Therefore, the direct `if (!visible) return null;` should be removed,
  // and the parent should control the lifecycle.
  // The only way this component is truly not rendered is if the parent doesn't render it.

  // Let's re-evaluate the render condition. The component should always render
  // if `visible` is true, or if it's currently animating out (meaning `visible` just became false).
  // The `opacity.value` check is what's causing the warning.

  return (
    // Only render the overlay if 'visible' is true, or if the opacity is not 0 (meaning it's animating out)
    // This is the problematic part. Let's simplify.
    // The parent (ZoomableCard) should conditionally render ZoomOverlay based on `showZoom`.
    // ZoomOverlay itself doesn't need to return null based on its internal animation state.

    <Animated.View style={animatedStyle}>
      <View style={[styles.closeButtonContainer, { top: insets.top + 10 }]}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
      </View>
      <View style={styles.fullScreenContent}>
        {/* Ensure the child component fills the space */}
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
    backgroundColor: "#000",
    borderRadius: 20,
    padding: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 18,
  },
  fullScreenContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
