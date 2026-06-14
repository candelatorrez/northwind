package api

import (
	"net/http"

	"github.com/candelatorrez/northwind/internal/service"
	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	service *service.DashboardService
}

func NewDashboardHandler(service *service.DashboardService) *DashboardHandler {
	return &DashboardHandler{
		service: service,
	}
}

func (h *DashboardHandler) GetMetrics(c *gin.Context) {
	metrics, err := h.service.GetMetrics()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

		return
	}

	c.JSON(http.StatusOK, metrics)
}
