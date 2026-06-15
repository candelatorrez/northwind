package api

import (
	"net/http"
	"strconv"

	"github.com/candelatorrez/northwind/internal/repository"
	"github.com/gin-gonic/gin"
)

type RiskHandler struct {
	riskRepository *repository.RiskRepository
}

func NewRiskHandler(riskRepository *repository.RiskRepository) *RiskHandler {
	return &RiskHandler{
		riskRepository: riskRepository,
	}
}

func (h *RiskHandler) GetByClientID(c *gin.Context) {
	clientID, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	risk, err := h.riskRepository.FindByClientID(uint(clientID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, risk)
}
