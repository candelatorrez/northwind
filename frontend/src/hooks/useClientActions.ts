import { useCallback, useEffect, useState } from "react";
import type { ActionType, CollectionAction } from "../types/action";
import { actionApi } from "../api";

export const useClientActions = (clientId: string) => {
  const [actions, setActions] = useState<CollectionAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchActions = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const data = await actionApi.getByClientId(clientId);
      setActions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch actions');
    } finally {
      setLoading(false);
    }
  }, [clientId]);
 
  useEffect(() => {
    fetchActions();
  }, [clientId, fetchActions]);
 
  const addAction = useCallback(
    async (type: ActionType, notes: string, performedBy: string) => {
      try {
        const newAction = await actionApi.create(clientId, {
          type,
          notes,
          performedBy,
        });
        setActions((prev) => [newAction, ...prev]);
        return newAction;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to add action');
        throw err;
      }
    },
    [clientId]
  );
 
  return { actions, loading, error, addAction, refetch: fetchActions };
};
 