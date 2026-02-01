package service

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/sauravkarn541/bahikhata/internal/dto"
	"github.com/sauravkarn541/bahikhata/internal/model"
	"github.com/sauravkarn541/bahikhata/internal/repository"
	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type AnalyticsService interface {
	GetDashboardSummary(ctx context.Context, familyID uuid.UUID, userID uuid.UUID) (*dto.DashboardSummaryResponse, error)
	GetReportData(ctx context.Context, familyID uuid.UUID, userID uuid.UUID) (*dto.ReportResponse, error)
	GenerateNetWorthSnapshot(ctx context.Context, familyId *uuid.UUID, userId *uuid.UUID) error
	GenerateMonthlySummary(ctx context.Context, familyId *uuid.UUID, userId *uuid.UUID, month time.Time) error
}

type analyticsService struct {
	db             *gorm.DB
	txRepo         repository.TransactionRepository
	goalRepo       repository.GoalRepository
	debtRepo       repository.DebtRepository
	investmentRepo repository.InvestmentRepository
	walletRepo     repository.WalletRepository
}

func NewAnalyticsService(
	db *gorm.DB,
	txRepo repository.TransactionRepository,
	goalRepo repository.GoalRepository,
	debtRepo repository.DebtRepository,
	investmentRepo repository.InvestmentRepository,
	walletRepo repository.WalletRepository,
) AnalyticsService {
	return &analyticsService{
		db:             db,
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

// GenerateNetWorthSnapshot creates a snapshot of the current net worth for a user/family.
func (s *analyticsService) GenerateNetWorthSnapshot(ctx context.Context, familyId *uuid.UUID, userId *uuid.UUID) error {
	var totalAssets, totalLiabilities float64

	// Sum wallet balances as assets
	query := s.db.WithContext(ctx).Model(&model.Wallet{})
	if familyId != nil {
		query = query.Where("family_id = ?", familyId)
	} else if userId != nil {
		query = query.Where("user_id = ?", userId)
	}
	query.Select("SUM(balance)").Scan(&totalAssets)

	// Sum debts as liabilities
	debtQuery := s.db.WithContext(ctx).Model(&model.Debt{})
	if familyId != nil {
		debtQuery = debtQuery.Where("family_id = ?", familyId)
	} else if userId != nil {
		debtQuery = debtQuery.Where("user_id = ?", userId)
	}
	debtQuery.Select("SUM(remaining_amount)").Scan(&totalLiabilities)

	snapshot := model.NetWorthSnapshot{
		FamilyID:         familyId,
		UserID:           userId,
		SnapshotDate:     time.Now(),
		TotalAssets:      totalAssets,
		TotalLiabilities: totalLiabilities,
		NetWorth:         totalAssets - totalLiabilities,
	}

	return s.db.WithContext(ctx).Create(&snapshot).Error
}

// GenerateMonthlySummary creates or updates the summary for the given month.
func (s *analyticsService) GenerateMonthlySummary(ctx context.Context, familyId *uuid.UUID, userId *uuid.UUID, month time.Time) error {
	startOfMonth := time.Date(month.Year(), month.Month(), 1, 0, 0, 0, 0, month.Location())
	endOfMonth := startOfMonth.AddDate(0, 1, 0)

	var totalIncome, totalExpense float64

	// Sum income
	incomeQuery := s.db.WithContext(ctx).Model(&model.Transaction{}).Where("type = 'INCOME' AND transaction_date >= ? AND transaction_date < ?", startOfMonth, endOfMonth)
	if familyId != nil {
		incomeQuery = incomeQuery.Where("family_id = ?", familyId)
	} else if userId != nil {
		incomeQuery = incomeQuery.Where("user_id = ?", userId)
	}
	incomeQuery.Select("SUM(amount)").Scan(&totalIncome)

	// Sum expense
	expenseQuery := s.db.WithContext(ctx).Model(&model.Transaction{}).Where("type = 'EXPENSE' AND transaction_date >= ? AND transaction_date < ?", startOfMonth, endOfMonth)
	if familyId != nil {
		expenseQuery = expenseQuery.Where("family_id = ?", familyId)
	} else if userId != nil {
		expenseQuery = expenseQuery.Where("user_id = ?", userId)
	}
	expenseQuery.Select("SUM(amount)").Scan(&totalExpense)

	// Find top expense category
	var topCategoryID *uuid.UUID
	topCategoryQuery := s.db.WithContext(ctx).Model(&model.Transaction{}).
		Select("category_id, SUM(amount) as total").
		Where("type = 'EXPENSE' AND transaction_date >= ? AND transaction_date < ?", startOfMonth, endOfMonth)
	if familyId != nil {
		topCategoryQuery = topCategoryQuery.Where("family_id = ?", familyId)
	} else if userId != nil {
		topCategoryQuery = topCategoryQuery.Where("user_id = ?", userId)
	}
	topCategoryQuery.Group("category_id").Order("total DESC").Limit(1).Scan(&topCategoryID)

	summary := model.MonthlySummary{
		FamilyID:             familyId,
		UserID:               userId,
		Month:                startOfMonth,
		TotalIncome:          totalIncome,
		TotalExpense:         totalExpense,
		Savings:              totalIncome - totalExpense,
		TopExpenseCategoryID: topCategoryID,
	}

	return s.db.WithContext(ctx).Clauses(clause.OnConflict{
		Columns:   []clause.Column{{Name: "family_id"}, {Name: "user_id"}, {Name: "month"}},
		DoUpdates: clause.AssignmentColumns([]string{"total_income", "total_expense", "savings", "top_expense_category_id", "updated_at"}),
	}).Create(&summary).Error
}
