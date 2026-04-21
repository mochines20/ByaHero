import { PropsWithChildren } from "react";
import clsx from "clsx";

type CardProps = PropsWithChildren<{
  className?: string;
}>;

export function Card({ children, className }: CardProps) {
  return <div className={clsx("glass-card rounded-2xl p-4", className)}>{children}</div>;
}
