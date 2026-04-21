export function RouteMap({ origin, destination }: { origin: string; destination: string }) {
  const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const canEmbed = Boolean(mapsKey && origin.trim() && destination.trim());
  const embedUrl = canEmbed
    ? `https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=transit`
    : null;

  return (
    <div className="glass-card rounded-xl p-4">
      {embedUrl ? (
        <iframe
          title="Route map"
          src={embedUrl}
          className="h-56 w-full rounded-lg border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="grid h-56 place-items-center rounded-lg bg-byahero-light/80 text-center text-sm text-byahero-muted">
          Add `VITE_GOOGLE_MAPS_API_KEY` and enter origin/destination to load live map directions.
        </div>
      )}
    </div>
  );
}
