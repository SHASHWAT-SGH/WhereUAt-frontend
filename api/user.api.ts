import { UserSearchedDTO } from "@/types/api/user";
import api from "@/utils/axiosInstance";

export async function searchUsers(query: string): Promise<UserSearchedDTO[]> {
    const response = await api.get("/api/v1/user/search", {
        params: {
            searchText:query,
        },
    });
    return response.data;
}
