import BackgroundService from "react-native-background-actions";
import * as Location from "expo-location";


// Define your task
const liveLocationTask = async () => {

  try {
    while (BackgroundService.isRunning()) {
      // Get current location
      const { coords } = await Location.getCurrentPositionAsync({});
      
      // Send to backend via socket
     

      console.log("Location sent:", coords);

      // Sleep for 10 seconds (adjust as needed)
      await new Promise(resolve => setTimeout(resolve, 10000));
    }
  } catch (err) {
    console.error("Error in background task:", err);
  }
};

const startLiveLocationSharing = async (eventId: string) => {
  const options = {
    taskName: "WhereUAt Location",
    taskTitle: "Sharing Live Location",
    taskDesc: "Your live location is being shared for this event.",
    taskIcon: {
      name: "ic_launcher",
      type: "mipmap",
    },
    color: "#ff0000",
    parameters: { eventId },
    linkingURI: "whereuat://event", // optional deep link
  };

  await BackgroundService.start(liveLocationTask, options);
};

export const scheduleLiveLocation = (event: any) => {
  const triggerTime = new Date().getTime() + 60 * 1000; // Schedule for 1 minute later
  const now = Date.now();

  console.log("Scheduling live location for event:", event.id, "at", new Date(triggerTime).toISOString());

  if (triggerTime > now) {
    const delay = triggerTime - now;
    setTimeout(() => startLiveLocationSharing(event.id), delay);
  } else {
    startLiveLocationSharing(event.id);
  }
};
