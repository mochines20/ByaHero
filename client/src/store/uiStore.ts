import { create } from "zustand";

type Toast = { id: string; message: string };

type UiState = {
  toasts: Toast[];
  pushToast: (message: string) => void;
};

export const useToastStore = create<UiState>((set) => ({
  toasts: [],
  pushToast: (message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 2500);
  },
}));
