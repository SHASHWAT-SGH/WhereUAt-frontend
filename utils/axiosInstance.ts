import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const SERVER_URL = Constants.expoConfig?.extra?.SERVER_URL || "";
console.log("Server URL:", SERVER_URL);

const getAccessToken = async (): Promise<string | null> => {
  const storedUser = await SecureStore.getItemAsync("OAuthTokenResponse");
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      return user?.idToken || null;
    } catch (error) {
      console.error("Error parsing stored user:", error);
    }
  }
  return null;
};

// Create Axios instance
const api = axios.create({
  baseURL: SERVER_URL,
  timeout: 10000,
});

// Attach the token to each request
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
