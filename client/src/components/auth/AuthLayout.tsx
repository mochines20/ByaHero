import { PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export function AuthLayout({ title, subtitle, children }: PropsWithChildren<{ title: string; subtitle: string }>) {
  return (
    <div className="grid min-h-screen p-4 md:place-items-center">
      <div className="glass-card w-full max-w-md rounded-2xl p-5">
        <div className="mb-5">
          <Link to="/login" className="text-xl font-extrabold text-byahero-navy">
            Bya<span className="text-byahero-gold">Hero</span>
          </Link>
          <h1 className="mt-3 text-xl font-bold text-byahero-navy">{title}</h1>
          <p className="text-sm text-byahero-muted">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
