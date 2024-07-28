'use client';

import './login.css';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard, SignIn } from '../../assets/icons/getIcon';

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(false);
      const response = await axios.post('/api/users/login', user);
      console.log('Login success', response.data);
      toast.success('Successfully Logged In');
      if (response.data.role === 0) {
        router.push('/userfeedback');
      } else if (response.data.role === 1) {
        router.push('/profile');
      }
    } catch (error: any) {
      console.log(
        'Login failed',
        error?.response?.data?.message || error.message
      );
      toast.error(error?.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  return (
    <div className="col__flex max-height mob__col">
      <header className="padding-around-global desktop-hide tab-hide">
        <Image
          className="PS-logo desktop-hide"
          src={require('../../assets/images/PS-logo.png')}
          alt="PS logo"
        />
      </header>
      <aside className="padding-around-global side-width mob-hide">
        <header>
          <Image
            className="PS-logo"
            src={require('../../assets/images/PS-logo.png')}
            alt="PS logo"
          />
        </header>
        <main className="row-gap row-gap_20 main__wrapper padding-fixer-top padding-fixer-bottom">
          <ul className="bullet_list_items row-gap row-gap_20">
            <li className="align-center">
              <div className="bullet yellow"></div>
              <p>Your Voice Matters</p>
            </li>
            <li className="align-center">
              <div className="bullet lighter-yellow"></div>
              <p>Real Impact</p>
            </li>
            <li className="align-center">
              <div className="bullet light-yellow"></div>
              <p>Easy Participation</p>
            </li>
            <li className="align-center">
              <div className="bullet highlight"></div>
              <p>Personalized Experience</p>
            </li>
          </ul>
          <div className="row-gap row-gap_10">
            <h3 className="text-23x1 black-medium">S-2100</h3>
            <p>Over 2,100 responses have been collected from users.</p>
          </div>
        </main>
      </aside>
      <div className="flex__1 main__wrapper padding-around-global scrollable padding-fixer-top padding-fixer-bottom">
        <div className="form__white row-gap row-gap_20 padding-around-global">
          <div className="align-center signup__heading">
            <Dashboard />
            <h1 className="text-1x1 black-regular">
              Signup to share your thoughts
            </h1>
          </div>
          <div className="boxes align-center">
            <div className="rectangular-box yellow"></div>
            <div className="rectangular-box lighter-yellow"></div>
            <div className="rectangular-box light-yellow"></div>
            <div className="rectangular-box highlight"></div>
          </div>

          <label htmlFor="email">Email</label>
          <input
            className=""
            id="email"
            type="text"
            value={user.email}
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />

          <label htmlFor="password">Password</label>
          <input
            className=""
            id="password"
            type="password"
            value={user.password}
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
          {/* <span
            className="text-09x1"
            onClick={async () => router.push('/forgotpassword')}
          >
            Forget Password ?
          </span> */}
          <button
            className="align-center text-1x1"
            onClick={onLogin}
            disabled={buttonDisabled}
          >
            <span className="black-regular">Login</span> <SignIn />
          </button>
          <p className="align-center text-09x1 centralize">
            <span>Don't have an account?</span>
            <Link
              href="/signup"
              className="p-2  mb-4 focus:outline-none focus:border-gray-600 text-gray-500"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;