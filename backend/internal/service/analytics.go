package service

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
)

type AnalyticsService interface {
	GetDashboardSummary(ctx context.Context, familyID uuid.UUID, userID uuid.UUID) (*dto.DashboardSummaryResponse, error)
	GetReportData(ctx context.Context, familyID uuid.UUID, userID uuid.UUID) (*dto.ReportResponse, error)
}

type analyticsService struct {
	txRepo         repository.TransactionRepository
	goalRepo       repository.GoalRepository
	debtRepo       repository.DebtRepository
	investmentRepo repository.InvestmentRepository
	walletRepo     repository.WalletRepository
}

func NewAnalyticsService(
	txRepo repository.TransactionRepository,
	goalRepo repository.GoalRepository,
	debtRepo repository.DebtRepository,
	investmentRepo repository.InvestmentRepository,
	walletRepo repository.WalletRepository,
) AnalyticsService {
	return &analyticsService{
		txRepo:         txRepo,
		goalRepo:       goalRepo,
		debtRepo:       debtRepo,
		investmentRepo: investmentRepo,
		walletRepo:     walletRepo,
	}
}

func (s *analyticsService) GetDashboardSummary(ctx context.Context, familyID uuid.UUID, userID uuid.UUID) (*dto.DashboardSummaryResponse, error) {
	// 1. Total Balance from Wallets
	wallets, _, err := s.walletRepo.List(ctx, familyID, userID, 1, 100)
	var totalBalance float64
	if err == nil {
		for _, w := range wallets {
			totalBalance += w.Balance
		}
	}

	// 2. Monthly Stats
	incomeStats, err := s.txRepo.GetStats(ctx, familyID, &userID, map[string]interface{}{"type": model.CategoryTypeIncome})
	expenseStats, err := s.txRepo.GetStats(ctx, familyID, &userID, map[string]interface{}{"type": model.CategoryTypeExpense})

	monthlyIncome := 0.0
	monthlyExpense := 0.0
	incomeChange := 0.0
	expenseChange := 0.0

	if err == nil && incomeStats != nil {
		monthlyIncome = incomeStats["this_month"].(float64)
		lastMonth := incomeStats["last_month"].(float64)
		if lastMonth > 0 {
			incomeChange = ((monthlyIncome - lastMonth) / lastMonth) * 100
		}
	}
	if err == nil && expenseStats != nil {
		monthlyExpense = expenseStats["this_month"].(float64)
		lastMonth := expenseStats["last_month"].(float64)
		if lastMonth > 0 {
			expenseChange = ((monthlyExpense - lastMonth) / lastMonth) * 100
		}
	}

	netSavings := monthlyIncome - monthlyExpense
	// Simplified savings change
	savingsChange := incomeChange - expenseChange

	// 3. Recent Activity (Latest 5 Transactions)
	txs, _, _ := s.txRepo.List(ctx, familyID, &userID, map[string]interface{}{"page_size": 5})
	recentItems := make([]dto.ActivityResponse, 0)
	for _, tx := range txs {
		recentItems = append(recentItems, dto.ActivityResponse{
			ID:     tx.ID.String(),
			Type:   string(tx.Type),
			Title:  tx.Description,
			Amount: tx.Amount,
			Date:   tx.TransactionDate,
			Status: "Completed",
			Category: func() string {
				if tx.Category != nil {
					return tx.Category.Name
				}
				return "General"
			}(),
		})
	}

	// 4. Goals Summary
	goals, _ := s.goalRepo.List(ctx, familyID, userID)
	goalsSummary := make([]dto.GoalSummary, 0)
	for _, g := range goals {
		percentage := 0.0
		if g.TargetAmount > 0 {
			percentage = (g.CurrentAmount / g.TargetAmount) * 100
		}
		goalsSummary = append(goalsSummary, dto.GoalSummary{
			ID:         g.ID.String(),
			Name:       g.Name,
			Target:     g.TargetAmount,
			Current:    g.CurrentAmount,
			Percentage: percentage,
			Deadline:   g.Deadline.Format("02 Jan 2006"),
		})
	}

	// 5. Investment Summary
	investments, _ := s.investmentRepo.List(ctx, &familyID, &userID)
	var totalInvestedValue float64
	var totalCurrentValue float64
	assetSummaries := make([]dto.AssetSummary, 0)
	for _, inv := range investments {
		val := inv.CurrentPrice * inv.Quantity
		profit := val - (inv.AvgBuyPrice * inv.Quantity)
		totalInvestedValue += inv.AvgBuyPrice * inv.Quantity
		totalCurrentValue += val
		assetSummaries = append(assetSummaries, dto.AssetSummary{
			Name:   inv.Name,
			Type:   inv.Type,
			Value:  val,
			Profit: profit,
		})
	}
	totalProfit := totalCurrentValue - totalInvestedValue
	profitPct := 0.0
	if totalInvestedValue > 0 {
		profitPct = (totalProfit / totalInvestedValue) * 100
	}

	return &dto.DashboardSummaryResponse{
		TotalBalance:   totalBalance,
		MonthlyIncome:  monthlyIncome,
		MonthlyExpense: monthlyExpense,
		NetSavings:     netSavings,
		IncomeChange:   incomeChange,
		ExpenseChange:  expenseChange,
		SavingsChange:  savingsChange,
		RecentActivity: recentItems,
		GoalsSummary:   goalsSummary,
		Investments: dto.InvestmentSummary{
			TotalValue:   totalCurrentValue,
			TotalProfit:  totalProfit,
			ProfitChange: profitPct,
			Assets:       assetSummaries,
		},
	}, nil
}

func (s *analyticsService) GetReportData(ctx context.Context, familyID uuid.UUID, userID uuid.UUID) (*dto.ReportResponse, error) {
	// Simplified report data for now
	// This would ideally fetch historical snapshots of net worth
	
	now := time.Now()
	timeline := make([]dto.NetWorthPoint, 0)
	for i := 5; i >= 0; i-- {
		date := now.AddDate(0, -i, 0).Format("Jan 06")
		timeline = append(timeline, dto.NetWorthPoint{
			Date:  date,
			Value: 150000 + float64(i)*25000, // Dummy historical data for now
		})
	}

	return &dto.ReportResponse{
		NetWorthTimeline: timeline,
		CategorySpending: []dto.CategorySpend{
			{Category: "Housing", Amount: 25000, Color: "#8B5CF6"},
			{Category: "Food", Amount: 8500, Color: "#EC4899"},
			{Category: "Transport", Amount: 4200, Color: "#F59E0B"},
			{Category: "Utilities", Amount: 3100, Color: "#10B981"},
		},
		HealthScore: 82,
	}, nil
}
