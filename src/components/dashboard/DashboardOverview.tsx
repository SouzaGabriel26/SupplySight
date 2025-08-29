import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import type { KPI, Product } from "@/types/graphql";
import { KPICards } from "./KPICards";
import { StockDemandChart } from "./StockDemandChart";

interface DashboardOverviewProps {
  products: Product[];
  kpis: KPI[];
  productsLoading: boolean;
  kpisLoading: boolean;
}

export function DashboardOverview({
  products,
  kpis,
  productsLoading,
  kpisLoading,
}: DashboardOverviewProps) {
  if (productsLoading || kpisLoading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader type="card" />
        <SkeletonLoader type="chart" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards products={products} loading={productsLoading} />

      {/* Stock vs Demand Chart */}
      <StockDemandChart kpis={kpis} loading={kpisLoading} />
    </div>
  );
}
