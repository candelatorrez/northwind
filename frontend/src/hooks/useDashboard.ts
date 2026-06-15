import { useEffect, useState } from "react";
import type { DashboardClient, DashboardMetrics } from "../types/dashboard";
import { dashboardApi } from "../api";

export const useDashboardMetrics = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch metrics');
      } finally {
        setLoading(false);
      }
    };
 
    fetchMetrics();
  }, []);
 
  return { metrics, loading, error };
};

export const useDashboardClients = () => {
  const [clients, setClients] = useState<DashboardClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const data = await dashboardApi.getClients();
        setClients(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch clients');
      } finally {
        setLoading(false);
      }
    };
 
    fetchClients();
  }, []);
 
  return { clients, loading, error };
};