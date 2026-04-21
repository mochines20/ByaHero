import { useRef } from "react";

type Props = { onFiles: (files: FileList) => void };

export function UploadZone({ onFiles }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className="rounded-xl border-2 border-dashed border-byahero-blue/40 bg-white p-6 text-center"
      onDrop={(e) => {
        e.preventDefault();
        if (e.dataTransfer.files) onFiles(e.dataTransfer.files);
      }}
      onDragOver={(e) => e.preventDefault()}
      onClick={() => ref.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") ref.current?.click();
      }}
      aria-label="Upload receipts"
    >
      <p className="text-sm font-medium text-byahero-navy">Tap or drop files to upload receipts</p>
      <p className="text-xs text-byahero-muted">Accepted: jpg, png, webp up to 10MB</p>
      <input
        ref={ref}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) onFiles(e.target.files);
        }}
      />
    </div>
  );
}
