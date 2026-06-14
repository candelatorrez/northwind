import { useEffect, useState } from "react";
import type { DashboardMetrics } from "../types/dashboard";
import { getDashboardMetrics } from "../api/dashboard";

export function useDashboard() {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        load()
    }, []);


    async function load() {
        try {
            const data = await getDashboardMetrics();

            setMetrics(data)
        } catch {
            setError("Failed loading dashboard")
        } finally {
            setLoading(false)
        }
    }

    return {
        metrics,
        loading,
        error,
    }
}