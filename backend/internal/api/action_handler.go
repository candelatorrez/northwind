package api

import (
	"net/http"
	"strconv"
	"time"

	"github.com/candelatorrez/northwind/internal/domain"
	"github.com/candelatorrez/northwind/internal/service"
	"github.com/gin-gonic/gin"
)

type ActionHandler struct {
	actionService *service.ActionService
}

func NewActionHandler(actionService *service.ActionService) *ActionHandler {
	return &ActionHandler{
		actionService: actionService,
	}
}

func (h *ActionHandler) GetByClientID(c *gin.Context) {
	clientID, err := strconv.ParseUint(c.Param("clientId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	actions, err := h.actionService.GetByClientID(uint(clientID))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if actions == nil {
		actions = []domain.CollectionAction{}
	}

	c.JSON(http.StatusOK, actions)
}

func (h *ActionHandler) Create(c *gin.Context) {
	clientID, err := strconv.ParseUint(c.Param("clientId"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	var req struct {
		Type        string `json:"type" binding:"required"`
		Notes       string `json:"notes" binding:"required"`
		PerformedBy string `json:"performedBy" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	action := &domain.CollectionAction{
		ClientID:    uint(clientID),
		Type:        req.Type,
		Notes:       req.Notes,
		PerformedBy: req.PerformedBy,
		CreatedAt:   time.Now(),
	}

	if err := h.actionService.Create(action); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, action)
}
