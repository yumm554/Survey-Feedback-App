'use client';

import axios from 'axios';
import Link from 'next/link';
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
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import GetUserDetails from '@/handlers/me';
import useChangePassword from '@/handlers/changePassword';

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
  const { user, isAdmin, isLoading } = GetUserDetails();

  //form submit
  const {
    onUpdate,
    isPasswordLoading,
    isPasswordError,
    isPasswordSuccess,
    disable,
  } = useChangePassword();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdate(user.email, password, setPassword);
  };

  return (
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
        <Header data={{ user, mobNav, setMobNav, isLoading, sidebar: true }} />
        <div className="form__white dashboard-col padding-around-global row-gap row-gap_20 margin-around-global">
          <div className="row-gap row-gap_20 padding-around-global border-around">
            <div className="align-center settings__heading">
              <Overview />
              <h1 className="text-1x1 black-regular">Personal Info</h1>
            </div>
            <div className="align-center col__flex mob__col-left mob__col-gap">
              <div className="row-gap row-gap_10 flex__1">
                <span className="grey-medium text-09x1">Name</span>
                {isLoading ? (
                  <div className="text-loader"></div>
                ) : (
                  <p>{user.username}</p>
                )}
              </div>

              <div className="row-gap row-gap_10 flex__1 full-width">
                <span className="grey-medium text-09x1">Email</span>
                {isLoading ? (
                  <div className="text-loader"></div>
                ) : (
                  <p className="ellipses">{user.email}</p>
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
                    {user.role === 0 ? 'User' : 'Admin'}
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
                className="row-gap row-gap_20 settings-form"
                onSubmit={handleSubmit}
              >
                <label htmlFor="password">Old Password</label>
                <input
                  className="settings-form-input"
                  id="password"
                  type="password"
                  value={password.old_password}
                  required
                  placeholder="Old Password"
                  onChange={(e) =>
                    setPassword({ ...password, old_password: e.target.value })
                  }
                />

                <div className="relative input settings-form-input">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password.password}
                    placeholder="Password"
                    onChange={(e) =>
                      setPassword({ ...password, password: e.target.value })
                    }
                  />
                  <span
                    className="show-password-icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <Eye /> : <EyeSlash />}
                  </span>
                  <p className="validation-error">
                    must contain 8 or more characters that are of at least one
                    number, and one uppercase and lowercase letter
                  </p>
                </div>

                <div className="relative input settings-form-input">
                  <label htmlFor="password">Confirm Password</label>
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
                  />
                  <span
                    className="show-password-icon"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <Eye /> : <EyeSlash />}
                  </span>
                </div>

                {isPasswordLoading ? (
                  <button className="align-center text-1x1" disabled={disable}>
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
  );
};

export default Setting;
