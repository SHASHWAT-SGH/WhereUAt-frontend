import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/axiosInstance";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { getNoEventsFoundTag } from "@/utils/getNoEventsFoundTags";
import EventsView from "@/views/EventsView";
import * as Location from "expo-location";
import React, { useCallback, useEffect, useState } from "react";
import { fetchEvents } from "@/api/event.api";
import { EventDetails } from "@/types/api/event";

const EventsScreen = () => {
  const { user } = useAuth();

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [events, setEvents] = useState<EventDetails[] | null>(null);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await handleFetchEvents();
    setRefreshing(false);
  }, []);

  const [noEventsFoundTag, setNoEventsFoundTag] = useState(
    getNoEventsFoundTag()
  );

  const handleFetchEvents = async () => {
    try {
      const response = await fetchEvents(user?.user.id || "");
      setEvents(response);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const joinEvent = async (eventId: string) => {
    try {
      const res = await api.post("/api/v1/event/join-event", null, {
        params: {
          eventId: eventId,
        },
      });
      console.log("Join Event Response: ", res.data);
      if (res.status === 200) {
        // if successfully joined, refetch events
        await handleFetchEvents();
      }
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  useEffect(() => {
    handleFetchEvents();
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
        refreshing={refreshing}
        onRefresh={onRefresh}
        joinEvent={joinEvent}
      />
    </>
  );
};

export default EventsScreen;
