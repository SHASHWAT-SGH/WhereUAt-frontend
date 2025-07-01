// ZoomableCard.tsx
import React, { useRef } from "react";
import {
  View,
  UIManager,
  findNodeHandle,
  LayoutRectangle,
  TouchableWithoutFeedback,
} from "react-native";

type Props = {
  children: React.ReactNode;
  // New prop: Callback to request showing the full-screen overlay
  onZoomRequest: (origin: LayoutRectangle, content: React.ReactNode) => void;
};

export default function ZoomableCard({ children, onZoomRequest }: Props) {
  const viewRef = useRef<View>(null);

  const measureAndZoom = () => {
    const node = findNodeHandle(viewRef.current);
    if (node) {
      UIManager.measureInWindow(node, (x, y, width, height) => {
        // When tapped, request the parent to show the overlay
        onZoomRequest({ x, y, width, height }, children);
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={measureAndZoom}>
      <View ref={viewRef}>{children}</View>
    </TouchableWithoutFeedback>
  );
}
