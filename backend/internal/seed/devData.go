package seed

import (
	"time"

	"github.com/google/uuid"
	models "github.com/sauravkarn541/bahikhata/internal/model"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

var familyId = uuid.New()
var adminUserId = uuid.New()

var families = []models.Family{
	{
		ID:        familyId,
		Name:      "Karn Family",
		CreatedBy: adminUserId,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	},
}

var users = []models.User{
	{
		ID:              uuid.New(),
		FirstName:       "Saurav",
		LastName:        "Karn",
		UserName:        "sauravkarn",
		Email:           "sauravkarn541@gmail.com",
		FamilyID:        familyId,
		Password:        string(mustHashPassword("password")),
		Role:            "admin",
		Country:         "Nepal",
		LastLoggedInAt:  time.Now(),
		EmailVerified:   true,
		EmailVerifiedAt: time.Now(),
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	},
	{
		ID:              uuid.New(),
		FirstName:       "Super",
		LastName:        "Admin",
		UserName:        "admin",
		Email:           "superadmin@gmail.com",
		FamilyID:        familyId,
		Password:        string(mustHashPassword("password")),
		Role:            "admin",
		Country:         "Nepal",
		LastLoggedInAt:  time.Now(),
		EmailVerified:   true,
		EmailVerifiedAt: time.Now(),
		CreatedAt:       time.Now(),
		UpdatedAt:       time.Now(),
	},
}

func seedUsers(db *gorm.DB) {
	// seed users here
	for _, user := range users {
		// Check if the user already exists in the database, Create only if no user with same email is found
		var existingUser models.User
		if err := db.Where("email = ?", user.Email).First(&existingUser).Error; err == nil {
			continue
		}

		// Create the user
		db.Create(&user)
	}
}

func seedFamilies(db *gorm.DB) {
	// seed family here
	for _, family := range families {
		// Check if the family already exists in the database, Create only if no family with same name is found
		var existingFamily models.Family
		if err := db.Where("name = ?", family.Name).First(&existingFamily).Error; err == nil {
			continue
		}

		// Create the family
		db.Create(&family)
	}
}

func mustHashPassword(password string) []byte {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}
	return hashedPassword
}
