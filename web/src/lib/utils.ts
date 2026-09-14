import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number | string): string {
  const num = typeof score === "string" ? parseFloat(score) : score;
  if (isNaN(num)) return "0.0";
  return num.toFixed(1);
}

export function getScoreBadgeClass(score: number): {
  bg: string;
  text: string;
  border: string;
  label: string;
} {
  if (score >= 80) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800/50",
      label: "Sangat Baik",
    };
  } else if (score >= 65) {
    return {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800/50",
      label: "Cukup Baik",
    };
  } else {
    return {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800/50",
      label: "Perlu Peningkatan",
    };
  }
}
