import { useEffect, useState } from "react";
import { api } from "../lib/api";

export function useReceipts() {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/trips?limit=100")
      .then((res) => setReceipts(res.data.trips.filter((t: any) => t.receipt)))
      .finally(() => setLoading(false));
  }, []);

  return { receipts, loading };
}
