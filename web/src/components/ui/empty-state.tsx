import React from "react";
import { cn } from "@/lib/utils";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center rounded-2xl border border-dashed border-border bg-card/50",
        className
      )}
    >
      <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
        {icon || <Inbox className="w-6 h-6" />}
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="text-xs md:text-sm text-muted-foreground max-w-sm mt-1 mb-5">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
