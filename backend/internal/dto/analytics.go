package dto

import "time"

type DashboardSummaryResponse struct {
	TotalBalance    float64            `json:"total_balance"`
	MonthlyIncome   float64            `json:"monthly_income"`
	MonthlyExpense  float64            `json:"monthly_expense"`
	NetSavings      float64            `json:"net_savings"`
	IncomeChange    float64            `json:"income_change"`  // Percentage
	ExpenseChange   float64            `json:"expense_change"` // Percentage
	SavingsChange   float64            `json:"savings_change"` // Percentage
	BalanceChange   float64            `json:"balance_change"` // Percentage
	
	RecentActivity  []ActivityResponse `json:"recent_activity"`
	GoalsSummary    []GoalSummary      `json:"goals_summary"`
	Investments     InvestmentSummary  `json:"investments"`
}

type ActivityResponse struct {
	ID          string    `json:"id"`
	Type        string    `json:"type"` // income, expense, contribution, repayment, investment_transaction
	Title       string    `json:"title"`
	Amount      float64   `json:"amount"`
	Date        time.Time `json:"date"`
	Status      string    `json:"status"`
	Category    string    `json:"category"`
}

type GoalSummary struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Target      float64 `json:"target"`
	Current     float64 `json:"current"`
	Percentage  float64 `json:"percentage"`
	Deadline    string  `json:"deadline"`
}

type InvestmentSummary struct {
	TotalValue  float64             `json:"total_value"`
	TotalProfit float64             `json:"total_profit"`
	ProfitChange float64            `json:"profit_change"` // Percentage
	Assets      []AssetSummary       `json:"assets"`
}

type AssetSummary struct {
	Name   string  `json:"name"`
	Type   string  `json:"type"`
	Value  float64 `json:"value"`
	Profit float64 `json:"profit"`
}

type ReportResponse struct {
	NetWorthTimeline []NetWorthPoint `json:"net_worth_timeline"`
	CategorySpending []CategorySpend `json:"category_spending"`
	HealthScore      int             `json:"health_score"`
}

type NetWorthPoint struct {
	Date  string  `json:"date"`
	Value float64 `json:"value"`
}

type CategorySpend struct {
	Category string  `json:"category"`
	Amount   float64 `json:"amount"`
	Color    string  `json:"color"`
}
