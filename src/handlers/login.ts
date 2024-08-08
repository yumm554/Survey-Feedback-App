import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface User {
  email: string;
  password: string;
}

const useLogin = () => {
  const router = useRouter();
  const [disable, setDisable] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const onLogin = async (user: User) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      setDisable(true);
      const response = await axios.post('/api/users/login', user);
      console.log('Login success');
      setSuccess('Redirecting...');
      if (response.data.role === 0) {
        router.push('/userfeedback');
      } else if (response.data.role === 1) {
        router.push('/feedbacklist');
      }
    } catch (error: any) {
      console.log(
        'Login failed',
        error?.response?.data?.error?.message || error.message
      );
      setError(error?.response?.data?.error?.message || 'An error occurred');
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };

  return {
    disable,
    isLoginLoading: loading,
    isLoginError: error,
    isLoginSuccess: success,
    onLogin,
  };
};

export default useLogin;
