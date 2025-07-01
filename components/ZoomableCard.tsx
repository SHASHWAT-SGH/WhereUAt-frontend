// ZoomableCard.tsx
import React, { useRef, useState } from "react";
import {
  View,
  UIManager,
  findNodeHandle,
  LayoutRectangle,
  TouchableWithoutFeedback,
} from "react-native";
import ZoomOverlay from "./ZoomOverlay";

type Props = {
  children: React.ReactNode;
};

export default function ZoomableCard({ children }: Props) {
  const viewRef = useRef<View>(null);
  const [origin, setOrigin] = useState<LayoutRectangle | null>(null);
  const [showZoom, setShowZoom] = useState(false);

  const measureAndZoom = () => {
    const node = findNodeHandle(viewRef.current);
    if (node) {
      UIManager.measureInWindow(node, (x, y, width, height) => {
        setOrigin({ x, y, width, height });
        setShowZoom(true); // Show the overlay to start the zoom-in animation
      });
    }
  };

  // This function will be passed to ZoomOverlay and called after the close animation
  const handleCloseOverlay = () => {
    setShowZoom(false); // This will cause ZoomOverlay to unmount
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={measureAndZoom}>
        <View ref={viewRef}>{children}</View>
      </TouchableWithoutFeedback>

      {/* Conditionally render ZoomOverlay based on showZoom state */}
      {showZoom &&
        origin && ( // ZoomOverlay is only mounted when showZoom is true
          <ZoomOverlay
            visible={showZoom} // Pass showZoom as visible prop
            origin={origin}
            onClose={handleCloseOverlay} // Pass the handler to ZoomOverlay
          >
            {children}
          </ZoomOverlay>
        )}
    </>
  );
}
