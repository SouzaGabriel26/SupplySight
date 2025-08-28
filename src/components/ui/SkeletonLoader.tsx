import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonLoaderProps {
  type: "card" | "table" | "chart" | "filters";
  rows?: number;
}

export function SkeletonLoader({ type, rows = 3 }: SkeletonLoaderProps) {
  switch (type) {
    case "card":
      return (
        <div className="bg-white rounded-lg border p-6 space-y-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      );

    case "table":
      return (
        <div className="bg-white rounded-lg border">
          <div className="p-4 border-b">
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="p-4 space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      );

    case "chart":
      return (
        <div className="bg-white rounded-lg border p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
      );

    case "filters":
      return (
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-8 w-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
