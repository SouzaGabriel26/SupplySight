import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

// HTTP link for GraphQL endpoint
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql", // We'll set up the server on this port
});

// Create Apollo Client
export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          warehouses: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
          kpis: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
  },
});
