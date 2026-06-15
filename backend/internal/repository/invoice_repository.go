package repository

import (
	"time"

	"github.com/candelatorrez/northwind/internal/domain"
	"gorm.io/gorm"
)

type InvoiceRepository struct {
	db *gorm.DB
}

func NewInvoiceRepository(db *gorm.DB) *InvoiceRepository {
	return &InvoiceRepository{
		db: db,
	}
}

func (r *InvoiceRepository) FindByClientID(clientID uint) ([]domain.Invoice, error) {
	var invoices []domain.Invoice

	err := r.db.Where("client_id = ?", clientID).Order("due_date DESC").Find(&invoices).Error

	return invoices, err
}

func (r *InvoiceRepository) FindByID(id uint) (*domain.Invoice, error) {
	var invoice domain.Invoice

	err := r.db.First(&invoice, id).Error

	return &invoice, err
}

func (r *InvoiceRepository) MarkAsPaid(id uint) error {
	now := time.Now()

	return r.db.Model(&domain.Invoice{}).Where("id = ?", id).Updates(map[string]interface{}{
		"status":  "paid",
		"paid_at": now,
	}).Error
}

func (r *InvoiceRepository) CountOverdue() (int64, error) {
	var count int64

	err := r.db.Model(&domain.Invoice{}).Where("status = ?", "overdue").Count(&count).Error

	return count, err
}

func (r *InvoiceRepository) SumOutstanding() (float64, error) {
	var total float64
	err := r.db.Model(&domain.Invoice{}).Where("status IN ?", []string{"overdue", "pending"}).
		Select("COALESCE(SUM(amount), 0)").Scan(&total).Error

	return total, err
}

func (r *InvoiceRepository) GetDeliquencyRate() (float64, error) {
	var total float64

	r.db.Model(&domain.Invoice{}).Select("COALESCE(SUM(amount), 0)").Scan(&total)

	if total == 0 {
		return 0, nil
	}

	var overdue float64

	r.db.Model(&domain.Invoice{}).Where("status = ?", "overdue").Select("COALESCE(SUM(amount), 0)").Scan(&overdue)

	return (overdue / total) * 100, nil
}

func (r *InvoiceRepository) Create(invoice *domain.Invoice) error {
	return r.db.Create(invoice).Error
}
