import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumber, formatPercentage } from "@/lib/utils";
import type { Product } from "@/types/graphql";
import { Package, Target, TrendingUp } from "lucide-react";
import { memo, useMemo } from "react";

interface KPICardsProps {
  products: Product[];
  loading: boolean;
}

export const KPICards = memo(function KPICards({
  products,
  loading,
}: KPICardsProps) {
  const { totalStock, totalDemand, fillRate } = useMemo(() => {
    const totalStock = products.reduce(
      (sum, product) => sum + product.stock,
      0
    );
    const totalDemand = products.reduce(
      (sum, product) => sum + product.demand,
      0
    );

    const totalFilled = products.reduce(
      (sum, product) => sum + Math.min(product.stock, product.demand),
      0
    );
    const fillRate = totalDemand > 0 ? (totalFilled / totalDemand) * 100 : 0;

    return { totalStock, totalDemand, fillRate };
  }, [products]);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total Stock */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Stock
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalStock)}</div>
          <p className="text-xs text-muted-foreground">Across all warehouses</p>
        </CardContent>
      </Card>

      {/* Total Demand */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Demand
          </CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatNumber(totalDemand)}</div>
          <p className="text-xs text-muted-foreground">Current demand</p>
        </CardContent>
      </Card>

      {/* Fill Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Fill Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatPercentage(fillRate)}</div>
          <p className="text-xs text-muted-foreground">
            {fillRate >= 90
              ? "Excellent"
              : fillRate >= 75
              ? "Good"
              : "Needs attention"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
});
