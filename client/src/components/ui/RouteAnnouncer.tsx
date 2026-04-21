import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function RouteAnnouncer() {
  const { pathname } = useLocation();
  const liveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (liveRef.current) {
      liveRef.current.textContent = `Navigated to ${pathname.replace("/", "") || "home"}`;
    }
  }, [pathname]);

  return <div ref={liveRef} aria-live="polite" className="sr-only" />;
}
