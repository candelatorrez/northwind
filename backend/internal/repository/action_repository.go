package repository

import (
	"github.com/candelatorrez/northwind/internal/domain"
	"gorm.io/gorm"
)

type ActionRepository struct {
	db *gorm.DB
}

func NewActionRepository(db *gorm.DB) *ActionRepository {
	return &ActionRepository{
		db: db,
	}
}

func (r *ActionRepository) FindByClientID(clientID uint) ([]domain.CollectionAction, error) {
	var actions []domain.CollectionAction

	err := r.db.Where("client_id = ?", clientID).Order("created_at DESC").Find(&actions).Error

	return actions, err
}

func (r *ActionRepository) Create(action *domain.CollectionAction) error {
	return r.db.Create(action).Error
}

func (r *ActionRepository) FindByID(id uint) (*domain.CollectionAction, error) {
	var action domain.CollectionAction

	err := r.db.First(&action, id).Error

	return &action, err
}

func (r *ActionRepository) DeletedByID(id uint) error {
	return r.db.Delete(&domain.CollectionAction{}, id).Error
}
