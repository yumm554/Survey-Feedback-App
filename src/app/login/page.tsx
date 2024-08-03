'use client';

import './login.css';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard, Eye, EyeSlash, SignIn } from '../../assets/icons/getIcon';

const Login = () => {
  const router = useRouter();
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const response = await axios.post('/api/users/login', user);
      console.log('Login success', response.data);
      toast.success('Redirecting...');
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
      toast.error(error?.response?.data?.error?.message || 'An error occurred');
      setError(error?.response?.data?.error?.message || 'An error occurred');
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
      <aside className="side-width mob-hide">
        <div className="max-height-inner max-height row-gap">
          <header className="padding-around-global">
            <Image
              className="PS-logo"
              src={require('../../assets/images/PS-logo.png')}
              alt="PS logo"
            />
          </header>
          <main className="row-gap_40 main__wrapper padding-around-global">
            <ul className="bullet_list_items row-gap_20 full-width-desktop">
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
              <h3 className="text-23x1 black-medium">
                Feedback Shapes Better Outcomes
              </h3>
            </div>
          </main>
        </div>
      </aside>
      <div className="scrollable max-height max-height-inner full-width-desktop padding-around-global">
        <div className="main__wrapper full-width-desktop flex__1 full-height-desktop">
          <div className="form__white row-gap row-gap_20 padding-around-global">
            <div className="align-center signup__heading">
              <Dashboard />
              <h1 className="text-1x1 black-regular">
                Log in to submit feedback
              </h1>
            </div>
            <div className="boxes align-center">
              <div className="rectangular-box yellow"></div>
              <div className="rectangular-box lighter-yellow"></div>
              <div className="rectangular-box light-yellow"></div>
              <div className="rectangular-box highlight"></div>
            </div>

            <form onSubmit={onLogin} className="row-gap row-gap_20">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={user.email}
                placeholder="Email"
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />

              <div className="relative">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={user.password}
                  required
                  placeholder="Password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
                <span
                  className="show-password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </span>
              </div>
              {loading ? (
                <button
                  className="align-center text-1x1"
                  disabled={buttonDisabled}
                >
                  <span className="black-regular">Logging In</span>{' '}
                  <i className="loader"></i>
                </button>
              ) : (
                <button className="align-center text-1x1">
                  <span className="black-regular">Log In</span> <SignIn />
                </button>
              )}
            </form>
            {error && <p className="error text-09x1">{error}</p>}
            {success && <p className="success text-09x1">{success}</p>}

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
      <div className="side-width full-width desktop-hide tab-hide">
        <ul className="bullet_list_items row-gap row-gap_20 smaller-row-gap">
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
      </div>
    </div>
  );
};

export default Login;
