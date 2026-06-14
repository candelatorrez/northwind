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
