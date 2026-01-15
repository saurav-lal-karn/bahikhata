package seed

import "github.com/sauravkarn541/bahikhata/internal/config"

func SeedBaseData(app config.Application) {
	// Seed base data here like expense categories
	seedExpenseCategories(app.DB)
	seedPaymentMethods(app.DB)
}

func SeedDevData(app config.Application) {
	// Seed dev data here like users and family
	seedFamilies(app.DB)
	seedUsers(app.DB)
}
