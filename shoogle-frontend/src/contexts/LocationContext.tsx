import React, { createContext, useContext } from "react";
import { useLiveLocation } from "@/hooks/useLiveLocation";

type LocationContextType = {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
};

const LocationContext = createContext<LocationContextType>({
  latitude: null,
  longitude: null,
  error: null,
});

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLiveLocation();
  return <LocationContext.Provider value={location}>{children}</LocationContext.Provider>;
};

export function useLocation() {
  return useContext(LocationContext);
}
