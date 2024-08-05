import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  username: string;
  role: number;
  email: string;
}

const GetUserDetails = () => {
  const [user, setUser] = useState<User>({ username: '', role: 0, email: '' });
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setError('');
        setLoading(true);
        const response = await axios.get(`/api/users/me`);
        setUser({
          username: response.data?.user.username,
          role: response.data?.user.role,
          email: response.data?.user.email,
        });
        setIsAdmin(response.data?.user.role === 1);
      } catch (error: any) {
        setError('Get user details failed');
        console.log('Get user details failed', error.message);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  return { user, isAdmin, isLoading: loading, isError: error };
};

export default GetUserDetails;
