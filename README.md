# SupplySight Dashboard

A comprehensive supply chain management platform that provides real-time inventory tracking, demand forecasting, and warehouse management capabilities through an intuitive and responsive user interface.

## 🎥 Demo

<video width="100%" controls>
  <source src="https://github.com/SouzaGabriel26/SupplySight/blob/main/public/video-demo.mp4?raw=true" type="video/mp4">
  Your browser does not support the video tag.
</video>

_Watch the demo to see the dashboard in action - featuring real-time inventory tracking, demand management, and stock transfers_

> **Note**: If the video doesn't play, you can also [download it directly](https://github.com/SouzaGabriel26/SupplySight/blob/main/public/video-demo.mp4?raw=true).

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **GraphQL**: Apollo Client + Apollo Server (mock)
- **Charts**: Recharts
- **State Management**: React Query (TanStack Query)
- **Form Handling**: React Hook Form + Zod validation
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 🚀 Getting Started

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
   npm run dev:full
   ```

4. **Open your browser**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

## 🎯 Key Features

### Core Functionality

- **Real-time Inventory Dashboard**: Live tracking of stock levels across all warehouses
- **Demand Management**: Update and track product demand with instant feedback
- **Stock Transfers**: Seamless inventory movement between warehouses
- **KPI Monitoring**: Key performance indicators with trend analysis
- **Advanced Filtering**: Search and filter products by multiple criteria

### User Experience

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Keyboard Navigation**: Full accessibility support with keyboard shortcuts
- **Real-time Updates**: Optimistic UI updates with error handling
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: Comprehensive error boundaries and user-friendly messages

### Performance

- **Lazy Loading**: Component-level code splitting for faster initial loads
- **Memoization**: Optimized re-renders with React.memo and useMemo
- **Efficient Queries**: GraphQL with React Query for optimal data fetching
- **Bundle Optimization**: Tree-shaking and code splitting

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
├── contexts/            # React contexts
└── data/                # Mock data
```

## 🔧 Available Scripts

- `npm run dev:full` - Start both GraphQL and development servers
- `npm run dev` - Start Vite development server only
- `npm run server` - Start GraphQL server only
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

This project is licensed under the MIT License.
