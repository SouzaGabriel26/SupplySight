import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar, Package } from "lucide-react";

interface HeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

const dateRangeOptions = [
  { value: "7d", label: "7 Days" },
  { value: "14d", label: "14 Days" },
  { value: "30d", label: "30 Days" },
];

export function Header({ dateRange, onDateRangeChange }: HeaderProps) {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">SupplySight</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Date Range:
            </span>
          </div>
          <div className="flex space-x-1">
            {dateRangeOptions.map((option) => (
              <Button
                key={option.value}
                variant={dateRange === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => onDateRangeChange(option.value)}
                className={cn(
                  "h-8 px-3 text-xs",
                  dateRange === option.value
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
