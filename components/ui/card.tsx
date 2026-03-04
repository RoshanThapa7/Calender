import * as React from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return <div className={cn("rounded-3xl border border-white/80 bg-white/60 p-5 shadow-soft", className)} {...props} />;
}
