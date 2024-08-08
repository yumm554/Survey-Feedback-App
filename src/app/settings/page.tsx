'use client';

import './settings.css';
import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import {
  FeedbackSubmission,
  SubmitFeedback,
  Overview,
  EyeSlash,
  Eye,
} from '../../assets/icons/getIcon';
import Header from '@/components/Header';
import GetUserDetails from '@/handlers/me';
import useChangePassword from '@/handlers/changePassword';
import ErrorFetchingUser from '@/components/ErrorFetchingUser';
import { useDebounceRetry } from '@/utils/debounceRetry';

interface Password {
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Setting = () => {
  const [mobNav, setMobNav] = useState<boolean>(false);
  const [password, setPassword] = useState<Password>({
    old_password: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  //me call
  const { user, isAdmin, isLoading, isError, retry } = GetUserDetails();

  //form submit
  const {
    isPasswordLoading,
    isPasswordError,
    isPasswordSuccess,
    onUpdate,
    disable,
  } = useChangePassword();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(user.email, password, setPassword);
  };

  //retry calls on internet back connection
  useDebounceRetry(retry);

  return (
    <>
      {isError ? (
        <ErrorFetchingUser retryCalls={{ retry }}></ErrorFetchingUser>
      ) : (
        <div className="col__flex">
          <Sidebar
            data={{
              user,
              mobNav,
              setMobNav,
              active: 'settings',
              sidebar: true,
              isAdmin,
              isLoading,
            }}
          />
          <div className="flex__1 max-height scrollable">
            <Header
              data={{
                user,
                mobNav,
                setMobNav,
                isLoading,
                sidebar: true,
                isAdmin,
              }}
            />
            <div className="form__white dashboard-col padding-around-global row-gap row-gap_20 margin-around-global">
              <div className="row-gap row-gap_20 padding-around-global border-around">
                <div className="align-center settings__heading">
                  <Overview />
                  <h1 className="text-1x1 black-regular">Personal Info</h1>
                </div>
                <div className="align-center col__flex mob__col-left mob__col-gap">
                  <div className="row-gap row-gap_10 flex__1">
                    <span className="grey-medium text-09x1">Username</span>
                    {isLoading ? (
                      <div className="text-loader"></div>
                    ) : (
                      <p>{user.username || `couldn't fetch`}</p>
                    )}
                  </div>

                  <div className="row-gap row-gap_10 flex__1 full-width">
                    <span className="grey-medium text-09x1">Email</span>
                    {isLoading ? (
                      <div className="text-loader"></div>
                    ) : (
                      <p className="ellipses">
                        {user.email || `couldn't fetch`}
                      </p>
                    )}
                  </div>

                  <div className="row-gap row-gap_10 flex__1">
                    <span className="grey-medium text-09x1 align-right mob-no-right">
                      Role
                    </span>
                    {isLoading ? (
                      <div className="text-loader align-right"></div>
                    ) : (
                      <p className="align-right mob-no-right">
                        {isAdmin ? 'Admin' : 'User'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="row-gap row-gap_20 padding-around-global border-around">
                <div className="align-center settings__heading">
                  <FeedbackSubmission />
                  <h1 className="text-1x1 black-regular">Change Password</h1>
                </div>
                <div className="row-gap row-gap_20">
                  <form
                    role="form"
                    onSubmit={handleSubmit}
                    className="row-gap row-gap_20 settings-form"
                  >
                    <div className="settings-form-input hide">
                      <label htmlFor="email">Email</label>
                      <input
                        id="email"
                        type="text"
                        pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                        disabled
                        value={user.email || `couldn't fetch`}
                        placeholder="Email"
                        required
                        autoComplete="email"
                      />
                    </div>

                    <label htmlFor="old_password">Old Password</label>
                    <input
                      className="settings-form-input"
                      id="old_password"
                      type="password"
                      value={password.old_password}
                      required
                      placeholder="Old Password"
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          old_password: e.target.value,
                        })
                      }
                      autoComplete="current-password"
                    />

                    <div className="relative settings-form-input">
                      <label htmlFor="password">Password</label>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        required
                        value={password.password}
                        placeholder="Password"
                        onChange={(e) =>
                          setPassword({ ...password, password: e.target.value })
                        }
                        autoComplete="new-password"
                      />
                      <span
                        className="show-password-icon"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label="toggle eye visibility for password"
                      >
                        {showPassword ? <Eye /> : <EyeSlash />}
                      </span>
                      <p className="validation-error">
                        must contain 8 or more characters that are of at least
                        one number, and one uppercase and lowercase letter
                      </p>
                    </div>

                    <div className="relative settings-form-input">
                      <label htmlFor="password_confirmation">
                        Confirm Password
                      </label>
                      <input
                        id="password_confirmation"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm Password"
                        required
                        value={password.password_confirmation}
                        onChange={(e) =>
                          setPassword({
                            ...password,
                            password_confirmation: e.target.value,
                          })
                        }
                        autoComplete="new-password"
                      />
                      <span
                        className="show-password-icon"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        aria-label="toggle eye visibility for confirm password"
                      >
                        {showConfirmPassword ? <Eye /> : <EyeSlash />}
                      </span>
                    </div>

                    {isPasswordLoading ? (
                      <button
                        className="align-center text-1x1"
                        disabled={disable}
                      >
                        <span className="black-regular">Updating</span>{' '}
                        <i className="loader"></i>
                      </button>
                    ) : (
                      <button className="align-center text-1x1">
                        <span className="black-regular">Update</span>{' '}
                        <SubmitFeedback />
                      </button>
                    )}
                  </form>

                  {isPasswordError && (
                    <p className="error text-09x1">{isPasswordError}</p>
                  )}
                  {isPasswordSuccess && (
                    <p className="success text-09x1">{isPasswordSuccess}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Setting;
