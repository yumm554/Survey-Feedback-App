import axios from 'axios';
import { NextRouter } from 'next/router';
import toast from 'react-hot-toast';

interface CustomRouter {
  push: (url: string) => void;
}

const logout = async (router: CustomRouter) => {
  try {
    await axios.get(`/api/users/logout`);
    toast.success('Successfully Logged Out');
    router.push('/login');
  } catch (error: any) {
    console.log(error.message);
    toast.error(error.message);
  }
};

export default logout;
