import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { ErrorPage } from "@/components/ui/ErrorPage";
import { useProducts } from "@/hooks/useProducts";
import { useKPIs } from "@/hooks/useKPIs";

export function Dashboard() {
  const [dateRange, setDateRange] = useState("30d");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    warehouse: "",
  });

  // Fetch data using custom hooks
  const { products, loading: productsLoading, error: productsError } = useProducts(filters);
  const { kpis, loading: kpisLoading, error: kpisError } = useKPIs(dateRange);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  // Handle errors
  if (productsError) {
    return (
      <ErrorPage
        title="Error Loading Products"
        message={productsError.message || "Failed to load product data"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (kpisError) {
    return (
      <ErrorPage
        title="Error Loading KPIs"
        message={kpisError.message || "Failed to load KPI data"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <Layout dateRange={dateRange} onDateRangeChange={handleDateRangeChange}>
      <DashboardOverview
        products={products}
        kpis={kpis}
        productsLoading={productsLoading}
        kpisLoading={kpisLoading}
      />
      
      {/* TODO: Add Filters component here */}
      {/* TODO: Add Products Table component here */}
    </Layout>
  );
}
