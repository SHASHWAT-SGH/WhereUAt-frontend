import * as Location from "expo-location";

export interface LocationType {
  latitude: number;
  longitude: number;
}

export const reverseGeocode = async (location: LocationType | null) => {
  try {
    if(location){
      const geocode = await Location.reverseGeocodeAsync(location);
  
      if (geocode.length > 0) {
        const address = geocode[0];
        console.log("City:", address.city);
        console.log("Full Address:", address);
        return address;
      }
    }
  } catch (error) {
    console.error("Error getting address:", error);
  }
};
