import { KPICards } from "./KPICards";
import { StockDemandChart } from "./StockDemandChart";
import type { Product, KPI } from "@/types/graphql";

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
  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KPICards products={products} loading={productsLoading} />
      
      {/* Stock vs Demand Chart */}
      <StockDemandChart kpis={kpis} loading={kpisLoading} />
    </div>
  );
}
