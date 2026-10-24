import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// we could use shadcn/ui's FieldLabel but i am so lazy to edit the whole form

export const authLabelClass = (hasError: boolean) =>
  cn(
    "text-xs font-bold uppercase tracking-wider flex items-center gap-1.5",
    hasError ? "text-destructive" : "text-muted-foreground",
  );

export const authInputClass = (hasError: boolean) =>
  cn(
    "h-11 w-full rounded-xl bg-background/60 focus-visible:ring-2 font-medium text-sm transition-all",
    hasError
      ? "border-destructive focus-visible:ring-destructive/30"
      : "border-border/80 focus-visible:ring-brand-orange/40",
  );

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="text-[11px] font-semibold text-destructive mt-1 flex items-center gap-1">
      <AlertCircle className="size-3 shrink-0" /> {message}
    </p>
  );
}
