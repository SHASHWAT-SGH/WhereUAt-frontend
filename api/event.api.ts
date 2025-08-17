import { useAuth } from "@/context/AuthContext";
import { EventDetails } from "@/types/api/event";
import api from "@/utils/axiosInstance";

export async function fetchEvents(userId: String): Promise<EventDetails[]> {
    const response = await api.get("/api/v1/event/get-events-by-member", {
        params: {
            memberId: userId,
        },
    });

    return response.data;
      
}