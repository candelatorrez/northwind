import React, { useState, useMemo } from 'react';
import './styles.scss';

import { FilterBar } from '../components/FilterBar';
import { Table } from '../components/Table';
import { LoadingState, ErrorState, EmptyState } from '../components/States';
import { ClientDetail } from '../components/ClientDetail';
import { useDashboardClients, useDashboardMetrics } from '../hooks/useDashboard';
import type { ClientFilters } from '../types/clients';
import { Card, KPICard } from '../components/Cards';
import { RiskBadge, SegmentBadge, StatusBadge } from '../components/Badge';

const Dashboard: React.FC = () => {
  const { metrics, loading: metricsLoading } = useDashboardMetrics();
  const { clients, loading: clientsLoading, error: clientsError } = useDashboardClients();

  const [filters, setFilters] = useState<ClientFilters>({});
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (filters.search) {
        const search = filters.search.toLowerCase();
        if (
          !client.name.toLowerCase().includes(search) &&
          !client.email.toLowerCase().includes(search)
        ) {
          return false;
        }
      }
      if (filters.segment && client.segment !== filters.segment) return false;
      if (filters.status && client.status !== filters.status) return false;
      if (filters.riskLevel && client.riskLevel !== filters.riskLevel) return false;

      return true;
    });
  }, [clients, filters]);

  if (selectedClientId) {
    return (
      <ClientDetail
        clientId={selectedClientId}
        onBack={() => setSelectedClientId(null)}
      />
    );
  }

  return (
    <div className="dashboard">
      {/* KPI */}
      {metricsLoading ? (
        <LoadingState />
      ) : metrics ? (
        <div className="dashboard__kpis">
          <KPICard
            label="Monthly Wallet"
            value={`$${(metrics.outstandingAmount / 1000).toFixed(0)}K`}
            unit="USD"
          />
          <KPICard
            label="Current Delinquency"
            value={`${Math.round((metrics.overdueInvoices / 420) * 100)}%`}
            highlight
          />
          <KPICard label="High Risk Clients" value={metrics.highRiskClients} />
          <KPICard label="Overdue Invoices" value={metrics.overdueInvoices} />
        </div>
      ) : null}

      <FilterBar onFiltersChange={setFilters} />

      <Card title={`Clients (${filteredClients.length})`}>
        <div className='dashboard__tableScroll'>
        {clientsLoading ? (
          <LoadingState />
        ) : clientsError ? (
          <ErrorState message={clientsError} />
        ) : filteredClients.length === 0 ? (
          <EmptyState message="No clients match your filters" />
        ) : (
          <Table
            columns={[
              {
                key: 'name',
                label: 'Client',
                render: (value, item) => (
                  <div>
                    <p className="font-medium text-gray-900">{value}</p>
                    <p className="text-sm text-gray-500">{item.email}</p>
                  </div>
                ),
              },
              {
                key: 'segment',
                label: 'Segment',
                render: (value) => <SegmentBadge segment={value} />,
              },
              {
                key: 'status',
                label: 'Status',
                render: (value) => <StatusBadge status={value} />,
              },
              {
                key: 'monthlyBilling',
                label: 'Monthly Billing',
                render: (value) =>
                  `$${value.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
              {
                key: 'riskScore',
                label: 'Risk',
                render: (_, item) => (
                  <RiskBadge level={item.riskLevel} score={item.riskScore} />
                ),
              },
              {
                key: 'lastActionAt',
                label: 'Last Action',
                render: (value) =>
                  value ? new Date(value).toLocaleDateString() : 'Never',
              },
            ]}
            data={filteredClients}
            onRowClick={(item) => setSelectedClientId(item.id)}
          />
        )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;