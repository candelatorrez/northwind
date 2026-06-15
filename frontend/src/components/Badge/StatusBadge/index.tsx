import type { ClientStatus } from '../../../types/clients';
import '../index.scss';


interface StatusBadgeProps {
  status: ClientStatus;
  className?: string;
}

const statusConfig = {
  active: {
    label: 'Active',
    bgColor: '#dcfce7',
    textColor: '#166534',
  },

  at_risk: {
    label: 'At Risk',
    bgColor: '#fef3c7',
    textColor: '#92400e',
  },

  delinquent: {
    label: 'Delinquent',
    bgColor: '#fee2e2',
    textColor: '#991b1b',
  },

  suspended: {
    label: 'Suspended',
    bgColor: '#f3f4f6',
    textColor: '#374151',
  },
};

export const StatusBadge = ({
  status,
  className = '',
}: StatusBadgeProps) => {
  const config = statusConfig[status];

  return (
    <span
      className={`badge ${className}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      {config.label}
    </span>
  );
};