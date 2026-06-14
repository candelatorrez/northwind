package api

import (
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func NewRouter() *gin.Engine {

	router := gin.Default()

	router.Use(

		cors.New(cors.Config{AllowOrigins: []string{"http://localhost:5173"},
			AllowMethods: []string{
				"GET",
				"POST",
				"PUT",
				"PATCH",
				"DELETE",
				"OPTIONS",
			},
			AllowHeaders: []string{
				"Origin",
				"Content-Type",
				"Accept",
				"Authorization",
			},
			ExposeHeaders: []string{
				"Content-Length",
			},
			AllowCredentials: true,
			MaxAge:           12 * time.Hour,
		},
		),
	)

	return router
}
