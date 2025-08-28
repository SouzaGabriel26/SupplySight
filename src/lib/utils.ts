import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "healthy":
      return "bg-green-100 text-green-800 border-green-200";
    case "low":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "critical":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

export function getStatusIcon(status: string): string {
  switch (status) {
    case "healthy":
      return "🟢";
    case "low":
      return "🟡";
    case "critical":
      return "🔴";
    default:
      return "⚪";
  }
}
