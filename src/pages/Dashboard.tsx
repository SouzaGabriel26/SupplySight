import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { Filters } from "@/components/dashboard/Filters";
import { Layout } from "@/components/layout/Layout";
import { ProductDetailsDrawer } from "@/components/products/ProductDetailsDrawer";
import { ProductsTable } from "@/components/products/ProductsTable";
import { ErrorPage } from "@/components/ui/ErrorPage";
import { useDebounce } from "@/hooks/useDebounce";
import { useKPIs } from "@/hooks/useKPIs";
import { useTransferStock, useUpdateDemand } from "@/hooks/useMutations";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/graphql";
import { useState } from "react";

export function Dashboard() {
  const [dateRange, setDateRange] = useState("30d");
  const [searchInput, setSearchInput] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 300);

  // Combine filters for API call
  const filters = {
    search: debouncedSearch,
    status: statusFilter,
    warehouse: warehouseFilter === "all" ? "" : warehouseFilter,
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
    setWarehouseFilter("all");
    setStatusFilter("all");
  };

  // Mutation hooks
  const updateDemandMutation = useUpdateDemand();
  const transferStockMutation = useTransferStock();

  const handleProductRowClick = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleUpdateDemand = (id: string, demand: number) => {
    updateDemandMutation.mutate({ id, demand });
  };

  const handleTransferStock = (
    id: string,
    from: string,
    to: string,
    qty: number
  ) => {
    transferStockMutation.mutate({ id, from, to, qty });
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

        <ProductsTable
          products={products}
          loading={productsLoading}
          onRowClick={handleProductRowClick}
        />

        <ProductDetailsDrawer
          product={selectedProduct}
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          onUpdateDemand={handleUpdateDemand}
          onTransferStock={handleTransferStock}
          loading={
            updateDemandMutation.isPending || transferStockMutation.isPending
          }
        />
      </div>
    </Layout>
  );
}
