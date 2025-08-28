export interface Warehouse {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface KPI {
  date: string;
  stock: number;
  demand: number;
}

export interface ProductsQueryVariables {
  search?: string;
  status?: string;
  warehouse?: string;
}

export interface KPIsQueryVariables {
  range: string;
}

export interface UpdateDemandMutationVariables {
  id: string;
  demand: number;
}

export interface TransferStockMutationVariables {
  id: string;
  from: string;
  to: string;
  qty: number;
}

export enum ProductStatus {
  HEALTHY = "healthy",
  LOW = "low",
  CRITICAL = "critical",
}

export interface ProductsQueryResult {
  products: Product[];
}

export interface WarehousesQueryResult {
  warehouses: Warehouse[];
}

export interface KPIsQueryResult {
  kpis: KPI[];
}
