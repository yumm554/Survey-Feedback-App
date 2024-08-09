'use client';

import './login.css';
import Link from 'next/link';
import { useState } from 'react';
import { Dashboard, Eye, EyeSlash, SignIn } from '../../assets/icons/getIcon';
import HeadAside from '@/components/HeadAside';
import BulletPoints from '@/components/BulletPoints';
import RectangularBoxes from '@/components/RectangularBoxes';
import useLogin from '@/handlers/login';

interface User {
  email: string;
  password: string;
}

const Login = () => {
  const [user, setUser] = useState<User>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);

  //form submit
  const { isLoginLoading, isLoginError, isLoginSuccess, onLogin, disable } =
    useLogin();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onLogin(user);
  };

  return (
    <div className="col__flex max-height mob__col login_wrapper">
      <HeadAside
        colors={{
          normal: 'yellow',
          lighter: 'lighter-yellow',
          light: 'light-yellow',
        }}
      />
      <div className="scrollable max-height max-height-inner full-width-desktop padding-around-global mob__col mob__col-gap">
        <div className="justify-center full-width-desktop flex__1 full-height-desktop">
          <div className="form__white row-gap row-gap_20 padding-around-global">
            <div className="align-center signup__heading">
              <Dashboard />
              <h1 className="text-1x1 black-regular">
                Log in to submit feedback
              </h1>
            </div>
            <RectangularBoxes
              colors={{
                normal: 'yellow',
                lighter: 'lighter-yellow',
                light: 'light-yellow',
              }}
            />

            <form onSubmit={handleSubmit} className="row-gap row-gap_20">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                value={user.email}
                placeholder="Email"
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                autoComplete="email"
              />

              <div className="relative">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={user.password}
                  placeholder="Password"
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  autoComplete="current-password"
                />
                <span
                  className="show-password-icon"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="toggle eye visibility for password"
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </span>
              </div>
              {isLoginLoading ? (
                <button className="align-center text-1x1" disabled={disable}>
                  <span className="black-regular">Logging In</span>{' '}
                  <i className="loader"></i>
                </button>
              ) : (
                <button className="align-center text-1x1">
                  <span className="black-regular">Log In</span> <SignIn />
                </button>
              )}
            </form>
            {isLoginError && <p className="error text-09x1">{isLoginError}</p>}
            {isLoginSuccess && (
              <p className="success text-09x1">{isLoginSuccess}</p>
            )}

            <p className="align-center text-09x1 centralize">
              <span>Don't have an account?</span>
              <Link
                href="/signup"
                className="p-2  mb-4 focus:outline-none focus:border-gray-600 text-gray-500"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
        <div className="side-width full-width desktop-hide tab-hide">
          <BulletPoints
            colors={{
              normal: 'yellow',
              lighter: 'lighter-yellow',
              light: 'light-yellow',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
