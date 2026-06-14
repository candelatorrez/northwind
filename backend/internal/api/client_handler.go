package api

import (
	"net/http"
	"strconv"

	"github.com/candelatorrez/northwind/internal/service"
	"github.com/gin-gonic/gin"
)

type ClientHandler struct {
	clientService *service.ClientService
}

func NewClientHandler(clientService *service.ClientService) *ClientHandler {
	return &ClientHandler{
		clientService: clientService,
	}
}

func (h *ClientHandler) GetAll(c *gin.Context) {
	clients, err := h.clientService.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, clients)
}

func (h *ClientHandler) GetByID(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	client, err := h.clientService.GetByID(uint(id))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Client not found"})
		return
	}

	c.JSON(http.StatusOK, client)
}

func (h *ClientHandler) UpdateStatus(c *gin.Context) {
	id, err := strconv.ParseUint(c.Param("id"), 10, 32)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid client ID"})
		return
	}

	var req struct {
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	if err := h.clientService.UpdateStatus(uint(id), req.Status); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	client, _ := h.clientService.GetByID(uint(id))
	c.JSON(http.StatusOK, client)
}
