export function PhotoGrid({ receipts, onOpen }: { receipts: any[]; onOpen: (url: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
      {receipts.map((r) => (
        <button
          key={r.id}
          className="relative aspect-square overflow-hidden rounded-lg border border-byahero-light"
          onClick={() => onOpen(r.receipt.imageUrl)}
        >
          <img
            src={r.receipt.imageUrl}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/300x300?text=Receipt";
            }}
            alt={`${r.origin} to ${r.destination}`}
            className="h-full w-full object-cover"
          />
          <span className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-1 text-left text-[10px] text-white">
            {r.origin} ? {r.destination}
          </span>
        </button>
      ))}
    </div>
  );
}
