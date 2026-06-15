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

func (r *ClientRepository) FindAllWithRisk() ([]domain.ClientDashboardDTO, error) {
	var clients []domain.ClientDashboardDTO

	query := `
		WITH latest_risk AS (
			SELECT DISTINCT ON (client_id)
				client_id,
				score,
				level
			FROM risk_snapshots
			ORDER BY client_id, created_at DESC
		),
		latest_action AS (
			SELECT
				client_id,
				MAX(created_at) as last_action_at
			FROM collection_actions
			GROUP BY client_id
		)
		SELECT
			c.id,
			c.name,
			c.email,
			c.segment,
			c.status,
			c.monthly_billing as monthly_billing,
			c.created_at as created_at,
			COALESCE(lr.score, 0) as risk_score,
			COALESCE(NULLIF(lr.level, ''), 'low') as risk_level,
			la.last_action_at
		FROM clients c
		LEFT JOIN latest_risk lr
			ON lr.client_id = c.id
		LEFT JOIN latest_action la
			ON la.client_id = c.id
		ORDER BY COALESCE(lr.score, 0) DESC
	`

	err := r.db.Raw(query).Scan(&clients).Error

	return clients, err
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
