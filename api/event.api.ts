import { useAuth } from "@/context/AuthContext";
import { CreateEventDTO, EventDetails } from "@/types/api/event";
import { EventFormState } from "@/types/EventFormState";
import api from "@/utils/axiosInstance";

export async function fetchEvents(userId: String): Promise<EventDetails[]> {
    const response = await api.get("/api/v1/event/get-events-by-member", {
        params: {
            memberId: userId,
        },
    });
    return response.data;
}

export async function createEvent(eventData: CreateEventDTO): Promise<EventDetails> {
    const response = await api.post("/api/v1/event/create", eventData);
    return response.data;

}