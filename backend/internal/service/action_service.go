package service

import (
	"github.com/candelatorrez/northwind/internal/domain"
	"github.com/candelatorrez/northwind/internal/repository"
)

type ActionService struct {
	actionRepository *repository.ActionRepository
}

func NewActionService(actionRepository *repository.ActionRepository) *ActionService {
	return &ActionService{
		actionRepository: actionRepository,
	}
}

func (s *ActionService) GetByClientID(clientID uint) ([]domain.CollectionAction, error) {
	return s.actionRepository.FindByClientID(clientID)
}

func (s *ActionService) Create(action *domain.CollectionAction) error {
	return s.actionRepository.Create(action)
}

func (s *ActionService) GetByID(id uint) (*domain.CollectionAction, error) {
	return s.actionRepository.FindByID(id)
}

func (s *ActionService) DeleteByID(id uint) error {
	return s.actionRepository.DeletedByID(id)
}
