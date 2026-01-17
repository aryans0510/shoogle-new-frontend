import { useEffect, useRef } from "react";
import { toast } from "@/components/ui/sonner";
import { useLocation } from "@/contexts/LocationContext";
// TODO: Create backend API for fetching sellers with location data and migrate this hook
// import api from "@/api";

// Approximate radius for proximity in meters.
const PROXIMITY_RADIUS_METERS = 100;

// Helper: Haversine formula to calculate distance.
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371000; // Earth radius in meters

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

type StoreInfo = {
  id: string;
  brand_name: string | null;
  latitude: number | null;
  longitude: number | null;
};

export function useStoreProximityNudge() {
  const { latitude, longitude } = useLocation();
  const nudgedStoresRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Don't try until user's location is available.
    if (latitude == null || longitude == null) return;

    // Fetch stores with valid location and brand name.
    async function checkStores() {
      // TODO: Create backend API for fetching sellers with location data
      // For now, this feature is disabled
      return;
    }

    // Disabled until backend API is ready
    // checkStores();
  }, [latitude, longitude]);
}
