export function Lightbox({ url, onClose }: { url: string | null; onClose: () => void }) {
  if (!url) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={onClose}>
      <img src={url} alt="Receipt preview" className="max-h-[90vh] max-w-full rounded-lg" />
    </div>
  );
}
