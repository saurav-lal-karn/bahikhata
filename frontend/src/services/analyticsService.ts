import apiClient from "@/lib/axios";

export interface DashboardSummary {
    total_balance: number;
    monthly_income: number;
    monthly_expense: number;
    net_savings: number;
    income_change: number;
    expense_change: number;
    savings_change: number;
    recent_activity: Activity[];
    goals_summary: GoalSummary[];
    investments: InvestmentSummary;
}

export interface Activity {
    id: string;
    type: string;
    title: string;
    amount: number;
    date: string;
    transaction_date: string;
    status: string;
    category: string;
}

export interface GoalSummary {
    id: string;
    name: string;
    target: number;
    current: number;
    percentage: number;
    deadline: string;
}

export interface InvestmentSummary {
    total_value: number;
    total_profit: number;
    profit_change: number;
    assets: AssetSummary[];
}

export interface AssetSummary {
    name: string;
    type: string;
    value: number;
    profit: number;
}

export interface ReportData {
    net_worth_timeline: { date: string; value: number }[];
    category_spending: { category: string; amount: number; color: string }[];
    health_score: number;
}

export const analyticsService = {
    getDashboardSummary: async (familyId: string) => {
        const response = await apiClient.get(
            `/analytics/dashboard/${familyId}`
        );
        return response.data.data as DashboardSummary;
    },
    getReportData: async (familyId: string) => {
        const response = await apiClient.get(`/analytics/reports/${familyId}`);
        return response.data.data as ReportData;
    },
    getTransactions: async (familyId: string, page = 1, pageSize = 10, filters = {}) => {
        const params = {
            page,
            page_size: pageSize,
            ...filters,
        };
        const response = await apiClient.get(`/transactions/${familyId}`, {
            params,
        });
        return response.data.data as {
            transactions: Activity[];
            total_count: number;
            page: number;
            page_size: number;
        };
    },
};
