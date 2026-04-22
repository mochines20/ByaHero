import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useAnalytics() {
  const [monthlyTrend, setMonthlyTrend] = useState<any[]>([]);
  const [transport, setTransport] = useState<any[]>([]);
  const [weekday, setWeekday] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/analytics/monthly-trend"), 
      api.get("/analytics/by-transport"),
      api.get("/analytics/weekday-spending")
    ])
      .then(([trend, byTransport, weekdayData]) => {
        setMonthlyTrend(trend.data.data);
        setTransport(byTransport.data.data);
        setWeekday(weekdayData.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return { monthlyTrend, transport, weekday, loading };
}
