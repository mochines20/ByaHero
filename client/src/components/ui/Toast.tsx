import { useToastStore } from "../../store/uiStore";

export function ToastHost() {
  const toasts = useToastStore((s) => s.toasts);

  return (
    <div className="pointer-events-none fixed bottom-20 right-4 z-[60] space-y-2 md:bottom-auto md:top-4">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="min-w-[220px] rounded-lg bg-byahero-navy px-3 py-2 text-sm text-white shadow-card"
          role="status"
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
