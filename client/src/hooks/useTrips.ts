import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useTripStore } from "../store/tripStore";

export function useTrips() {
  const { trips, setTrips } = useTripStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/trips")
      .then((res) => setTrips(res.data.trips))
      .finally(() => setLoading(false));
  }, [setTrips]);

  return { trips, loading };
}
