import type { Metadata } from "next";
import React from "react";
import { FinancialMetrics } from "@/components/dashboard/FinancialMetrics";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";

export const metadata: Metadata = {
  title: "Bahikhata Dashboard | Personal Expense Tracker",
  description: "Monitor your family ledgers, track expenses, and manage your budget with Bahikhata.",
};

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <FinancialMetrics />

      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* Main Chart Area */}
        <div className="col-span-12 xl:col-span-8">
          <CashFlowChart />
        </div>

        {/* Categories breakdown */}
        <div className="col-span-12 xl:col-span-4">
          <ExpenseBreakdown />
        </div>

        {/* Recent Activity */}
        <div className="col-span-12">
          <RecentTransactions />
        </div>
      </div>
    </div>
  );
}
