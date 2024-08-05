import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const useLogout = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(false);

  const onLogout = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      setDisable(true);

      await axios.get(`/api/users/logout`);
      setSuccess('Redirecting...');
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
      setError('An error occured');
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };
  return {
    isLogoutLoading: loading,
    isLogoutError: error,
    isLogoutSuccess: success,
    logoutDisable: disable,
    onLogout,
  };
};

export default useLogout;
