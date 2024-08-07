import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const useDeleteAccount = () => {
  const router = useRouter();
  const [disable, setDisable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const onDelete = async (email: string) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      setDisable(true);
      const response = await axios.delete(`/api/users/deleteaccount`, {
        data: { email },
      });
      console.log('Deletion success', response.data);
      setSuccess(response.data?.message);
      router.push('/signup');
    } catch (error: any) {
      console.log(
        'Deletion failed',
        error?.response?.data?.error?.message || error.message
      );
      setError('An error occurred');
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };

  return {
    disable,
    isDeleteLoading: loading,
    isDeleteError: error,
    isDeleteSuccess: success,
    onDelete,
  };
};

export default useDeleteAccount;
