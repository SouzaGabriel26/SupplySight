import { ReactNode } from "react";
import { Header } from "./Header";

interface LayoutProps {
  children: ReactNode;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export function Layout({
  children,
  dateRange,
  onDateRangeChange,
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header dateRange={dateRange} onDateRangeChange={onDateRangeChange} />
      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
