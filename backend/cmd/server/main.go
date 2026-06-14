package main

import (
	"log"

	"github.com/candelatorrez/northwind/db/seed"
	"github.com/candelatorrez/northwind/internal/api"
	"github.com/candelatorrez/northwind/internal/config"
	"github.com/candelatorrez/northwind/internal/database"
	"github.com/candelatorrez/northwind/internal/repository"
	"github.com/candelatorrez/northwind/internal/service"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		log.Println(".env not found")
	}

	cfg := config.Load()

	db, err := database.Connect(
		cfg.DBHost,
		cfg.DBPort,
		cfg.DBName,
		cfg.DBUser,
		cfg.DBPassword,
	)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("database connected")

	err = database.Migrate(db)

	if err != nil {
		log.Fatal(err)
	}

	log.Println("database migrated")

	err = seed.Run(db)

	if err != nil {
		log.Fatal(err)
	}

	clientRepository := repository.NewClientRepository(db)
	invoiceRepository := repository.NewInvoiceRepository(db)
	riskRepository := repository.NewRiskRepository(db)

	dashboardService := service.NewDashboardService(clientRepository, invoiceRepository, riskRepository)

	dashboardHandler := api.NewDashboardHandler(dashboardService)

	router := api.NewRouter()

	api.RegisterRoutes(
		router,
		api.Handlers{
			DashboardHandler: dashboardHandler,
		},
	)

	log.Printf("server running on :%s", cfg.AppPort)

	err = router.Run(":" + cfg.AppPort)

	if err != nil {
		log.Fatal(err)
	}
}
