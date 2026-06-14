package domain

import "time"

type RiskSnapshot struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	ClientID  uint      `json:"clientId"`
	Score     int       `json:"score"`
	Level     string    `gorm:"type:varchar(20)" json:"level"`
	Reason    string    `json:"reason"`
	CreatedAt time.Time `json:"createdAt"`
}
