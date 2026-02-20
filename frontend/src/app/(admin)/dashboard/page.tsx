import type { Metadata } from "next";
import React from "react";
import { FinancialMetrics } from "@/components/dashboard/FinancialMetrics";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ExpenseTrends } from "@/components/dashboard/ExpenseTrends";
import { BudgetProgress } from "@/components/dashboard/BudgetProgress";
import { InvestmentSummary } from "@/components/dashboard/InvestmentSummary";

export const metadata: Metadata = {
    title: "Bahikhata Dashboard | Personal Expense Tracker",
    description:
        "Monitor your family ledgers, track expenses, and manage your budget with Bahikhata.",
};

export default function Dashboard() {
    return (
        <div className="space-y-6">
            {/* Top Metrics Row */}
            <FinancialMetrics />

            <div className="grid grid-cols-12 gap-4 md:gap-6">
                {/* Main Charts & Progress */}
                <div className="col-span-12 space-y-6 xl:col-span-8">
                    <CashFlowChart />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                        <ExpenseTrends />
                        <ExpenseBreakdown />
                    </div>
                </div>

                {/* Sidebar Widgets */}
                <div className="col-span-12 space-y-6 xl:col-span-4">
                    <InvestmentSummary />
                    <BudgetProgress />
                </div>

                {/* Recent Activity */}
                <div className="col-span-12">
                    <RecentTransactions />
                </div>
            </div>
        </div>
    );
}
