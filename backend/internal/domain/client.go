package domain

import (
	"time"

	"gorm.io/gorm"
)

type Client struct {
	ID             uint           `gorm:"primarykey" json:"id"`
	Name           string         `gorm:"not null" json:"name"`
	Email          string         `gorm:"type:varchar(255)" json:"email"`
	Segment        string         `gorm:"type:varchar(20)" json:"segment"`
	Status         string         `gorm:"type:varchar(20)" json:"status"`
	MonthlyBilling float64        `json:"monthlyBilling"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `json:"deletedAt"`
}

type ClientDashboardDTO struct {
	ID             uint       `gorm:"column:id" json:"id"`
	Email          string     `gorm:"column:email" json:"email"`
	MonthlyBilling float64    `gorm:"column:monthly_billing" json:"monthlyBilling"`
	RiskScore      int        `gorm:"column:risk_score" json:"riskScore"`
	RiskLevel      string     `gorm:"column:risk_level" json:"riskLevel"`
	Name           string     `json:"name"`
	Segment        string     `json:"segment"`
	Status         string     `json:"status"`
	CreatedAt      time.Time  `json:"createdAt"`
	LastActionAt   *time.Time `json:"lastActionAt"`
}
