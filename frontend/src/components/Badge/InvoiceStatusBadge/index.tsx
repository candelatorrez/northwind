import '../index.scss';
import type { InvoiceStatus } from '../../../types/invoice';


interface InvoiceStatusBadgeProps {
  status: InvoiceStatus;
  className?: string;
}

const invoiceStatusConfig = {
  pending: {
    label: 'Pending',
    bgColor: '#fef3c7',
    textColor: '#92400e',
  },

  paid: {
    label: 'Paid',
    bgColor: '#dcfce7',
    textColor: '#166534',
  },

  overdue: {
    label: 'Overdue',
    bgColor: '#fee2e2',
    textColor: '#991b1b',
  },
};

export const InvoiceStatusBadge = ({
  status,
  className = '',
}: InvoiceStatusBadgeProps) => {
  const config = invoiceStatusConfig[status];

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