import '../index.scss';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
}

export const EmptyState = ({
  title = 'No data',
  message = 'There is nothing to display here.',
  icon = '📭',
}: EmptyStateProps) => (
  <div className="states states--column states--spacing">

    <div className="states__icon">
      {icon}
    </div>

    <h3 className="states__title states__title--default">
      {title}
    </h3>

    <p className="states__message states__message--default">
      {message}
    </p>

  </div>
);