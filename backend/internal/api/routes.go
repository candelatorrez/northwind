package api

import "github.com/gin-gonic/gin"

type Handlers struct {
	DashboardHandler *DashboardHandler
	ClientHandler    *ClientHandler
	InvoiceHandler   *InvoiceHandler
	RiskHandler      *RiskHandler
	ActionHandler    *ActionHandler
}

func RegisterRoutes(router *gin.Engine, handlers Handlers) {
	// Health check
	router.GET("/health",
		func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		},
	)

	// Dashboard routes
	router.GET("/dashboard/metrics", handlers.DashboardHandler.GetMetrics)
	router.GET("/dashboard/clients", handlers.DashboardHandler.GetClients)

	// Client routes
	router.GET("/clients", handlers.ClientHandler.GetAll)
	router.GET("/clients/:id", handlers.ClientHandler.GetByID)
	router.PATCH("/clients/:id/status", handlers.ClientHandler.UpdateStatus)

	// Invoice routes
	router.GET("/clients/:id/invoices", handlers.InvoiceHandler.GetByClientID)
	router.POST("/invoices/:id/pay", handlers.InvoiceHandler.MarkAsPaid)
	router.POST("/clients/:id/risk-snapshots", handlers.InvoiceHandler.CalculateRisk)

	// Risk routes
	router.GET("/clients/:id/risk", handlers.RiskHandler.GetByClientID)

	// Collection action routes
	router.GET("/clients/:id/actions", handlers.ActionHandler.GetByClientID)
	router.POST("/clients/:id/actions", handlers.ActionHandler.Create)
}
