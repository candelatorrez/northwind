import React, { useState } from 'react';
import { useClient } from '../../hooks/useClient';
import { useClientInvoices } from '../../hooks/useClientInvoices';
import { useClientRisk } from '../../hooks/useClientRisk';
import { useClientActions } from '../../hooks/useClientActions';
import type { ActionType } from '../../types/action';
import { EmptyState, ErrorState, LoadingState } from '../States';
import type { ClientStatus } from '../../types/clients';
import { Card, HeaderCard } from '../Cards';
import { InvoiceStatusBadge, RiskBadge, SegmentBadge, StatusBadge } from '../Badge';
import styles from './ClientDetail.module.scss';

interface ClientDetailProps {
  clientId: string;
  onBack?: () => void;
}

export const ClientDetail: React.FC<ClientDetailProps> = ({ clientId, onBack }) => {
  const { client, loading: clientLoading, error: clientError, updateStatus } = useClient(clientId);
  const { invoices, loading: invoicesLoading, markAsPaid } = useClientInvoices(clientId);
  const { risk, loading: riskLoading } = useClientRisk(clientId);
  const { actions, loading: actionsLoading, addAction } = useClientActions(clientId);

  const [newActionType, setNewActionType] = useState<ActionType>('note');
  const [newActionNotes, setNewActionNotes] = useState('');
  const [newActionPerformedBy, setNewActionPerformedBy] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (clientLoading) return <LoadingState />;
  if (clientError || !client) return <ErrorState message={clientError || 'Client not found'} />;

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    try {
      await updateStatus(e.target.value as ClientStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionNotes.trim() || !newActionPerformedBy.trim()) return;

    try {
      setSubmitting(true);
      await addAction(newActionType, newActionNotes, newActionPerformedBy);
      setNewActionNotes('');
      setNewActionPerformedBy('');
    } catch (err) {
      console.error('Failed to add action:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkAsPaid = async (invoiceId: string) => {
    try {
      await markAsPaid(invoiceId);
    } catch (err) {
      console.error('Failed to mark as paid:', err);
    }
  };

  return (
    <div className={styles.clientDetail}>
      {onBack && (
        <button onClick={onBack} className={styles.backButton}>
          ← Back to clients
        </button>
      )}

      <HeaderCard
        title={client.name}
        subtitle={client.email}
        badges={[
          <SegmentBadge key="segment" segment={client.segment} />,
          <StatusBadge key="status" status={client.status} />,
        ]}
        actions={[
          <div key="status-select" className={styles.statusSelectWrapper}>
            <label>Status:</label>
            <select
              value={client.status}
              onChange={handleStatusChange}
              className={styles.statusSelect}
            >
              <option value="active">Active</option>
              <option value="at_risk">At Risk</option>
              <option value="delinquent">Delinquent</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>,
        ]}
      />

      <div className={styles.infoGrid}>
        <Card>
          <div>
            <h3 className={styles.billingLabel}>Monthly Billing</h3>
            <p className={styles.billingAmount}>
              ${client.monthlyBilling.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </Card>

        {riskLoading ? (
          <LoadingState />
        ) : risk ? (
          <Card>
            <div className={styles.riskCard}>
              <div className={styles.riskHeader}>
                <h3 className={styles.riskLabel}>Risk Assessment</h3>
                <RiskBadge level={risk.level} score={risk.score} />
              </div>
              <div>
                <p className={styles.riskReason}>{risk.reason}</p>
              </div>
            </div>
          </Card>
        ) : null}
      </div>

      <Card title="Invoices">
        {invoicesLoading ? (
          <LoadingState />
        ) : invoices.length === 0 ? (
          <EmptyState message="No invoices found" />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td className={styles.cellId}>{invoice.id}</td>
                    <td className={styles.cellAmount}>
                      ${invoice.amount.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className={styles.cellDate}>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </td>
                    <td>
                      <InvoiceStatusBadge status={invoice.status} />
                    </td>
                    <td>
                      {(invoice.status === 'overdue' || invoice.status === 'pending') && (
                        <button
                          onClick={() => handleMarkAsPaid(invoice.id)}
                          className={styles.markPaidButton}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Collection Actions">
        <form onSubmit={handleAddAction} className={styles.actionForm}>
          <h4 className={styles.actionFormTitle}>Add New Action</h4>
          <div className={styles.actionFormFields}>
            <div>
              <label className={styles.fieldLabel}>Type</label>
              <select
                value={newActionType}
                onChange={(e) => setNewActionType(e.target.value as ActionType)}
                className={styles.fieldInput}
              >
                <option value="call">Call</option>
                <option value="email">Email</option>
                <option value="note">Note</option>
              </select>
            </div>
            <div>
              <label className={styles.fieldLabel}>Notes</label>
              <textarea
                value={newActionNotes}
                onChange={(e) => setNewActionNotes(e.target.value)}
                placeholder="Enter notes..."
                rows={3}
                className={styles.fieldInput}
              />
            </div>
            <div>
              <label className={styles.fieldLabel}>Performed By</label>
              <input
                type="text"
                value={newActionPerformedBy}
                onChange={(e) => setNewActionPerformedBy(e.target.value)}
                placeholder="Your name"
                className={styles.fieldInput}
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !newActionNotes.trim() || !newActionPerformedBy.trim()}
              className={styles.submitButton}
            >
              {submitting ? 'Adding...' : 'Add Action'}
            </button>
          </div>
        </form>

        {actionsLoading ? (
          <LoadingState />
        ) : actions.length === 0 ? (
          <EmptyState message="No collection actions yet" />
        ) : (
          <div className={styles.actionsList}>
            {actions.map((action) => (
              <div key={action.id} className={styles.actionItem}>
                <div className={styles.actionItemRow}>
                  <div className={styles.actionItemContent}>
                    <div className={styles.actionItemHeader}>
                      <span className={styles.actionType}>{action.type.toUpperCase()}</span>
                      <span className={styles.actionPerformedBy}>by {action.performedBy}</span>
                    </div>
                    <p className={styles.actionNotes}>{action.notes}</p>
                  </div>
                  <span className={styles.actionDate}>
                    {new Date(action.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};