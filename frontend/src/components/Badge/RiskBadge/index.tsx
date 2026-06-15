import type { RiskLevel } from '../../../types/clients';
import '../index.scss';


interface RiskBadgeProps {
  level: RiskLevel;
  score?: number;
  className?: string;
}

const riskConfig = {
  low: {
    label: 'Low',
    bgColor: '#dcfce7',
    textColor: '#166534',
  },

  medium: {
    label: 'Medium',
    bgColor: '#fef3c7',
    textColor: '#92400e',
  },

  high: {
    label: 'High',
    bgColor: '#fee2e2',
    textColor: '#991b1b',
  },
};

export const RiskBadge = ({
  level,
  score,
  className = '',
}: RiskBadgeProps) => {
  const config = riskConfig[level];

  return (
    <span
      className={`badge ${className}`}
      title={`Risk Level: ${config.label}`}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor,
      }}
    >
      {score ?? config.label}
    </span>
  );
};