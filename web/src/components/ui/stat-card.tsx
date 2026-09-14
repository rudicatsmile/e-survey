import React from "react";
import { Card, CardContent } from "./card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden relative group", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          {icon && (
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
            {value}
          </h2>
          {(description || trend) && (
            <div className="flex items-center gap-2 mt-2">
              {trend && (
                <span
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1",
                    trend.isPositive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                  )}
                >
                  {trend.isPositive ? "↑" : "↓"} {trend.value}
                </span>
              )}
              {description && (
                <span className="text-xs text-muted-foreground">{description}</span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
