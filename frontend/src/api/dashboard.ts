import axios from "axios";
import type { DashboardMetrics } from "../types/dashboard";


const api = axios.create({
    baseURL: "http://localhost:8080"
});

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
    const response = await api.get<DashboardMetrics>("/dashboard/metrics");

    return response.data;
}