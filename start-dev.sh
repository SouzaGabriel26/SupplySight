#!/bin/bash

# Start the GraphQL server in the background
echo "🚀 Starting GraphQL server..."
node server.js &
GRAPHQL_PID=$!

# Wait a moment for the GraphQL server to start
sleep 2

# Start the Vite development server
echo "🚀 Starting Vite development server..."
npm run dev &
VITE_PID=$!

# Function to cleanup on exit
cleanup() {
    echo "🛑 Shutting down servers..."
    kill $GRAPHQL_PID 2>/dev/null
    kill $VITE_PID 2>/dev/null
    exit 0
}

# Trap SIGINT and SIGTERM
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
