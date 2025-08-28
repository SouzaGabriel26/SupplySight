# 🚀 SupplySight Dashboard

A modern, responsive inventory dashboard built with React, TypeScript, and GraphQL.

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **GraphQL**: Apollo Client + Apollo Server (mock)
- **Charts**: Recharts
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd supplysight-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Option 1: Start both servers with the convenience script
   npm start
   
   # Option 2: Start servers separately
   npm run server    # GraphQL server on port 4000
   npm run dev       # Vite dev server on port 5173
   
   # Option 3: Start both with concurrently
   npm run dev:full
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## 📊 Features

### ✅ Completed
- [x] Project setup with Vite + TypeScript
- [x] Tailwind CSS + shadcn/ui integration
- [x] Mock GraphQL server with Apollo Server
- [x] Apollo Client setup with React Query
- [x] Dashboard layout with header and navigation
- [x] KPI cards (Total Stock, Total Demand, Fill Rate)
- [x] Stock vs Demand trend chart
- [x] Responsive design
- [x] Loading states and error handling
- [x] Routing setup

### 🚧 In Progress
- [ ] Filters and search functionality
- [ ] Products table with pagination
- [ ] Product details drawer
- [ ] Update demand and transfer stock forms
- [ ] Real-time data updates
- [ ] Performance optimizations
- [ ] Testing suite

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── dashboard/       # Dashboard-specific components
│   ├── products/        # Product-related components
│   └── layout/          # Layout components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
├── pages/               # Page components
├── types/               # TypeScript type definitions
└── data/                # Mock data
```

## 🔧 Available Scripts

- `npm start` - Start both GraphQL and development servers
- `npm run dev` - Start Vite development server only
- `npm run server` - Start GraphQL server only
- `npm run dev:full` - Start both servers with concurrently
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 GraphQL Schema

The mock GraphQL server provides the following operations:

### Queries
- `products(search, status, warehouse)` - Get filtered products
- `warehouses` - Get all warehouses
- `kpis(range)` - Get KPI data for date range

### Mutations
- `updateDemand(id, demand)` - Update product demand
- `transferStock(id, from, to, qty)` - Transfer stock between warehouses

## 🎨 Design System

The project uses shadcn/ui components with a custom theme:
- **Colors**: Blue primary, semantic status colors
- **Typography**: System fonts with proper hierarchy
- **Spacing**: Consistent 4px grid system
- **Components**: Accessible, responsive components

## 🔍 Business Logic

### Status Calculation
- 🟢 **Healthy**: `stock > demand`
- 🟡 **Low**: `stock === demand`
- 🔴 **Critical**: `stock < demand`

### Fill Rate Formula
```
Fill Rate = (sum(min(stock, demand)) / sum(demand)) * 100%
```

## 🚀 Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Serve the production build**
   ```bash
   npm run preview
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is part of a take-home challenge for SupplySight.

---

Built with ❤️ using modern web technologies
