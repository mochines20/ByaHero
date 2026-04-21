import { useEffect, useState } from "react";
import { Card } from "../components/ui/Card";

export function OfflinePage() {
  const [online, setOnline] = useState(navigator.onLine);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card className="rounded-3xl">
        <h1 className="text-xl font-bold text-byahero-navy sm:text-2xl">Offline-first Status</h1>
        <p className="mt-1 text-sm text-byahero-muted">Core screens stay usable and will sync when you are back online.</p>
      </Card>

      <Card className="rounded-3xl">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-byahero-navy">Connection</p>
          <span className={`rounded-full px-3 py-2 text-xs font-semibold ${online ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
            {online ? "Online" : "Offline"}
          </span>
        </div>
        <p className="mt-2 text-sm text-byahero-muted">
          Tip: When offline, you can still view cached UI and prepare entries. When online, sync happens automatically (hooks ready).
        </p>
      </Card>
    </div>
  );
}

