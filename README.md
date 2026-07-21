# SmashIt Admin Web

Admin dashboard for **SmashIt**, a badminton court booking platform. This app is the back-office console used by facility staff/admins to manage courts, bookings, schedules, inventory, maintenance, vouchers, sales, revenue, and customers.

Built with React 19, TypeScript, and Vite.

## Features

- **Dashboard** — high-level overview of facility activity
- **Court management** — configure and monitor courts
- **Booking & schedule** — manage court bookings and time slots
- **Sales & revenue** — track sales and revenue reports
- **Inventory** — manage stock/products
- **Vouchers** — create and manage promotional vouchers
- **Maintenance** — log and track court/equipment maintenance
- **Customer & community** — manage customer accounts and community data

## Tech Stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) — build tool & dev server
- [Ant Design (antd)](https://ant.design/) — UI component library
- [TanStack Router](https://tanstack.com/router) & [React Router](https://reactrouter.com/) — routing
- [TanStack Query](https://tanstack.com/query) — server-state management & data fetching
- [Axios](https://axios-http.com/) — HTTP client
- [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/) — data visualization
- [ESLint](https://eslint.org/) — linting

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (recommended: latest LTS)
- npm (bundled with Node.js)
- A running instance of the SmashIt backend API (see [Configuration](#configuration) below)

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/UIT-SmashIt/admin-web.git
   cd admin-web
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at the URL Vite prints in the terminal (typically `http://localhost:5173`).

## Configuration

By default, the app expects the backend API to be running at `http://localhost:8080/` (see `src/api/apiClient.ts`). If your backend runs elsewhere, update the `baseURL` in that file accordingly.

## Available Scripts

| Command           | Description                                    |
|--------------------|------------------------------------------------|
| `npm run dev`      | Start the Vite development server with HMR     |
| `npm run build`    | Type-check with `tsc` and build for production  |
| `npm run lint`     | Run ESLint across the project                   |
| `npm run preview`  | Preview the production build locally            |

## Project Structure

```
src/
├── api/          # API client & endpoint definitions (axios)
├── components/   # Shared/reusable UI components
├── const/        # Constants
├── hooks/        # Custom React hooks
├── layouts/      # Page layouts
├── pages/        # Feature pages (Dashboard, Sale, Revenue, admin/*, etc.)
├── routes/       # Route definitions (TanStack Router)
├── types/        # TypeScript types
└── utils/        # Utility/helper functions
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request describing the change you'd like to make.

## License

No license has been specified for this project yet.
