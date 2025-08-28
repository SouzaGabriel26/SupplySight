import { gql } from "@apollo/client";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Mock data
const mockProducts = [
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
];

const mockWarehouses = [
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
];

// Generate KPI data
const generateKPIData = (days = 30) => {
  const kpis = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

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

const mockKPIs = generateKPIData(30);

// Business logic
const calculateProductStatus = (stock, demand) => {
  if (stock > demand) return "healthy";
  if (stock === demand) return "low";
  return "critical";
};

// GraphQL Schema
const typeDefs = gql`
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(search: String, status: String, warehouse: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    products: (_, { search, status, warehouse }) => {
      let filteredProducts = [...mockProducts];

      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.sku.toLowerCase().includes(searchLower) ||
            product.id.toLowerCase().includes(searchLower)
        );
      }

      if (warehouse) {
        filteredProducts = filteredProducts.filter(
          (product) => product.warehouse === warehouse
        );
      }

      if (status && status !== "all") {
        filteredProducts = filteredProducts.filter((product) => {
          const productStatus = calculateProductStatus(
            product.stock,
            product.demand
          );
          return productStatus === status;
        });
      }

      return filteredProducts;
    },

    warehouses: () => {
      return mockWarehouses;
    },

    kpis: (_, { range }) => {
      let days = 30;

      switch (range) {
        case "7d":
          days = 7;
          break;
        case "14d":
          days = 14;
          break;
        case "30d":
          days = 30;
          break;
        default:
          days = 30;
      }

      return mockKPIs.slice(-days);
    },
  },

  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const productIndex = mockProducts.findIndex((p) => p.id === id);

      if (productIndex === -1) {
        throw new Error(`Product with id ${id} not found`);
      }

      if (demand < 0) {
        throw new Error("Demand cannot be negative");
      }

      mockProducts[productIndex].demand = demand;
      return mockProducts[productIndex];
    },

    transferStock: (_, { id, from, to, qty }) => {
      const productIndex = mockProducts.findIndex((p) => p.id === id);

      if (productIndex === -1) {
        throw new Error(`Product with id ${id} not found`);
      }

      const product = mockProducts[productIndex];

      if (product.warehouse !== from) {
        throw new Error(`Product is not in warehouse ${from}`);
      }

      if (qty <= 0) {
        throw new Error("Transfer quantity must be positive");
      }

      if (product.stock < qty) {
        throw new Error("Insufficient stock for transfer");
      }

      const destinationWarehouse = mockWarehouses.find((w) => w.code === to);
      if (!destinationWarehouse) {
        throw new Error(`Warehouse ${to} not found`);
      }

      mockProducts[productIndex].stock -= qty;
      mockProducts[productIndex].warehouse = to;

      return mockProducts[productIndex];
    },
  },
};

// Create and start the server
const createMockServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Mock GraphQL server ready at: ${url}`);
  return server;
};

// Start the mock GraphQL server
createMockServer().catch(console.error);
