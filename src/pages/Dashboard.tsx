import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { Filters } from "@/components/dashboard/Filters";
import { Layout } from "@/components/layout/Layout";
import { ProductDetailsDrawer } from "@/components/products/ProductDetailsDrawer";
import { ProductsTable } from "@/components/products/ProductsTable";
import { ErrorPage } from "@/components/ui/ErrorPage";
import { NetworkError } from "@/components/ui/NetworkError";

import { useKPIs } from "@/hooks/useKPIs";
import { useTransferStock, useUpdateDemand } from "@/hooks/useMutations";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/graphql";
import { useCallback, useMemo, useState } from "react";

export function Dashboard() {
  const [dateRange, setDateRange] = useState("30d");
  const [searchInput, setSearchInput] = useState("");
  const [warehouseFilter, setWarehouseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [appliedFilters, setAppliedFilters] = useState({
    search: "",
    status: "all",
    warehouse: "",
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Use applied filters for API calls - no debounce, only manual apply
  const filters = useMemo(
    () => ({
      search: appliedFilters.search,
      status: appliedFilters.status,
      warehouse: appliedFilters.warehouse,
    }),
    [appliedFilters.search, appliedFilters.status, appliedFilters.warehouse]
  );

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

  const handleSearchChange = useCallback((value: string) => {
    setSearchInput(value);
  }, []);

  const handleWarehouseChange = useCallback((value: string) => {
    setWarehouseFilter(value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
  }, []);

  const handleApplyFilters = () => {
    setAppliedFilters({
      search: searchInput,
      status: statusFilter,
      warehouse: warehouseFilter === "all" ? "" : warehouseFilter,
    });
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setWarehouseFilter("all");
    setStatusFilter("all");
    setAppliedFilters({
      search: "",
      status: "all",
      warehouse: "",
    });
  };

  // Mutation hooks
  const updateDemandMutation = useUpdateDemand();
  const transferStockMutation = useTransferStock();

  const handleProductRowClick = (product: Product) => {
    setSelectedProduct(product);
    setDrawerOpen(true);
  };

  const handleUpdateDemand = (id: string, demand: number) => {
    updateDemandMutation.mutate(
      { id, demand },
      {
        onSuccess: () => {
          // Close drawer after successful update
          setDrawerOpen(false);
          setSelectedProduct(null);
        },
      }
    );
  };

  const handleTransferStock = (
    id: string,
    from: string,
    to: string,
    qty: number
  ) => {
    transferStockMutation.mutate(
      { id, from, to, qty },
      {
        onSuccess: () => {
          // Close drawer after successful transfer
          setDrawerOpen(false);
          setSelectedProduct(null);
        },
      }
    );
  };

  // Handle errors with enhanced error handling
  if (productsError || kpisError) {
    const error = productsError || kpisError;
    const isNetworkError =
      error?.message?.includes("Network") || error?.message?.includes("fetch");

    if (isNetworkError) {
      return (
        <NetworkError
          message={error?.message}
          onRetry={() => window.location.reload()}
        />
      );
    }

    return (
      <ErrorPage
        title="Failed to load dashboard data"
        message={
          error?.message ||
          "There was an error loading the dashboard data. Please try again."
        }
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
          onApplyFilters={handleApplyFilters}
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
