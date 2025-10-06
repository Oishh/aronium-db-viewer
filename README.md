# Aronium DB Viewer

A modern React-based single-page application for viewing and analyzing SQLite Point of Sale (POS) database files. Upload your .db files and explore the data through an intuitive interface with tabular views, analytics dashboard, and export capabilities.

## Features

- **Database Upload**: Load SQLite .db files directly in the browser
- **Data Explorer**: View and analyze POS data with sorting and filtering
- **Dashboard Analytics**: Overview of key metrics and insights
- **Data Export**: Export data to various formats
- **Modern UI**: Responsive design with dark/light mode support
- **Type-Safe**: Built with TypeScript for reliability

## Technology Stack

- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS + shadcn/ui
- React Router v7
- sql.js (client-side SQLite via WebAssembly)
- pnpm (package manager)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- pnpm (install with `npm install -g pnpm`)

### Installation

```bash
# Install dependencies
pnpm install
```

### Development

```bash
# Start development server
pnpm dev
```

The application will be available at `http://localhost:5173`

### Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Linting

```bash
# Run ESLint
pnpm lint
```

## Usage

1. Launch the application
2. Upload a SQLite .db file using the database management interface
3. Navigate through the sidebar to explore different views:
   - **Dashboard**: Analytics overview
   - **POS Data**: Detailed data tables
   - **Database**: Manage uploaded files

## Project Structure

```
src/
├── components/     # Reusable UI components
├── features/       # Feature-specific modules
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── services/       # Business logic & database layer
├── types/          # TypeScript definitions
└── utils/          # Utility functions
```
