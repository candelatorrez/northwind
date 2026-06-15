import { useCallback, useEffect, useState } from "react";
import { invoiceApi } from "../api";
import type { Invoice } from "../types/invoice";

export const useClientInvoices = (clientId: string) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  const fetchInvoices = useCallback(async () => {
    if (!clientId) return;
    try {
      setLoading(true);
      const data = await invoiceApi.getByClientId(clientId);
      setInvoices(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  }, [clientId]);
 
  useEffect(() => {
    fetchInvoices();
  }, [clientId, fetchInvoices]);
 

  const markAsPaid = useCallback(
  async (invoiceId: string) => {
    try {
      await invoiceApi.markAsPaid(invoiceId);

      setInvoices(prev =>
        prev.map(inv =>
          inv.id === invoiceId
            ? {
                ...inv,
                status: 'paid',
                paidAt: new Date().toISOString(),
              }
            : inv
        )
      );

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to mark as paid'
      );

      throw err;
    }
  },
  []
);
 
  return { invoices, loading, error, markAsPaid, refetch: fetchInvoices };
};