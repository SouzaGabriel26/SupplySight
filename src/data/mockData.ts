import type { KPI, Product, Warehouse } from "@/types/graphql";

export const mockProducts: Product[] = [
  {
    id: "P-1001",
    name: "12mm Hex Bolt",
    sku: "HEX-12-100",
    warehouse: "BLR-A",
    stock: 180,
    demand: 120,
  },
  {
    id: "P-1002",
    name: "Steel Washer",
    sku: "WSR-08-500",
    warehouse: "BLR-A",
    stock: 50,
    demand: 80,
  },
  {
    id: "P-1003",
    name: "M8 Nut",
    sku: "NUT-08-200",
    warehouse: "PNQ-C",
    stock: 80,
    demand: 80,
  },
  {
    id: "P-1004",
    name: "Bearing 608ZZ",
    sku: "BRG-608-50",
    warehouse: "DEL-B",
    stock: 24,
    demand: 120,
  },
  {
    id: "P-1005",
    name: "Aluminum Plate 3mm",
    sku: "ALP-03-100",
    warehouse: "BLR-A",
    stock: 200,
    demand: 150,
  },
  {
    id: "P-1006",
    name: "Rubber Gasket",
    sku: "RUB-05-200",
    warehouse: "PNQ-C",
    stock: 300,
    demand: 250,
  },
  {
    id: "P-1007",
    name: "Copper Wire 2.5mm",
    sku: "COP-25-500",
    warehouse: "DEL-B",
    stock: 75,
    demand: 100,
  },
  {
    id: "P-1008",
    name: "Plastic Housing",
    sku: "PLA-10-50",
    warehouse: "BLR-A",
    stock: 40,
    demand: 60,
  },
  {
    id: "P-1009",
    name: "Steel Rod 10mm",
    sku: "STE-10-100",
    warehouse: "PNQ-C",
    stock: 120,
    demand: 90,
  },
  {
    id: "P-1010",
    name: "Ceramic Capacitor",
    sku: "CER-100-1000",
    warehouse: "DEL-B",
    stock: 500,
    demand: 450,
  },
];

export const mockWarehouses: Warehouse[] = [
  {
    code: "BLR-A",
    name: "Bangalore Central",
    city: "Bangalore",
    country: "India",
  },
  {
    code: "PNQ-C",
    name: "Pune Distribution",
    city: "Pune",
    country: "India",
  },
  {
    code: "DEL-B",
    name: "Delhi North",
    city: "Delhi",
    country: "India",
  },
  {
    code: "MUM-D",
    name: "Mumbai Port",
    city: "Mumbai",
    country: "India",
  },
  {
    code: "CHN-E",
    name: "Chennai South",
    city: "Chennai",
    country: "India",
  },
];

// Generate KPI data for the last 30 days
export const generateKPIData = (days: number = 30): KPI[] => {
  const kpis: KPI[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    // Generate realistic stock and demand data with some variation
    const baseStock = 1500;
    const baseDemand = 1200;
    const stockVariation = Math.random() * 200 - 100;
    const demandVariation = Math.random() * 150 - 75;

    kpis.push({
      date: date.toISOString().split("T")[0],
      stock: Math.max(0, Math.round(baseStock + stockVariation)),
      demand: Math.max(0, Math.round(baseDemand + demandVariation)),
    });
  }

  return kpis;
};

export const mockKPIs = generateKPIData(30);

// Business logic functions
export const calculateProductStatus = (
  stock: number,
  demand: number
): string => {
  if (stock > demand) return "healthy";
  if (stock === demand) return "low";
  return "critical";
};

export const calculateFillRate = (products: Product[]): number => {
  const totalDemand = products.reduce(
    (sum, product) => sum + product.demand,
    0
  );
  const totalFilled = products.reduce(
    (sum, product) => sum + Math.min(product.stock, product.demand),
    0
  );

  return totalDemand > 0 ? (totalFilled / totalDemand) * 100 : 0;
};

export const getTotalStock = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.stock, 0);
};

export const getTotalDemand = (products: Product[]): number => {
  return products.reduce((sum, product) => sum + product.demand, 0);
};
