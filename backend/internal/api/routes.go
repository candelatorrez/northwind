package api

import "github.com/gin-gonic/gin"

type Handlers struct {
	DashboardHandler *DashboardHandler
}

func RegisterRoutes(router *gin.Engine, handlers Handlers) {
	router.GET("/health",
		func(c *gin.Context) {
			c.JSON(200, gin.H{"status": "ok"})
		},
	)

	router.GET("/dashboard/metrics", handlers.DashboardHandler.GetMetrics)
}
