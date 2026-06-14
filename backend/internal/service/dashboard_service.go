package service

import (
	"github.com/candelatorrez/northwind/internal/domain"
	"github.com/candelatorrez/northwind/internal/repository"
)

type DashboardService struct {
	clientRepository  *repository.ClientRepository
	invoiceRepository *repository.InvoiceRepository
	riskRepository    *repository.RiskRepository
}

func NewDashboardService(
	clientRepository *repository.ClientRepository,
	invoiceRepository *repository.InvoiceRepository,
	riskRepository *repository.RiskRepository,
) *DashboardService {

	return &DashboardService{
		clientRepository:  clientRepository,
		invoiceRepository: invoiceRepository,
		riskRepository:    riskRepository,
	}
}

func (s *DashboardService) GetMetrics() (*domain.DashboardMetrics, error) {
	totalClients, _ := s.clientRepository.Count()

	outstandingAmount, _ := s.invoiceRepository.SumOutstanding()

	highRisk, _ := s.riskRepository.CountHighRisk()

	overdue, _ := s.invoiceRepository.CountOverdue()

	return &domain.DashboardMetrics{
		TotalClients:      int(totalClients),
		HighRiskClients:   int(highRisk),
		OverdueInvoices:   int(overdue),
		OutstandingAmount: outstandingAmount,
	}, nil
}

func (s *DashboardService) GetClientsWithRisk() ([]map[string]interface{}, error) {
	return s.clientRepository.FindAllWithRisk()
}
