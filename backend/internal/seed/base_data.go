package seed

import (
	"time"

	"github.com/google/uuid"
	"github.com/lib/pq"
	models "github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

var categories = []models.ExpenseCategory{
	{
		ID:          uuid.New(),
		Name:        "Rent/Mortgage",
		Description: "Expenses related to Rent/Mortgage",
		Tags:        []string{"Housing & Utilities"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Electricity",
		Description: "Expenses related to Electricity",
		Tags:        []string{"Housing & Utilities"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Water",
		Description: "Expenses related to Water",
		Tags:        []string{"Housing & Utilities"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Internet/Phone",
		Description: "Expenses related to Internet/Phone",
		Tags:        []string{"Housing & Utilities"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Maintenance",
		Description: "Expenses related to Maintenance",
		Tags:        []string{"Housing & Utilities"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Daily groceries",
		Description: "Expenses related to Daily groceries",
		Tags:        []string{"Food & Groceries"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Eating out",
		Description: "Expenses related to Eating out",
		Tags:        []string{"Food & Groceries"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Snacks & beverages",
		Description: "Expenses related to Snacks & beverages",
		Tags:        []string{"Food & Groceries"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Fuel",
		Description: "Expenses related to Fuel",
		Tags:        []string{"Transportation"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Public transport",
		Description: "Expenses related to Public transport",
		Tags:        []string{"Transportation"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Bike/car maintenance",
		Description: "Expenses related to Bike/car maintenance",
		Tags:        []string{"Transportation"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Ride-sharing (e.g., Pathao, Tootle)",
		Description: "Expenses related to Ride-sharing (e.g., Pathao, Tootle)",
		Tags:        []string{"Transportation"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Gym/Yoga",
		Description: "Expenses related to Gym/Yoga",
		Tags:        []string{"Health & Fitness"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Medicines",
		Description: "Expenses related to Medicines",
		Tags:        []string{"Health & Fitness"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Doctor visits",
		Description: "Expenses related to Doctor visits",
		Tags:        []string{"Health & Fitness"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Health insurance",
		Description: "Expenses related to Health insurance",
		Tags:        []string{"Health & Fitness"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Haircuts",
		Description: "Expenses related to Haircuts",
		Tags:        []string{"Personal & Grooming"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Skincare",
		Description: "Expenses related to Skincare",
		Tags:        []string{"Personal & Grooming"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Toiletries",
		Description: "Expenses related to Toiletries",
		Tags:        []string{"Personal & Grooming"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Netflix/YouTube Premium",
		Description: "Expenses related to Netflix/YouTube Premium",
		Tags:        []string{"Entertainment & Subscriptions"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Movies, outings",
		Description: "Expenses related to Movies, outings",
		Tags:        []string{"Entertainment & Subscriptions"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Gaming",
		Description: "Expenses related to Gaming",
		Tags:        []string{"Entertainment & Subscriptions"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Books & Magazines",
		Description: "Expenses related to Books & Magazines",
		Tags:        []string{"Entertainment & Subscriptions"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Tuition fees",
		Description: "Expenses related to Tuition fees",
		Tags:        []string{"Education & Learning"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Online courses",
		Description: "Expenses related to Online courses",
		Tags:        []string{"Education & Learning"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Stationery/Books",
		Description: "Expenses related to Stationery/Books",
		Tags:        []string{"Education & Learning"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Clothes",
		Description: "Expenses related to Clothes",
		Tags:        []string{"Shopping"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Electronics",
		Description: "Expenses related to Electronics",
		Tags:        []string{"Shopping"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Home items",
		Description: "Expenses related to Home items",
		Tags:        []string{"Shopping"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Loans",
		Description: "Expenses related to Loans",
		Tags:        []string{"Bills & EMIs"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Credit card payments",
		Description: "Expenses related to Credit card payments",
		Tags:        []string{"Bills & EMIs"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Installments",
		Description: "Expenses related to Installments",
		Tags:        []string{"Bills & EMIs"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Family support",
		Description: "Expenses related to Family support",
		Tags:        []string{"Family & Gifts"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Gifts",
		Description: "Expenses related to Gifts",
		Tags:        []string{"Family & Gifts"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Celebrations",
		Description: "Expenses related to Celebrations",
		Tags:        []string{"Family & Gifts"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Deposits to savings",
		Description: "Expenses related to Deposits to savings",
		Tags:        []string{"Savings & Investments"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Mutual funds, stocks",
		Description: "Expenses related to Mutual funds, stocks",
		Tags:        []string{"Savings & Investments"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Crypto",
		Description: "Expenses related to Crypto",
		Tags:        []string{"Savings & Investments"},
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Miscellaneous",
		Description: "Expenses related to Miscellaneous",
		Tags:        []string{"Miscellaneous"},
		IsSystem:    true,
	},
}

func seedExpenseCategories(db *gorm.DB) {
	// seed expense categories here
	for _, category := range categories {
		// Check if the category already exists in the database, Create only if no category with same name is found
		var existingCategory models.ExpenseCategory
		if err := db.Where("name = ?", category.Name).First(&existingCategory).Error; err == nil {
			continue
		}

		// Create the category
		var newCategory models.ExpenseCategory
		newCategory.ID = category.ID
		newCategory.Name = category.Name
		newCategory.Description = category.Description
		newCategory.Tags = pq.StringArray(category.Tags)
		newCategory.IsSystem = category.IsSystem
		newCategory.CreatedAt = time.Now()
		newCategory.UpdatedAt = time.Now()
		db.Create(&newCategory)
	}
}

var paymentMethods = []models.PaymentMethod{
	{
		ID:          uuid.New(),
		Name:        "Cash",
		Description: "Payment method for cash",
		IconName:    "cash",
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Bank transfer",
		Description: "Payment method for bank transfer",
		IconName:    "bank-transfer",
		IsSystem:    true,
	},
	
	{
		ID:          uuid.New(),
		Name:        "Credit card",
		Description: "Payment method for credit card",
		IconName:    "credit-card",
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Debit card",
		Description: "Payment method for debit card",
		IconName:    "debit-card",
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "UPI",
		Description: "Payment method for UPI",
		IconName:    "upi",
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Mobile banking",
		Description: "Payment method for Mobile banking",
		IconName:    "mobile-banking",
		IsSystem:    true,
	},
}

func seedPaymentMethods(db *gorm.DB) {
	// seed payment methods here
	for _, paymentMethod := range paymentMethods {
		// Check if the payment method already exists in the database, Create only if no payment method with same name is found
		var existingPaymentMethod models.PaymentMethod
		if err := db.Where("name = ?", paymentMethod.Name).First(&existingPaymentMethod).Error; err == nil {
			continue
		}

		// Create the payment method
		var newPaymentMethod models.PaymentMethod
		newPaymentMethod.ID = paymentMethod.ID
		newPaymentMethod.Name = paymentMethod.Name
		newPaymentMethod.Description = paymentMethod.Description
		newPaymentMethod.IconName = paymentMethod.IconName
		newPaymentMethod.IsSystem = paymentMethod.IsSystem
		// For system payment methods, FamilyID and CreatedByID must be nil
		if paymentMethod.IsSystem {
			newPaymentMethod.FamilyID = nil
			newPaymentMethod.CreatedByID = nil
		}
		newPaymentMethod.CreatedAt = time.Now()
		newPaymentMethod.UpdatedAt = time.Now()
		db.Create(&newPaymentMethod)
	}
}