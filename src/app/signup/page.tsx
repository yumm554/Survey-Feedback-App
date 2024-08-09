'use client';

import Link from 'next/link';
import './signup.css';
import { useState } from 'react';
import {
  Eye,
  EyeSlash,
  FeedbackSubmission,
  SignIn,
} from '../../assets/icons/getIcon';
import HeadAside from '@/components/HeadAside';
import BulletPoints from '@/components/BulletPoints';
import RectangularBoxes from '@/components/RectangularBoxes';
import useSignup from '@/handlers/signup';

interface User {
  username: string;
  email: string;
  role: number;
  key: string;
  password: string;
  password_confirmation: string;
}

const SignUp = () => {
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    role: 0,
    key: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  //form submit
  const { isSignupLoading, isSignupError, isSignupSuccess, onSignUp, disable } =
    useSignup();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSignUp(user, setUser);
  };

  return (
    <div className="col__flex max-height mob__col signup_wrapper">
      <HeadAside
        colors={{
          normal: 'purple',
          lighter: 'lighter-purple',
          light: 'light-purple',
        }}
      />
      <div className="scrollable max-height max-height-inner full-width-desktop padding-around-global mob__col mob__col-gap">
        <div className="justify-center full-width-desktop flex__1 full-height-desktop">
          <div className="form__white row-gap row-gap_20 padding-around-global">
            <div className="align-center signup__heading">
              <FeedbackSubmission />
              <h1 className="text-1x1 black-regular">
                Sign up to share your thoughts
              </h1>
            </div>
            <RectangularBoxes
              colors={{
                normal: 'purple',
                lighter: 'lighter-purple',
                light: 'light-purple',
              }}
            />
            <form onSubmit={handleSubmit} className="row-gap row-gap_20">
              <div>
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  pattern="\w{2,10}"
                  value={user.username}
                  placeholder="Username"
                  required
                  onChange={(e) =>
                    setUser({ ...user, username: e.target.value })
                  }
                  autoComplete="username"
                />
                <p className="validation-error">
                  Username must be between 2-10 characters, can contain
                  alphanumeric and underscore only.
                </p>
              </div>

              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="text"
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                value={user.email}
                placeholder="Email"
                required
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                autoComplete="email"
              />
              {/* <label htmlFor="role">Role</label>
      <input
        className=""
        id="role"
        type="text"
        value={user.role}
        placeholder="role"
        onChange={(e) => setUser({ ...user, role: e.target.value })}
      /> */}

              <div className="align-center">
                <input
                  type="checkbox"
                  id="user"
                  value={0}
                  checked={user.role === 0}
                  onChange={() => setUser({ ...user, role: 0, key: '' })}
                />
                <label htmlFor="user" className="no-hide">
                  User
                </label>

                <input
                  id="admin"
                  type="checkbox"
                  value={1}
                  checked={user.role === 1}
                  onChange={() => setUser({ ...user, role: 1 })}
                />
                <label htmlFor="admin" className="no-hide">
                  Admin
                </label>
              </div>

              {user.role === 1 ? (
                <>
                  <label htmlFor="key">Key</label>
                  <input
                    id="key"
                    type="password"
                    pattern="\w{9}"
                    value={user.key}
                    required
                    placeholder="Key"
                    onChange={(e) => setUser({ ...user, key: e.target.value })}
                    autoComplete="off"
                  />
                </>
              ) : (
                ''
              )}

              <div className="relative input">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
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
                <p className="validation-error">
                  must contain 8 or more characters that are of at least one
                  number, and one uppercase and lowercase letter
                </p>
              </div>

              <div className="relative input">
                <label htmlFor="password_confirmation">Confirm Password</label>
                <input
                  id="password_confirmation"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={user.password_confirmation}
                  required
                  onChange={(e) =>
                    setUser({ ...user, password_confirmation: e.target.value })
                  }
                  autoComplete="current-password"
                />
                <span
                  className="show-password-icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="toggle eye visibility for confirm password"
                >
                  {showConfirmPassword ? <Eye /> : <EyeSlash />}
                </span>
              </div>

              {isSignupLoading ? (
                <button className="align-center text-1x1" disabled={disable}>
                  <span className="black-regular">Signing Up</span>{' '}
                  <i className="loader"></i>
                </button>
              ) : (
                <button className="align-center text-1x1">
                  <span className="black-regular">Sign Up</span> <SignIn />
                </button>
              )}
            </form>
            {isSignupError && (
              <p className="error text-09x1">{isSignupError}</p>
            )}
            {isSignupSuccess && (
              <p className="success text-09x1">{isSignupSuccess}</p>
            )}

            <p className="align-center text-09x1 centralize">
              <span>Already have an account?</span>
              <Link
                href="/login"
                className="p-2  mb-4 focus:outline-none focus:border-gray-600 text-gray-500"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
        <div className="side-width full-width desktop-hide tab-hide">
          <BulletPoints
            colors={{
              normal: 'purple',
              lighter: 'lighter-purple',
              light: 'light-purple',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SignUp;
