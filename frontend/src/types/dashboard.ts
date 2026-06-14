import type { Client, RiskLevel } from "./clients";

export interface DashboardMetrics {
    totalClients: number;
    highRiskClients: number;
    overdueInvoices: number;
    outstandingAmount: number;
}

export interface DashboardClient extends Client {
    riskScore: number;
    riskLevel: RiskLevel;
    lastAction?: string;
    lastActionAt?: string;
}