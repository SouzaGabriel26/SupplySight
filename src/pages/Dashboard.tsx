import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { Filters } from "@/components/dashboard/Filters";
import { Layout } from "@/components/layout/Layout";
import { ErrorPage } from "@/components/ui/ErrorPage";
import { useDebounce } from "@/hooks/useDebounce";
import { useKPIs } from "@/hooks/useKPIs";
import { useProducts } from "@/hooks/useProducts";
import { useState } from "react";

export function Dashboard() {
  const [dateRange, setDateRange] = useState("30d");
  const [searchInput, setSearchInput] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Combine filters for API call
  const filters = {
    search: debouncedSearch,
    status: statusFilter,
    warehouse: warehouseFilter,
  };

  // Fetch data using custom hooks
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useProducts(filters);
  const { kpis, loading: kpisLoading, error: kpisError } = useKPIs(dateRange);

  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
  };

  const handleWarehouseChange = (value: string) => {
    setWarehouseFilter(value);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setWarehouseFilter("");
    setStatusFilter("all");
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
      <div className="space-y-6">
        <DashboardOverview
          products={products}
          kpis={kpis}
          productsLoading={productsLoading}
          kpisLoading={kpisLoading}
        />

        <Filters
          search={searchInput}
          warehouse={warehouseFilter}
          status={statusFilter}
          onSearchChange={handleSearchChange}
          onWarehouseChange={handleWarehouseChange}
          onStatusChange={handleStatusChange}
          onClearFilters={handleClearFilters}
          loading={productsLoading}
        />

        {/* TODO: Add Products Table component here */}
      </div>
    </Layout>
  );
}
