import { useCallback, useEffect } from 'react';
import { debounce } from '@/utils/debounce';
import axios from 'axios';

export const useDebounceRetry = (
  retry: () => void,
  retrySpecificty?: () => void
) => {
  const retryAll = useCallback(async () => {
    try {
      const response = await axios.get('/api/users/verifytoken');
      if (response.status === 200) {
        retry();
        retrySpecificty?.();
      }
    } catch (error: any) {
      console.error(error.message);
      window.location.href = '/login';
    }
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

  return { retryAll };
};
