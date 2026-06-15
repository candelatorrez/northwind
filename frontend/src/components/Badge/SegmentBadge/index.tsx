import type { ClientSegment } from '../../../types/clients';
import '../index.scss';


interface SegmentBadgeProps {
  segment: ClientSegment;
  className?: string;
}

const segmentConfig: Record<
  ClientSegment,
  {
    label: string;
    bgColor: string;
    textColor: string;
  }
> = {
  enterprise: {
    label: 'Enterprise',
    bgColor: '#EEEDFE',
    textColor: '#26215C',
  },

  startup: {
    label: 'Startup',
    bgColor: '#E1F5EE',
    textColor: '#04342C',
  },

  standard: {
    label: 'Standard',
    bgColor: '#f3f4f6',
    textColor: '#374151',
  },

  zombie: {
    label: 'Zombie',
    bgColor: '#fed7aa',
    textColor: '#92400e',
  },
};

export const SegmentBadge = ({
  segment,
  className = '',
}: SegmentBadgeProps) => {
  const config = segmentConfig[segment];

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