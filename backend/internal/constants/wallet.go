package constants

// Wallet validation constants define the limits for wallet field validation.
const (
	// WalletNameMinLength is the minimum allowed length for wallet names.
	WalletNameMinLength = 1

	// WalletNameMaxLength is the maximum allowed length for wallet names.
	WalletNameMaxLength = 100

	// WalletDescriptionMaxLength is the maximum allowed length for wallet descriptions.
	WalletDescriptionMaxLength = 500

	// WalletCurrencyLength is the required length for currency codes (ISO 4217).
	WalletCurrencyLength = 3

	// WalletIssuerNameMaxLength is the maximum length for wallet issuer names.
	WalletIssuerNameMaxLength = 100

	// WalletProviderIDMaxLength is the maximum length for provider wallet IDs.
	WalletProviderIDMaxLength = 100

	// WalletCustomTypeNameMaxLength is the maximum length for custom wallet type names.
	WalletCustomTypeNameMaxLength = 50
)

// Wallet pagination constants define the defaults and limits for pagination.
const (
	// WalletDefaultPage is the default page number when not specified.
	WalletDefaultPage = 1

	// WalletDefaultPageSize is the default number of wallets per page.
	WalletDefaultPageSize = 10

	// WalletMinPageSize is the minimum allowed page size.
	WalletMinPageSize = 1

	// WalletMaxPageSize is the maximum allowed page size.
	WalletMaxPageSize = 100
)

// Wallet business rule constants.
const (
	// WalletMinStartingBalance is the minimum allowed starting balance.
	WalletMinStartingBalance = 0.0
)
