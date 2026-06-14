package repository

import (
	"github.com/candelatorrez/northwind/internal/domain"
	"gorm.io/gorm"
)

type ClientRepository struct {
	db *gorm.DB
}

func NewClientRepository(db *gorm.DB) *ClientRepository {
	return &ClientRepository{
		db: db,
	}
}

func (r *ClientRepository) FindAll() ([]domain.Client, error) {
	var clients []domain.Client
	err := r.db.Find(&clients).Error

	return clients, err
}

func (r *ClientRepository) FindByID(id uint) (*domain.Client, error) {
	var client domain.Client
	err := r.db.First(&client, id).Error

	return &client, err
}

func (r *ClientRepository) FindAllWithRisk() ([]map[string]interface{}, error) {
	var result []map[string]interface{}

	err := r.db.Model(domain.Client{}).
		Select(
			"clients.id",
			"clients.name",
			"clients.email",
			"clients.segment",
			"clients.status",
			"clients.monthly_billing",
			"clients.created_at",
			"COALESCE(ris_snapshots.score, 0) as risk_score",
			"COALESCE(risk_snapshots.level, 'low') as risk_level",
			"MAX(collection_actions.created_at) as last_action_at",
		).
		Joins("LEFT JOIN risk_snapshots ON risk_snapshots.client_id = clients.id").
		Joins("LEFT JOIN collection_actions ON collection_actions.client_id = clients.id").
		Group("clients.id").
		Order("risk_snapshots.score DESC").
		Scan(&result).Error

	return result, err
}

func (r *ClientRepository) Count() (int64, error) {
	var count int64

	err := r.db.Model(&domain.Client{}).Count(&count).Error

	return count, err
}

func (r *ClientRepository) UpdateStatus(id uint, status string) error {
	return r.db.Model(&domain.Client{}).Where("id = ?", id).Update("status", status).Error
}

func (r *ClientRepository) SumMonthlyBilling() (float64, error) {
	var total float64

	err := r.db.Model(&domain.Client{}).Select("COALESCE(SUM(monthly_billing), 0)").Scan(&total).Error

	return total, err
}

func (r *ClientRepository) Create(client *domain.Client) error {
	return r.db.Create(client).Error
}
