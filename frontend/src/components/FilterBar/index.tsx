import React, { useState } from 'react';
import type {
  ClientFilters,
  ClientSegment,
  ClientStatus,
  RiskLevel,
} from '../../types/clients';

import './index.scss';

interface FilterBarProps {
  onFiltersChange: (filters: ClientFilters) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onFiltersChange,
}) => {
  const [search, setSearch] = useState('');
  const [segment, setSegment] =
    useState<ClientSegment | 'all'>('all');

  const [status, setStatus] =
    useState<ClientStatus | 'all'>('all');

  const [riskLevel, setRiskLevel] =
    useState<RiskLevel | 'all'>('all');

  const handleFilterChange = () => {
    onFiltersChange({
      search: search || undefined,
      segment: segment === 'all' ? undefined : segment,
      status: status === 'all' ? undefined : status,
      riskLevel: riskLevel === 'all'
        ? undefined
        : riskLevel,
    });
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [search, segment, status, riskLevel]);

  return (
    <div className="filter-bar">
      <div className="filter-bar__grid">

        <div className="filter-bar__field">
          <label className="filter-bar__label">
            Search
          </label>

          <input
            type="text"
            placeholder="Client name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="filter-bar__input"
          />
        </div>

        <div className="filter-bar__field">
          <label className="filter-bar__label">
            Segment
          </label>

          <select
            value={segment}
            onChange={(e) =>
              setSegment(
                e.target.value as ClientSegment | 'all'
              )
            }
            className="filter-bar__select"
          >
            <option value="all">All Segments</option>
            <option value="enterprise">Enterprise</option>
            <option value="startup">Startup</option>
            <option value="standard">Standard</option>
            <option value="zombie">Zombie</option>
          </select>
        </div>

        <div className="filter-bar__field">
          <label className="filter-bar__label">
            Status
          </label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(
                e.target.value as ClientStatus | 'all'
              )
            }
            className="filter-bar__select"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="at_risk">At Risk</option>
            <option value="delinquent">Delinquent</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>

        <div className="filter-bar__field">
          <label className="filter-bar__label">
            Risk Level
          </label>

          <select
            value={riskLevel}
            onChange={(e) =>
              setRiskLevel(
                e.target.value as RiskLevel | 'all'
              )
            }
            className="filter-bar__select"
          >
            <option value="all">All Risk Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="filter-bar__actions">
          <button
            className="filter-bar__button"
            onClick={() => {
              setSearch('');
              setSegment('all');
              setStatus('all');
              setRiskLevel('all');
            }}
          >
            Clear Filters
          </button>
        </div>

      </div>
    </div>
  );
};