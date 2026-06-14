package seed

import (
	"fmt"
	"math/rand/v2"

	"github.com/candelatorrez/northwind/internal/domain"
	"gorm.io/gorm"
)

func Run(db *gorm.DB) error {
	var count int64

	err := db.Model(&domain.Client{}).Count(&count).Error

	if err != nil {
		return err
	}

	if count > 0 {
		fmt.Println("seed already executed")

		return nil
	}

	fmt.Println("creating seed data...")

	for i := 1; i <= 420; i++ {
		segment := randomSegment()

		status := "active"

		if rand.IntN(100) < 20 {
			status = "delinquent"
		}

		client := domain.Client{
			Name:           fmt.Sprintf("Client %d", i),
			Segment:        segment,
			Status:         status,
			MonthlyBilling: float64(rand.IntN(15000) + 500),
		}

		if err := db.Create(&client).Error; err != nil {
			return err
		}

		invoiceStatus := "paid"

		if rand.IntN(100) < 15 {
			invoiceStatus = "overdue"
		}

		invoice := domain.Invoice{
			ClientID: client.ID,
			Amount:   float64(rand.IntN(10000) + 500),
			Status:   invoiceStatus,
		}

		if err := db.Create(&invoice).Error; err != nil {
			return err
		}

		score := rand.IntN(100)

		level := riskLevel(score)

		risk := domain.RiskSnapshot{
			ClientID: client.ID,
			Score:    score,
			Level:    level,
		}

		if err := db.Create(&risk).Error; err != nil {
			return err
		}
	}

	fmt.Println("seed completed")

	return nil
}

func randomSegment() string {
	segments := []string{
		"enterprise",
		"startup",
		"standard",
	}

	return segments[rand.IntN(len(segments))]
}

func riskLevel(score int) string {
	switch {
	case score >= 80:
		return "critical"
	case score >= 60:
		return "high"
	case score >= 30:
		return "medium"
	default:
		return "low"
	}
}
