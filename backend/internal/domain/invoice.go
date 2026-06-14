package domain

import "time"

type Invoice struct {
	ID        uint       `gorm:"primaryKey" json:"id"`
	ClientID  uint       `json:"clientId"`
	Amount    float64    `json:"amount"`
	Status    string     `json:"status"`
	DueDate   time.Time  `json:"dueDate"`
	CreatedAt time.Time  `json:"createdAt"`
	PaidAt    *time.Time `json:"paidAt"`
}
