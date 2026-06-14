package service

import (
	"time"

	"github.com/candelatorrez/northwind/internal/domain"
	"github.com/candelatorrez/northwind/internal/repository"
)

type InvoiceService struct {
	invoiceRepository *repository.InvoiceRepository
	riskRepository    *repository.RiskRepository
	clientRepository  *repository.ClientRepository
}

func NewInvoiceService(
	invoiceRepository *repository.InvoiceRepository,
	riskRepository *repository.RiskRepository,
) *InvoiceService {
	return &InvoiceService{
		invoiceRepository: invoiceRepository,
		riskRepository:    riskRepository,
	}
}

func NewInvoiceServiceWithClient(
	invoiceRepository *repository.InvoiceRepository,
	riskRepository *repository.RiskRepository,
	clientRepository *repository.ClientRepository,
) *InvoiceService {
	return &InvoiceService{
		invoiceRepository: invoiceRepository,
		riskRepository:    riskRepository,
		clientRepository:  clientRepository,
	}
}

func (s *InvoiceService) GetByClientID(clientID uint) ([]domain.Invoice, error) {
	return s.invoiceRepository.FindByClientID(clientID)
}

func (s *InvoiceService) MarkAsPaid(invoiceID uint) error {
	invoice, err := s.invoiceRepository.FindByID(invoiceID)

	if err != nil {
		return err
	}

	if err := s.invoiceRepository.MarkAsPaid(invoiceID); err != nil {
		return err
	}

	_ = s.CalculateRisk(invoice.ClientID)

	return nil
}

func (s *InvoiceService) CalculateRisk(clientID uint) error {
	invoices, err := s.invoiceRepository.FindByClientID(clientID)

	if err != nil {
		return err
	}

	var clientSegment string

	if s.clientRepository != nil {
		client, err := s.clientRepository.FindByID(clientID)
		if err == nil && client != nil {
			clientSegment = client.Segment
		}
	}

	score, level, reason := s.calculateRiskScore(invoices, clientSegment)

	return s.riskRepository.UpdateByClientID(clientID, score, level, reason)
}

func (s *InvoiceService) calculateRiskScore(invoices []domain.Invoice, segment string) (int, string, string) {
	if len(invoices) == 0 {
		return 0, "low", "No invoices"
	}

	var daysOverdue int
	var overdueCount int
	var reason string

	now := time.Now()

	for _, inv := range invoices {
		if inv.Status == "overdue" {
			overdueCount++
			daysDiff := int(now.Sub(inv.DueDate).Hours() / 24)
			if daysDiff > daysOverdue {
				daysOverdue = daysDiff
			}
		}
	}

	if overdueCount == 0 {
		return 0, "low", "No overdue invoices"
	}

	score := 0
	level := "low"
	reason = ""

	switch segment {
	case "enterprise":
		if daysOverdue > 75 {
			score = 50 + ((daysOverdue - 75) / 2)
			level = "high"
			reason = "Enterprise payment terms exceeded (75+ days overdue)"
		} else if daysOverdue > 45 {
			score = 30
			level = "medium"
			reason = "Enterprise approaching payment deadline"
		} else {
			score = 10
			reason = "Enterprise with minor overdue"
		}
	case "startup":
		if daysOverdue > 45 {
			score = 70 + ((daysOverdue - 45) / 3)
			level = "high"
			reason = "Startup cash constraints - extended overdue"
		} else if daysOverdue > 20 {
			score = 40
			level = "medium"
			reason = "Startup with cash flow issues"
		} else {
			score = 20
			reason = "Zombie account - chronic non-payer"
		}
	default:
		if daysOverdue > 30 {
			score = 60 + ((daysOverdue - 30) / 2)
			level = "high"
			reason = "Standard terms exceeded (30+ days overdue)"
		} else if daysOverdue > 15 {
			score = 35
			level = "medium"
			reason = "Standard payment delayed"
		} else {
			score = 15
			reason = "Standard minor delay"
		}
	}

	if score > 100 {
		score = 100
	}

	return score, level, reason
}
