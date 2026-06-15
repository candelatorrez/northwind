import { useCallback, useEffect, useState } from "react";
import { riskApi } from "../api";
import type { RiskSnapshot } from "../types/riskSnapshot";

export const useClientRisk = (clientId: string) => {
  const [risk, setRisk] = useState<RiskSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchRisk = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const data = await riskApi.getByClientId(clientId);
      setRisk(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch risk');
    } finally {
      setLoading(false);
    }
  }, [clientId]);
 
  useEffect(() => {
    fetchRisk();
  }, [clientId, fetchRisk]);
 
  return { risk, loading, error, refetch: fetchRisk };
};
 