import '../index.scss';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  error?: unknown;
}

export const ErrorState = ({
  title = 'Error',
  message = 'Something went wrong. Please try again.',
  onRetry,
  error,
}: ErrorStateProps) => {
  const displayMessage =
    message ||
    (error instanceof Error
      ? error.message
      : 'Something went wrong');

  return (
    <div className="states states--column states--error">

      <div className="states__icon">
        ⚠️
      </div>

      <h3 className="states__title states__title--error">
        {title}
      </h3>

      <p className="states__message states__message--error">
        {displayMessage}
      </p>

      {onRetry && (
        <button
          className="states__button"
          onClick={onRetry}
        >
          Retry
        </button>
      )}
    </div>
  );
};