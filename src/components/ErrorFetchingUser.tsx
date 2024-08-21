import { useDebounceRetry } from '@/utils/debounceRetry';
import React from 'react';

interface HeadAsideProps {
  retryCalls: Retry;
}
interface Retry {
  retry: () => void;
  retrySpecificty?: () => void;
}

const ErrorFetchingUser: React.FC<HeadAsideProps> = ({ retryCalls }) => {
  const { retry, retrySpecificty } = retryCalls;

  const { retryAll } = useDebounceRetry(retry, retrySpecificty);

  return (
    <div className="justify-center max-height">
      <div className="row-gap row-gap_20">
        <div className="row-gap row-gap_20">
          <h2>Connection Error</h2>
          <p className="error">
            Oops! We’re having trouble connecting right now.
          </p>
          <div className="row-gap row-gap_20">
            <h4 className="black-medium">What you can do:</h4>
            <ul className="row-gap row-gap_10">
              <li>
                <strong>Check Your Internet:</strong> Ensure you’re connected to
                the internet.
              </li>
              <li>
                <strong>Try Again:</strong> Click the “try again” button below
                to attempt a reconnection.
              </li>
            </ul>
          </div>
        </div>
        <button onClick={retryAll}>try again</button>
      </div>
    </div>
  );
};

export default ErrorFetchingUser;
