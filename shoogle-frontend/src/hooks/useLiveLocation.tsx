import { useEffect, useState } from "react";

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export function useLiveLocation() {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(loc => ({
        ...loc,
        error: "Geolocation is not supported by your browser.",
      }));
      return;
    }

    const handleSuccess = (pos: GeolocationPosition) => {
      setLocation({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        error: null,
      });
    };

    const handleError = (err: GeolocationPositionError) => {
      setLocation(loc => ({
        ...loc,
        error: err.message,
      }));
    };

    // Get initial position & subscribe to updates
    const watcher = navigator.geolocation.watchPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
    });

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, []);

  return location;
}
