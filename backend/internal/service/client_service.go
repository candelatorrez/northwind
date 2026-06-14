package service

import (
	"github.com/candelatorrez/northwind/internal/domain"
	"github.com/candelatorrez/northwind/internal/repository"
)

type ClientService struct {
	clientRepository *repository.ClientRepository
	riskRepository   *repository.RiskRepository
}

func NewClientService(
	clientRepository *repository.ClientRepository,
	riskRepository *repository.RiskRepository,
) *ClientService {
	return &ClientService{
		clientRepository: clientRepository,
		riskRepository:   riskRepository,
	}
}

func (s *ClientService) GetAll() ([]domain.Client, error) {
	return s.clientRepository.FindAll()
}

func (s *ClientService) GetByID(id uint) (*domain.Client, error) {
	return s.clientRepository.FindByID(id)
}

func (s *ClientService) UpdateStatus(id uint, status string) error {
	return s.clientRepository.UpdateStatus(id, status)
}
