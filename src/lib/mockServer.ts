import {
  calculateProductStatus,
  mockKPIs,
  mockProducts,
  mockWarehouses,
} from "@/data/mockData";
import { gql } from "@apollo/client";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

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

interface ProductsArgs {
  search?: string;
  status?: string;
  warehouse?: string;
}

interface KPIsArgs {
  range: string;
}

interface UpdateDemandArgs {
  id: string;
  demand: number;
}

interface TransferStockArgs {
  id: string;
  from: string;
  to: string;
  qty: number;
}

// Resolvers
const resolvers = {
  Query: {
    products: (_: unknown, { search, status, warehouse }: ProductsArgs) => {
      let filteredProducts = [...mockProducts];

      // Apply search filter
      if (search) {
        const searchLower = search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          (product) =>
            product.name.toLowerCase().includes(searchLower) ||
            product.sku.toLowerCase().includes(searchLower) ||
            product.id.toLowerCase().includes(searchLower)
        );
      }

      // Apply warehouse filter
      if (warehouse) {
        filteredProducts = filteredProducts.filter(
          (product) => product.warehouse === warehouse
        );
      }

      // Apply status filter
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

    kpis: (_: unknown, { range }: KPIsArgs) => {
      let days = 30; // default

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
    updateDemand: (_: unknown, { id, demand }: UpdateDemandArgs) => {
      const productIndex = mockProducts.findIndex((p) => p.id === id);

      if (productIndex === -1) {
        throw new Error(`Product with id ${id} not found`);
      }

      if (demand < 0) {
        throw new Error("Demand cannot be negative");
      }

      // Update the product
      mockProducts[productIndex].demand = demand;

      return mockProducts[productIndex];
    },

    transferStock: (_: unknown, { id, from, to, qty }: TransferStockArgs) => {
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

      // Check if destination warehouse exists
      const destinationWarehouse = mockWarehouses.find((w) => w.code === to);
      if (!destinationWarehouse) {
        throw new Error(`Warehouse ${to} not found`);
      }

      // Update the product
      mockProducts[productIndex].stock -= qty;
      mockProducts[productIndex].warehouse = to;

      return mockProducts[productIndex];
    },
  },
};

// Create and start the server
export const createMockServer = async () => {
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
