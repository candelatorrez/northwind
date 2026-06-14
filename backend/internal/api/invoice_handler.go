package api

import (
	"net/http"
	"strconv"

	"github.com/candelatorrez/northwind/internal/domain"
	"github.com/candelatorrez/northwind/internal/service"
	"github.com/gin-gonic/gin"
)

type InvoiceHandler struct {
	invoiceService *service.InvoiceService
}

func NewInvoiceHandler(invoiceService *service.InvoiceService) *InvoiceHandler {
	return &InvoiceHandler{
		invoiceService: invoiceService,
	}
}

func (h *InvoiceHandler) GetByClientID(c *gin.Context) {
	clientID, err := strconv.ParseUint(c.Param("clientId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	invoices, err := h.invoiceService.GetByClientID(uint(clientID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if invoices == nil {
		invoices = []domain.Invoice{}
	}

	c.JSON(http.StatusOK, invoices)
}

func (h *InvoiceHandler) MarkAsPaid(c *gin.Context) {
	invoiceID, err := strconv.ParseUint(c.Param("invoiceId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid invoice ID"})
		return
	}

	if err := h.invoiceService.MarkAsPaid(uint(invoiceID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Invoice marked as paid"})
}

func (h *InvoiceHandler) CalculateRisk(c *gin.Context) {
	clientID, err := strconv.ParseUint(c.Param("clientId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	if err := h.invoiceService.CalculateRisk(uint(clientID)); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Risk calculated"})
}
