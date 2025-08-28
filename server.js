import { createMockServer } from "./src/lib/mockServer.js";

// Start the mock GraphQL server
createMockServer().catch(console.error);
