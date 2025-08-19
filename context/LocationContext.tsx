import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { LocationObject, LocationGeocodedAddress } from "expo-location";
import { getCurrentLocation } from "@/utils/getCurrentLocation";
import { reverseGeocode } from "@/utils/reverseGeocode";

interface LocationContextType {
  location: LocationObject | null;
  address: LocationGeocodedAddress | null;
  loading: boolean;
  error: string | null;
  fetchLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

const LocationProvider = ({ children }: { children: ReactNode }) => {
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [address, setAddress] = useState<LocationGeocodedAddress | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      if (currentLocation) {
        const geocoded = await reverseGeocode({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        setAddress(geocoded ?? null);
      } else {
        setAddress(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch location");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch location once on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return (
    <LocationContext.Provider
      value={{ location, address, loading, error, fetchLocation }}
    >
      {children}
    </LocationContext.Provider>
  );
};

const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export { LocationProvider, useLocation };
