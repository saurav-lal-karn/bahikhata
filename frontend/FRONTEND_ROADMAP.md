# Bahikhata: Frontend Template Transition Roadmap

This document provides a step-by-step guide to transforming the TailAdmin template into the **Bahikhata** (Personal Expense Tracker) application.

## Phase 1: Global Branding & Metadata
Focus on making the application feel like "Bahikhata" from the moment it loads.

- [ ] **Global Metadata**: Update `src/app/layout.tsx` to include the project name, description, and OpenGraph tags.
- [ ] **Page Metadata**: Update the metadata object in `src/app/(admin)/page.tsx`.
- [ ] **Branding Assets**:
    - [ ] Replace `public/images/logo/logo.svg` (Main logo - Light).
    - [ ] Replace `public/images/logo/logo-dark.svg` (Main logo - Dark).
    - [ ] Replace `public/images/logo/logo-icon.svg` (Small sidebar icon).
- [ ] **Favicon**: Replace `src/app/favicon.ico`.

## Phase 2: Navigation & Sidebar Customization
Clean up the navigation to focus on financial management instead of e-commerce.

- [ ] **Sidebar Links (`src/layout/AppSidebar.tsx`)**:
    - [ ] Change "Dashboard" -> "Overview".
    - [ ] Add "Expenses" (Link to `/expenses`).
    - [ ] Add "Income" (Link to `/income`).
    - [ ] Add "Family Management" (Link to `/family`).
    - [ ] Add "Reports & Analytics" (Link to `/reports`).
- [ ] **Menu Cleanup**:
    - [ ] Remove template-only pages (e.g., specific UI element examples) from the main sidebar.
    - [ ] Keep "Settings" and "Profile".

## Phase 3: Dashboard Refactoring
Transform e-commerce widgets into financial tracking widgets.

- [ ] **Metrics Cards (`src/components/ecommerce/EcommerceMetrics.tsx`)**:
    - [ ] Change "Total Sales" -> "Total Balance".
    - [ ] Change "Total Orders" -> "Monthly Expenses".
    - [ ] Change "Total Revenue" -> "Monthly Income".
    - [ ] Change "Total Profit" -> "Savings/Surplus".
- [ ] **Charts**:
    - [ ] Refactor `MonthlySalesChart.tsx` to show "Expense Trends".
    - [ ] Update `MonthlyTarget.tsx` to show "Budget Progress".
- [ ] **Transaction List**:
    - [ ] Refactor `RecentOrders.tsx` into `RecentTransactions.tsx`.

## Phase 4: Backend Integration (API Layer)
Connect the frontend to the Golang backend.

- [ ] **Environment Setup**: Add `NEXT_PUBLIC_API_URL` to `.env.local`.
- [ ] **API Client**: Create a centralized fetch utility in `src/lib/api.ts`.
- [ ] **Authentication**:
    - [ ] Connect `signin/page.tsx` to backend login endpoint.
    - [ ] Connect `signup/page.tsx` to backend register endpoint.
    - [ ] Implement secure session management (JWT in HTTP-only cookies).
- [ ] **Data Fetching**:
    - [ ] Implement hooks for fetching user-specific financial data.

## Phase 5: Cleanup & Optimization
- [ ] Remove unused components in `src/components/` (specifically e-commerce specific ones).
- [ ] Ensure all mock data in charts are replaced with real API responses.
- [ ] Run `npm run lint` and `npm run build` to verify production readiness.
