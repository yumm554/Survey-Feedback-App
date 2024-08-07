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

  return (
    <div className="main__wrapper max-height">
      <div className="align-center">
        <div className="error">Couldn't connect to the internet!</div>
        <button
          onClick={() => {
            retry();
            retrySpecificty?.();
          }}
        >
          try again
        </button>
      </div>
    </div>
  );
};

export default ErrorFetchingUser;
