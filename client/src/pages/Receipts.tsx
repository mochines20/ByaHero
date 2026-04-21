import { useState } from "react";
import { Lightbox } from "../components/receipts/Lightbox";
import { PhotoGrid } from "../components/receipts/PhotoGrid";
import { UploadZone } from "../components/receipts/UploadZone";
import { api } from "../lib/api";
import { useReceipts } from "../hooks/useReceipts";
import { useToastStore } from "../store/uiStore";

export function ReceiptsPage() {
  const { receipts } = useReceipts();
  const pushToast = useToastStore((s) => s.pushToast);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const upload = async (files: FileList) => {
    const list = Array.from(files);
    for (const file of list) {
      if (file.size > 10 * 1024 * 1024) {
        pushToast(`${file.name} exceeds 10MB limit`);
        return;
      }
    }

    for (const file of list) {
      const form = new FormData();
      form.append("file", file);
      form.append("tripId", receipts[0]?.id ?? "");
      await api.post("/receipts/upload", form, { headers: { "Content-Type": "multipart/form-data" } });
    }

    pushToast("Receipts uploaded");
    location.reload();
  };

  return (
    <div className="space-y-4">
      <UploadZone onFiles={upload} />
      <PhotoGrid receipts={receipts} onOpen={setLightbox} />
      <Lightbox url={lightbox} onClose={() => setLightbox(null)} />
    </div>
  );
}
