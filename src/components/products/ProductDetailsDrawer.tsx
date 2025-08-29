import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useKeyboardNavigation } from "@/hooks/useKeyboardNavigation";
import { useWarehouses } from "@/hooks/useWarehouses";
import { formatNumber, getStatusColor, getStatusIcon } from "@/lib/utils";
import { transferStockSchema, updateDemandSchema } from "@/lib/validations";
import type { Product } from "@/types/graphql";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Package, TrendingDown, TrendingUp, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

type UpdateDemandForm = z.infer<typeof updateDemandSchema>;
type TransferStockForm = z.infer<typeof transferStockSchema>;

interface ProductDetailsDrawerProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateDemand?: (id: string, demand: number) => void;
  onTransferStock?: (id: string, from: string, to: string, qty: number) => void;
  loading?: boolean;
}

export function ProductDetailsDrawer({
  product,
  open,
  onOpenChange,
  onUpdateDemand,
  onTransferStock,
  loading = false,
}: ProductDetailsDrawerProps) {
  const [activeTab, setActiveTab] = useState<"details" | "demand" | "transfer">(
    "details"
  );
  const { warehouses } = useWarehouses();

  useKeyboardNavigation({
    onEscape: () => onOpenChange(false),
    enabled: open,
  });

  const updateDemandForm = useForm<UpdateDemandForm>({
    resolver: zodResolver(updateDemandSchema),
    defaultValues: {
      demand: product?.demand || 0,
    },
  });

  const transferStockForm = useForm<TransferStockForm>({
    resolver: zodResolver(transferStockSchema),
    defaultValues: {
      from: "",
      to: "",
      qty: 0,
    },
  });

  useEffect(() => {
    if (product) {
      updateDemandForm.setValue("demand", product.demand);
      transferStockForm.setValue("from", product.warehouse);
    }
  }, [product, updateDemandForm, transferStockForm]);

  const handleUpdateDemand = (data: UpdateDemandForm) => {
    if (product && onUpdateDemand) {
      onUpdateDemand(product.id, data.demand);
      updateDemandForm.reset();
    }
  };

  const handleTransferStock = (data: TransferStockForm) => {
    if (product && onTransferStock) {
      onTransferStock(product.id, data.from, data.to, data.qty);
      transferStockForm.reset();
    }
  };

  const getProductStatus = (product: Product) => {
    if (product.stock > product.demand) return "healthy";
    if (product.stock === product.demand) return "low";
    return "critical";
  };

  if (!product) return null;

  const status = getProductStatus(product);
  const isCritical = status === "critical";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full max-w-md sm:max-w-lg md:max-w-xl overflow-y-auto shadow-2xl border-l">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-xl font-semibold">
                {product.name}
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                SKU: {product.sku} • ID: {product.id}
              </SheetDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 p-0 transition-all duration-200 hover:bg-gray-100 hover:scale-110 active:scale-95"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>
        <div className="mt-6 space-y-6 content-fade-in">
          {/* Product Status */}
          <div
            className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${
              isCritical ? "bg-red-50 border-red-200" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Package className="h-5 w-5 text-gray-600" />
                <span className="font-medium">Current Status</span>
              </div>
              <Badge className={getStatusColor(status)}>
                <span className="mr-1">{getStatusIcon(status)}</span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
            {isCritical && (
              <p className="text-sm text-red-600 mt-2">
                ⚠️ Stock is below demand. Consider restocking or transferring
                inventory.
              </p>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-1 border-b transition-all duration-300">
            {[
              { id: "details", label: "Details", icon: Package },
              { id: "demand", label: "Update Demand", icon: TrendingUp },
              { id: "transfer", label: "Transfer Stock", icon: TrendingDown },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setActiveTab(tab.id as "details" | "demand" | "transfer")
                  }
                  className="flex items-center space-x-1 transition-all duration-200 hover:scale-105 text-xs sm:text-sm"
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.id}</span>
                </Button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === "details" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Current Stock
                    </Label>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {formatNumber(product.stock)}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Current Demand
                    </Label>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {formatNumber(product.demand)}
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Warehouse Location
                  </Label>
                  <div className="text-lg font-medium text-gray-900 mt-1">
                    {product.warehouse}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">
                    Stock vs Demand Ratio
                  </Label>
                  <div className="text-lg font-medium text-gray-900 mt-1">
                    {product.demand > 0
                      ? (product.stock / product.demand).toFixed(2)
                      : "N/A"}
                  </div>
                </div>

                {isCritical && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Stock Deficit:{" "}
                        {formatNumber(product.demand - product.stock)} units
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "demand" && (
              <form
                onSubmit={updateDemandForm.handleSubmit(handleUpdateDemand)}
                className="space-y-4"
              >
                <div>
                  <Label
                    htmlFor="demand"
                    className="text-sm font-medium text-gray-700"
                  >
                    New Demand Value
                  </Label>
                  <Input
                    id="demand"
                    type="number"
                    min="0"
                    {...updateDemandForm.register("demand", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                    disabled={loading}
                  />
                  {updateDemandForm.formState.errors.demand && (
                    <p className="text-sm text-red-600 mt-1">
                      {updateDemandForm.formState.errors.demand.message}
                    </p>
                  )}
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 flex-shrink-0" />
                    <span className="text-sm text-blue-800 break-words">
                      Current demand: {formatNumber(product.demand)} units
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Demand"}
                </Button>
              </form>
            )}

            {activeTab === "transfer" && (
              <form
                onSubmit={transferStockForm.handleSubmit(handleTransferStock)}
                className="space-y-4"
              >
                <div>
                  <Label
                    htmlFor="from"
                    className="text-sm font-medium text-gray-700"
                  >
                    From Warehouse
                  </Label>
                  <Select
                    value={transferStockForm.watch("from")}
                    onValueChange={(value) =>
                      transferStockForm.setValue("from", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select source warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.code} value={warehouse.code}>
                          {warehouse.name} ({warehouse.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {transferStockForm.formState.errors.from && (
                    <p className="text-sm text-red-600 mt-1">
                      {transferStockForm.formState.errors.from.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-center">
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>

                <div>
                  <Label
                    htmlFor="to"
                    className="text-sm font-medium text-gray-700"
                  >
                    To Warehouse
                  </Label>
                  <Select
                    value={transferStockForm.watch("to")}
                    onValueChange={(value) =>
                      transferStockForm.setValue("to", value)
                    }
                    disabled={loading}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select destination warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                      {warehouses
                        .filter(
                          (w) => w.code !== transferStockForm.watch("from")
                        )
                        .map((warehouse) => (
                          <SelectItem
                            key={warehouse.code}
                            value={warehouse.code}
                          >
                            {warehouse.name} ({warehouse.code})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {transferStockForm.formState.errors.to && (
                    <p className="text-sm text-red-600 mt-1">
                      {transferStockForm.formState.errors.to.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="qty"
                    className="text-sm font-medium text-gray-700"
                  >
                    Transfer Quantity
                  </Label>
                  <Input
                    id="qty"
                    type="number"
                    min="1"
                    max={product.stock}
                    {...transferStockForm.register("qty", {
                      valueAsNumber: true,
                    })}
                    className="mt-1"
                    disabled={loading}
                  />
                  {transferStockForm.formState.errors.qty && (
                    <p className="text-sm text-red-600 mt-1">
                      {transferStockForm.formState.errors.qty.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum available: {formatNumber(product.stock)} units
                  </p>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                    <span className="text-sm text-yellow-800 break-words">
                      Available for transfer: {formatNumber(product.stock)}{" "}
                      units
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  disabled={loading}
                >
                  {loading ? "Transferring..." : "Transfer Stock"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
