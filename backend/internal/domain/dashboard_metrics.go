package domain

type DashboardMetrics struct {
	TotalClients      int     `json:"totalClients"`
	HighRiskClients   int     `json:"highRiskClients"`
	OverdueInvoices   int     `json:"overdueInvoices"`
	OutstandingAmount float64 `json:"outstandingAmount"`
}
