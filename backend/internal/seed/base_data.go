package seed

import (
	"time"

	"github.com/google/uuid"
	models "github.com/sauravkarn541/bahikhata/internal/model"
	"gorm.io/gorm"
)

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

var walletTypes = []models.WalletType{
	{
		ID:          uuid.New(),
		Name:        "Bank Account",
		Description: "Wallet type for bank account",
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Digital Wallet",
		Description: "Wallet type for digital wallet",
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Physical Wallet / Cash",
		Description: "Wallet type for physical wallet / cash",
		IsSystem:    true,
	},
	{
		ID:          uuid.New(),
		Name:        "Credit Card Account",
		Description: "Wallet type for credit card account",
		IsSystem:    true,
	},
}

func seedWalletTypes(db *gorm.DB) {
	// seed wallet types here
	for _, walletType := range walletTypes {
		// Check if the wallet type already exists in the database, Create only if no wallet type with same name is found
		var existingWalletType models.WalletType
		if err := db.Where("name = ?", walletType.Name).First(&existingWalletType).Error; err == nil {
			continue
		}

		// Create the wallet type
		var newWalletType models.WalletType
		newWalletType.ID = walletType.ID
		newWalletType.Name = walletType.Name
		newWalletType.Description = walletType.Description
		newWalletType.IsSystem = walletType.IsSystem
		newWalletType.CreatedAt = time.Now()
		newWalletType.UpdatedAt = time.Now()
		newWalletType.FamilyID = nil
		newWalletType.CreatedByID = nil
		db.Create(&newWalletType)
	}
}

var transactionCategories = []models.TransactionCategory{
	// Income Categories
	{Name: "Salary", Type: models.CategoryTypeIncome, Description: "Monthly salary income", IsSystem: true},
	{Name: "Freelancing", Type: models.CategoryTypeIncome, Description: "Income from freelance work", IsSystem: true},
	{Name: "Investments", Type: models.CategoryTypeIncome, Description: "Income from dividends or investments", IsSystem: true},
	{Name: "Rental Income", Type: models.CategoryTypeIncome, Description: "Income from property rentals", IsSystem: true},
	{Name: "Gifts", Type: models.CategoryTypeIncome, Description: "Monetary gifts received", IsSystem: true},

	// Expense Categories
	{Name: "Rent/Mortgage", Type: models.CategoryTypeExpense, Description: "Housing rent or mortgage payments", IsSystem: true},
	{Name: "Electricity", Type: models.CategoryTypeExpense, Description: "Utilities: Electricity bill", IsSystem: true},
	{Name: "Water", Type: models.CategoryTypeExpense, Description: "Utilities: Water bill", IsSystem: true},
	{Name: "Internet/Phone", Type: models.CategoryTypeExpense, Description: "Communication and internet expenses", IsSystem: true},
	{Name: "Daily groceries", Type: models.CategoryTypeExpense, Description: "Food and household groceries", IsSystem: true},
	{Name: "Eating out", Type: models.CategoryTypeExpense, Description: "Restaurant and dining expenses", IsSystem: true},
	{Name: "Fuel", Type: models.CategoryTypeExpense, Description: "Vehicle fuel expenses", IsSystem: true},
	{Name: "Public transport", Type: models.CategoryTypeExpense, Description: "Bus, train, or metro fares", IsSystem: true},
	{Name: "Medicines", Type: models.CategoryTypeExpense, Description: "Health and medicine expenses", IsSystem: true},
	{Name: "Shopping", Type: models.CategoryTypeExpense, Description: "General shopping expenses", IsSystem: true},
	{Name: "Miscellaneous", Type: models.CategoryTypeExpense, Description: "Other miscellaneous expenses", IsSystem: true},
}

func seedTransactionCategories(db *gorm.DB) {
	for _, category := range transactionCategories {
		var existing models.TransactionCategory
		if err := db.Where("name = ? AND type = ?", category.Name, category.Type).First(&existing).Error; err == nil {
			continue
		}

		newCat := category
		newCat.ID = uuid.New()
		newCat.CreatedAt = time.Now()
		newCat.UpdatedAt = time.Now()
		newCat.IsActive = true
		db.Create(&newCat)
	}
}