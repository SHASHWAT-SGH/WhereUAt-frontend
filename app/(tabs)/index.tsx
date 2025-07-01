import Header from "@/components/Header";
import api from "@/utils/axiosInstance";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { getNoEventsFoundTag } from "@/utils/getNoEventsFoundTags";
import EventsView from "@/views/EventsView";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";

const EventsScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [events, setEvents] = useState(null);

  const [noEventsFoundTag, setNoEventsFoundTag] = useState(
    getNoEventsFoundTag()
  );

  const fetchEvents = async () => {
    try {
      const response = await api.get("/api/v1/event/get-all-events");
      if (response.status === 200) {
        setEvents(response.data);
        console.log("Fetched Events: ", response.data);
      } else {
        console.error("Failed to fetch events:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const handleGetLocation = async () => {
      try {
        const location = await getCurrentLocation();
        setLocation(location);
        console.log("location", location);
      } catch (error: any) {
        setErrorMsg(error.message);
        console.error("Location Error:", error.message);
      }
    };

    handleGetLocation();
  }, []);

  return (
    <>
      <Header location={location} />
      <EventsView
        events={events}
        noEventsFoundTag={noEventsFoundTag}
        setNoEventsFoundTag={setNoEventsFoundTag}
      />
    </>
  );
};

export default EventsScreen;
