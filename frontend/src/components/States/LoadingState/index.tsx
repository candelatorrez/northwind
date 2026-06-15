import { LoadingSpinner } from '../LoadingSpinner';
import '../index.scss';


interface LoadingStateProps {
  message?: string;
}

export const LoadingState = ({
  message = 'Loading...',
}: LoadingStateProps) => (
  <div className="states states--column states--spacing">
    <LoadingSpinner size="lg" />

    <p className="states__message states__message--default">
      {message}
    </p>
  </div>
);