package database

import (
	"github.com/candelatorrez/northwind/internal/domain"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {

	return db.AutoMigrate(
		&domain.Client{},
		&domain.Invoice{},
		&domain.RiskSnapshot{},
	)

}
