import { useCallback, useEffect, useState } from "react";
import type { Client, ClientStatus } from "../types/clients";
import { clientApi } from "../api";

export const useClient = (clientId: string) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchClient = useCallback(async () => {
    try {
      setLoading(true);
      const data = await clientApi.getById(clientId);
      setClient(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch client');
    } finally {
      setLoading(false);
    }
  }, [clientId]);
 
  useEffect(() => {
    if (clientId) {
      fetchClient();
    }
  }, [clientId, fetchClient]);
 
  const updateStatus = useCallback(
    async (status: ClientStatus) => {
      try {
        const updated = await clientApi.updateStatus(clientId, status);
        setClient(updated);
        return updated;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update status');
        throw err;
      }
    },
    [clientId]
  );
 
  return { client, loading, error, updateStatus, refetch: fetchClient };
};