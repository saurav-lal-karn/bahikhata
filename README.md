# Bahikhata

Bahikhata is a comprehensive web application designed to help users manage their personal finances by tracking expenses, incomes, and investments. The platform allows users to add financial records manually, by uploading documents, or by uploading photos of bills. It also supports family accounts, enabling family members to contribute to a collective financial overview, which can be managed and viewed by an admin.

## Features

- **Financial Tracking**: Record expenses, incomes, and investments.
- **Multiple Entry Methods**:
  - Manual entry
  - Document upload
  - Bill photo upload
- **Family Management**: Create family groups and invite members to join.
- **Admin Dashboard**: Aggregated view of family finances.
- **Data Visualization**: Charts and graphs to analyze financial health.
- **AI-Powered Automation**:
  - **Smart OCR & LLM Integration**: Automatically extracts detailed financial data from uploaded documents and bills, converting them into structured JSON for seamless record-keeping.
  - **Document Chatbot**: Interact with your uploaded documents using an AI assistant to get insights and answers directly from your files.
- **Advanced Financial Tools**:
  - **Smart Budgeting**: Set monthly budgets for specific categories and receive alerts when you're close to exceeding them.
  - **Subscription & Recurring Payments**: Automatic tracking of monthly subscriptions and recurring bills to ensure you never miss a payment.
  - **Multi-Currency Support**: Seamlessly manage finances in multiple currencies with real-time exchange rate updates.
  - **Export & Tax Reporting**: Generate comprehensive CSV and PDF reports for tax purposes or external analysis.
  - **Investment Portfolio Analytics**: detailed tracking of stock and crypto investments with ROI calculations and real-time performance metrics.

## Technology Stack

### Backend
- **Language**: Go
- **Framework**: Gin Web Framework
- **Database**: PostgreSQL
- **ORM**: GORM (with Goose for migrations)
- **Key Libraries**:
  - `github.com/golang-jwt/jwt/v5` (Authentication)
  - `github.com/google/uuid` (UUID generation)
  - `github.com/joho/godotenv` (Environment variable management)

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Template**: TailAdmin
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Key Libraries**:
  - `apexcharts` / `react-apexcharts` (Charts)
  - `jsvectormap` (Maps)

## Getting Started

### Prerequisites
- Go 1.24+
- Node.js 18.x+ (Recommended 20.x aka LTS)
- PostgreSQL
- Make (optional, for running Makefile commands)

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Configure Environment Variables:**
   Copy the example environment file and update the values with your database credentials.
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   - `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_HOSTNAME`, `DB_PORT`
   - `ACCESS_KEY`, `REFRESH_KEY` (for JWT)

3. **Install Dependencies:**
   ```bash
   go mod download
   ```

4. **Run Database Migrations:**
   ```bash
   make set-up-db
   # OR if using goose directly
   goose -dir ./internal/migrations postgres "user=... password=... dbname=... sslmode=disable" up
   ```
   *(Note: Check the `Makefile` for available commands)*

5. **Run the Server:**
   ```bash
   go run main.go
   ```
   The backend will typically run on the port defined in `APP_PORT` (e.g., `:8080`).

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
   *Note: Use the `--legacy-peer-deps` flag if you encounter dependency conflicts.*

3. **Run the Development Server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.