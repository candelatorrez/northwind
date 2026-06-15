package seed

import (
	"fmt"
	"math/rand/v2"
	"time"

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

	clients := make([]*domain.Client, 0)

	for i := 1; i <= 420; i++ {
		segment := randomSegmentDistributed()

		status := "active"
		if segment == "zombie" {
			status = "delinquent"
		} else if rand.IntN(100) < 20 {
			status = randomStatus()
		}

		client := domain.Client{
			Name:           fmt.Sprintf("Client %d", i),
			Email:          fmt.Sprintf("contact%d@company.com", i),
			Segment:        segment,
			Status:         status,
			MonthlyBilling: float64(rand.IntN(15000) + 500),
		}

		if err := db.Create(&client).Error; err != nil {
			return err
		}

		clients = append(clients, &client)

		invoiceCount := rand.IntN(5) + 1
		for j := 0; j < invoiceCount; j++ {
			invoiceStatus := "paid"
			daysOverdue := 0

			rand100 := rand.IntN(100)
			if rand100 < 15 {
				invoiceStatus = "overdue"
				daysOverdue = rand.IntN(60) + 1
			} else if rand100 < 40 {
				invoiceStatus = "pending"
			}

			dueDate := time.Now().AddDate(0, 0, -(daysOverdue + rand.IntN(30)))

			invoice := domain.Invoice{
				ClientID:  client.ID,
				Amount:    float64(rand.IntN(10000) + 500),
				Status:    invoiceStatus,
				DueDate:   dueDate,
				CreatedAt: dueDate.AddDate(0, 0, -30),
			}

			if invoiceStatus == "paid" {
				paidAt := dueDate.AddDate(0, 0, rand.IntN(10)+1)
				invoice.PaidAt = &paidAt
			}

			if err := db.Create(&invoice).Error; err != nil {
				return err
			}
		}

		score, level, reason := calculateInitialRisk(segment)

		risk := domain.RiskSnapshot{
			ClientID:  client.ID,
			Score:     score,
			Level:     level,
			Reason:    reason,
			CreatedAt: time.Now(),
		}

		if err := db.Create(&risk).Error; err != nil {
			return err
		}

		if score >= 70 && rand.IntN(100) < 60 {
			actionTypes := []string{"call", "email", "note"}
			for k := 0; k < rand.IntN(3)+1; k++ {
				action := domain.CollectionAction{
					ClientID:    client.ID,
					Type:        actionTypes[rand.IntN(len(actionTypes))],
					Notes:       fmt.Sprintf("Collection action %d for client %d", k+1, i),
					PerformedBy: "system",
					CreatedAt:   time.Now().AddDate(0, 0, -(rand.IntN(30) + 1)),
				}

				if err := db.Create(&action).Error; err != nil {
					return err
				}
			}
		}
	}

	fmt.Println("seed completed")
	return nil
}

func randomSegmentDistributed() string {
	rand100 := rand.IntN(100)
	switch {
	case rand100 < 50:
		return "enterprise"
	case rand100 < 80:
		return "startup"
	case rand100 < 95:
		return "standard"
	default:
		return "zombie"
	}
}

func randomStatus() string {
	statuses := []string{"at_risk", "delinquent", "suspended"}
	return statuses[rand.IntN(len(statuses))]
}

func calculateInitialRisk(segment string) (int, string, string) {
	baseScore := rand.IntN(50)

	switch segment {
	case "enterprise":
		baseScore = rand.IntN(20)
		return baseScore, "low", "Enterprise client with good payment history"

	case "startup":
		baseScore = 20 + rand.IntN(40)
		if baseScore >= 70 {
			return baseScore, "high", "Startup with cash flow concerns"
		} else if baseScore >= 40 {
			return baseScore, "medium", "Startup with payment delays"
		}
		return baseScore, "low", "Startup with stable payments"

	case "standard":
		baseScore = rand.IntN(70)
		if baseScore >= 70 {
			return baseScore, "high", "Multiple overdue invoices"
		} else if baseScore >= 40 {
			return baseScore, "medium", "Some payment delays"
		}
		return baseScore, "low", "Standard payment behavior"

	case "zombie":
		baseScore = 70 + rand.IntN(30)
		return baseScore, "high", "Zombie account - long term non-payer"

	default:
		return baseScore, "low", "Unknown risk"
	}
}
