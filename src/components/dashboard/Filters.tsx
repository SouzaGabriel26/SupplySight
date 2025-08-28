import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useWarehouses } from "@/hooks/useWarehouses";
import { Filter, Search, X } from "lucide-react";
import { memo, useRef } from "react";

interface FiltersProps {
  search: string;
  warehouse: string;
  status: string;
  onSearchChange: (value: string) => void;
  onWarehouseChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const Filters = memo(function Filters({
  search,
  warehouse,
  status,
  onSearchChange,
  onWarehouseChange,
  onStatusChange,
  onApplyFilters,
  onClearFilters,
  loading = false,
}: FiltersProps) {
  const { warehouses, loading: warehousesLoading } = useWarehouses();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const hasActiveFilters = search || warehouse !== "all" || status !== "all";

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4 mr-1" />
            Clear all
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Search by name, SKU, or ID..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onApplyFilters();
                }
              }}
              className="pl-10"
              disabled={loading}
            />
          </div>
        </div>

        {/* Warehouse Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Warehouse</label>
          {warehousesLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={warehouse}
              onValueChange={onWarehouseChange}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="All warehouses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All warehouses</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.code} value={warehouse.code}>
                    {warehouse.name} ({warehouse.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <Select
            value={status}
            onValueChange={onStatusChange}
            disabled={loading}
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="healthy">
                <span className="flex items-center">🟢 Healthy</span>
              </SelectItem>
              <SelectItem value="low">
                <span className="flex items-center">🟡 Low</span>
              </SelectItem>
              <SelectItem value="critical">
                <span className="flex items-center">🔴 Critical</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Filter Actions */}
      <div className="md:col-span-3 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {search && "🔍 Search ready to apply"}
        </div>
        <div className="flex space-x-2">
          <Button onClick={onApplyFilters} disabled={loading} className="px-6">
            <Filter className="h-4 w-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          {search && (
            <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm">
              <span>Search: "{search}"</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-4 w-4 p-0 hover:bg-blue-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {warehouse !== "all" && (
            <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-md text-sm">
              <span>Warehouse: {warehouse}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onWarehouseChange("all")}
                className="h-4 w-4 p-0 hover:bg-green-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          {status !== "all" && (
            <div className="flex items-center space-x-1 bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm">
              <span>Status: {status}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onStatusChange("all")}
                className="h-4 w-4 p-0 hover:bg-orange-200"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
