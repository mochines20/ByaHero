import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useAnalytics() {
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [transport, setTransport] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/analytics/monthly-trend"), api.get("/analytics/by-transport")])
      .then(([trend, byTransport]) => {
        setMonthlyTrend(trend.data.data);
        setTransport(byTransport.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return { monthlyTrend, transport, loading };
}
