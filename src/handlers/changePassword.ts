import { useState } from 'react';
import axios from 'axios';

interface Password {
  old_password: string;
  password: string;
  password_confirmation: string;
}

const useChangePassword = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [disable, setDisable] = useState<boolean>(false);

  const onUpdate = async (
    email: string,
    password: Password,
    setPassword: React.Dispatch<React.SetStateAction<Password>>
  ) => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      setDisable(true);

      if (password.password !== password.password_confirmation) {
        setError('Password does not match');
        setPassword({
          ...password,
          password: '',
          password_confirmation: '',
        });
        return;
      }

      const response = await axios.patch(`/api/users/changepassword`, {
        email,
        old_password: password.old_password,
        password: password.password,
      });
      console.log('Password updated success');
      setSuccess(response.data?.message);
      setPassword({
        old_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error: any) {
      console.log(
        'Password update failed',
        error?.response?.data?.error?.message || error.message
      );
      setError(error?.response?.data?.error?.message || 'An error occurred');
    } finally {
      setLoading(false);
      setDisable(false);
    }
  };

  return {
    isPasswordLoading: loading,
    isPasswordError: error,
    isPasswordSuccess: success,
    disable,
    onUpdate,
  };
};

export default useChangePassword;
