import { useCallback, useEffect } from 'react';
import { debounce } from '@/utils/debounce';

export const useDebounceRetry = (
  retry: () => void,
  retrySpecificty?: () => void
) => {
  const retryAll = useCallback(() => {
    retry();
    retrySpecificty?.();
  }, [retry, retrySpecificty]);

  const debounceRetry = useCallback(debounce(retryAll, 3000), [retryAll]);

  useEffect(() => {
    const handleOnline = () => {
      debounceRetry();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [debounceRetry]);
};
