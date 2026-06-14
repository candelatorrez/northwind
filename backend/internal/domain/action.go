package domain

import "time"

type CollectionAction struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	ClientID    uint      `json:"clientId"`
	Type        string    `gorm:"type:varchar(20)" json:"type"`
	Notes       string    `gorm:"type:text" json:"notes"`
	PerformedBy string    `gorm:"type:varchar(255)" json:"performedBy"`
	CreatedAt   time.Time `json:"createdAt"`
}
