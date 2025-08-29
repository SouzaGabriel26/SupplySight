import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber, getStatusColor, getStatusIcon } from "@/lib/utils";
import type { Product } from "@/types/graphql";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { useMemo, useState } from "react";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onRowClick?: (product: Product) => void;
}

type SortField = "name" | "sku" | "warehouse" | "stock" | "demand" | "status";
type SortDirection = "asc" | "desc";

export function ProductsTable({
  products,
  loading,
  onRowClick,
}: ProductsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const itemsPerPage = 10;

  // Calculate product status
  const getProductStatus = (product: Product) => {
    if (product.stock > product.demand) return "healthy";
    if (product.stock === product.demand) return "low";
    return "critical";
  };

  const sortedProducts = useMemo(() => {
    if (!products) return [];

    return [...products].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "sku":
          aValue = a.sku;
          bValue = b.sku;
          break;
        case "warehouse":
          aValue = a.warehouse;
          bValue = b.warehouse;
          break;
        case "stock":
          aValue = a.stock;
          bValue = b.stock;
          break;
        case "demand":
          aValue = a.demand;
          bValue = b.demand;
          break;
        case "status":
          aValue = getProductStatus(a);
          bValue = getProductStatus(b);
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      } else {
        const comparison = (aValue as number) - (bValue as number);
        return sortDirection === "asc" ? comparison : -comparison;
      }
    });
  }, [products, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = sortedProducts.slice(startIndex, endIndex);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const SortIndicator = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ChevronUp className="h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-600" />
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <Skeleton className="h-6 w-32" />
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex space-x-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Products</h3>
          <div className="text-sm text-gray-500">
            {sortedProducts.length} product
            {sortedProducts.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("name")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <div className="flex items-center space-x-1">
                    <span>Product</span>
                    <SortIndicator field="name" />
                  </div>
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("sku")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <div className="flex items-center space-x-1">
                    <span>SKU</span>
                    <SortIndicator field="sku" />
                  </div>
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("warehouse")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <div className="flex items-center space-x-1">
                    <span>Warehouse</span>
                    <SortIndicator field="warehouse" />
                  </div>
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("stock")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <div className="flex items-center space-x-1">
                    <span>Stock</span>
                    <SortIndicator field="stock" />
                  </div>
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("demand")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <div className="flex items-center space-x-1">
                    <span>Demand</span>
                    <SortIndicator field="demand" />
                  </div>
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <SortIndicator field="status" />
                  </div>
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center space-y-2">
                    <Package className="h-8 w-8 text-gray-400" />
                    <p className="text-gray-500">No products found</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              currentProducts.map((product) => {
                const status = getProductStatus(product);
                const isCritical = status === "critical";

                return (
                  <TableRow
                    key={product.id}
                    className={`cursor-pointer hover:bg-gray-50 transition-all duration-200 hover:shadow-sm hover:scale-[1.01] ${
                      isCritical ? "bg-red-50" : ""
                    }`}
                    onClick={() => onRowClick?.(product)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onRowClick?.(product);
                      }
                    }}
                    tabIndex={0}
                    role="button"
                    aria-label={`View details for ${product.name}`}
                  >
                    <TableCell className="font-medium">
                      {product.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.warehouse}</TableCell>
                    <TableCell className="font-mono">
                      {formatNumber(product.stock)}
                    </TableCell>
                    <TableCell className="font-mono">
                      {formatNumber(product.demand)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(status)}>
                        <span className="mr-1">{getStatusIcon(status)}</span>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to{" "}
              {Math.min(endIndex, sortedProducts.length)} of{" "}
              {sortedProducts.length} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0"
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
