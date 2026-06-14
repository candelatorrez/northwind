package repository

import (
	"time"

	"github.com/candelatorrez/northwind/internal/domain"
	"gorm.io/gorm"
)

type RiskRepository struct {
	db *gorm.DB
}

func NewRiskRepository(db *gorm.DB) *RiskRepository {
	return &RiskRepository{
		db: db,
	}
}

func (r *RiskRepository) FindByClientID(clientID uint) (*domain.RiskSnapshot, error) {
	var risk domain.RiskSnapshot

	err := r.db.Where("client_id = ?", clientID).Order("created_at DESC").First(&risk).Error

	return &risk, err
}

func (r *RiskRepository) Create(risk *domain.RiskSnapshot) error {
	return r.db.Create(risk).Error
}

func (r *RiskRepository) UpdateByClientID(clientID uint, score int, level, reason string) error {
	risk := domain.RiskSnapshot{
		ClientID:  clientID,
		Score:     score,
		Level:     level,
		Reason:    reason,
		CreatedAt: time.Now(),
	}

	return r.db.Create(&risk).Error
}

func (r *RiskRepository) CountHighRisk() (int64, error) {
	var count int64

	err := r.db.Model(&domain.RiskSnapshot{}).Where("score >= ?", 70).Distinct("client_id").Count(&count).Error

	return count, err
}
