import '../index.scss';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner = ({
  size = 'md',
}: LoadingSpinnerProps) => {
  return (
    <div className="states">
      <div className={`spinner spinner--${size}`} />
    </div>
  );
};