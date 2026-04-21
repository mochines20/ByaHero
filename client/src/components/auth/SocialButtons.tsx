import { Apple, Mail } from "lucide-react";

type Props = { onGoogle: () => void; onApple: () => void; disabled?: boolean };

export function SocialButtons({ onGoogle, onApple, disabled = false }: Props) {
  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={onGoogle}
        disabled={disabled}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-3 text-sm font-medium text-[#1f1f1f] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Mail size={16} /> Sign in with Google
      </button>
      <button
        type="button"
        onClick={onApple}
        disabled={disabled}
        className="flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-black px-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Apple size={16} /> Sign in with Apple
      </button>
    </div>
  );
}
