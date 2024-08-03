'use client';

import axios from 'axios';
import Link from 'next/link';
import './settings.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import logout from '../../handlers/logout';
import {
  Dashboard,
  Delete,
  FeedbackSubmission,
  Hamburger,
  Logout,
  NavArrow,
  Reports,
  Settings,
  SignIn,
  User,
  SubmitFeedback,
  Overview,
  EyeSlash,
  Eye,
} from '../../assets/icons/getIcon';
import toast from 'react-hot-toast';

interface User {
  username: string;
  email: string;
  role: number;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Setting = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    role: 0,
    old_password: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(true);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [mobNav, setMobNav] = useState<boolean>(false);
  const [desktopNav, setDesktopNav] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    if (
      user.username &&
      user.email &&
      user.password &&
      user.password_confirmation &&
      user.password === user.password_confirmation
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/me`);
        console.log(response);
        setUser({
          ...user,
          username: response.data?.user.username,
          email: response.data?.user.email,
          role: response.data?.user.role,
        });
        setIsAdmin(response.data?.user.role === 1);
      } catch (error: any) {
        console.log('Get user details failed', error.message);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  const onDelete = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const response = await axios.delete(`/api/users/deleteaccount`, {
        data: { email: user.email },
      });
      console.log('Deletion success', response.data);
      toast.success('User deleted successfully');
      setSuccess('User deleted successfully');
      router.push('/signup');
    } catch (error: any) {
      console.log(
        'Deletion failed',
        error?.response?.data?.error?.message || error.message
      );
      toast.error(error?.response?.data?.error?.message || 'An error occurred');
      setError(error?.response?.data?.error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const onUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      if (user.password !== user.password_confirmation) {
        setError('Password does not match');
        setUser({
          ...user,
          password: '',
          password_confirmation: '',
        });
        return;
      }
      const response = await axios.patch(`/api/users/changepassword`, user);
      console.log('Password updated success', response.data);
      toast.success('Password Successfully Updated');
      setSuccess('Password Successfully Updated');
      setUser({
        ...user,
        old_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error: any) {
      console.log(
        'Password update failed',
        error?.response?.data?.error?.message || error.message
      );
      toast.error(error?.response?.data?.error?.message || 'An error occurred');
      setError(error?.response?.data?.error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col__flex">
      {mobNav && (
        <>
          <div
            className="mob-nav-overlay desktop-hide"
            onClick={() => setMobNav(!mobNav)}
          ></div>

          <aside className="relative side-width feedback-sidebar desktop-hide">
            <header className="padding-around-global">
              <Image
                className="PS-logo"
                src={require('../../assets/images/PS-logo.png')}
                alt="PS logo"
              />
            </header>
            <main className="sidebar-padding-around">
              <nav>
                {loading && !user.password_confirmation ? (
                  <ul className="nav_list_items row-gap_10">
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <div className="hr"></div>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                  </ul>
                ) : (
                  <ul className="nav_list_items row-gap_10">
                    {isAdmin && (
                      <>
                        <li className="align-center pointer">
                          <Dashboard />
                          <p>Dashboard</p>
                        </li>
                        <li className="align-center pointer">
                          <Link
                            href="/feedbacklist"
                            className="no-underline align-center"
                          >
                            <FeedbackSubmission />
                            <p>Feedback Submissions</p>
                          </Link>
                        </li>
                        <li className="align-center pointer">
                          <Reports />
                          <p>Reports</p>
                        </li>
                      </>
                    )}
                    <li className="align-center highlight-background">
                      <Settings />
                      <p>Settings</p>
                    </li>
                    <li
                      className="align-center pointer"
                      onClick={() => logout(router)}
                    >
                      <Logout />
                      <p>Logout</p>
                    </li>
                    <li className="desktop-hide pointer">
                      <Link
                        href="/userfeedback"
                        className="no-underline align-center"
                      >
                        <span className="black-regular">Open the survey</span>{' '}
                        <NavArrow />
                      </Link>
                    </li>
                    <div className="hr"></div>
                    <li className="row-gap row-gap_10">
                      <div className="align-center pointer">
                        <Delete />
                        {isDelete ? (
                          <div className="align-center">
                            <span className="delete-account" onClick={onDelete}>
                              Really Delete?
                            </span>
                            <span
                              className="text-09x1 grey-medium"
                              onClick={() => setIsDelete(false)}
                            >
                              Cancel
                            </span>
                          </div>
                        ) : (
                          <span
                            className="delete-account"
                            onClick={() => setIsDelete(true)}
                          >
                            Delete Account
                          </span>
                        )}
                      </div>
                      {error && isDelete && (
                        <p className="error text-09x1">{error}</p>
                      )}
                      {success && isDelete && (
                        <p className="success text-09x1">{success}</p>
                      )}
                    </li>
                  </ul>
                )}
              </nav>
            </main>
          </aside>
        </>
      )}
      {desktopNav && (
        <>
          <div
            className="mob-nav-overlay mob-hide tab-hide"
            onClick={() => setMobNav(!mobNav)}
          ></div>

          <aside className="relative side-width feedback-sidebar mob-hide tab-hide">
            <header className="padding-around-global">
              <Image
                className="PS-logo"
                src={require('../../assets/images/PS-logo.png')}
                alt="PS logo"
              />
            </header>
            <main className="sidebar-padding-around">
              <nav>
                {loading && !user.password_confirmation ? (
                  <ul className="nav_list_items row-gap_10">
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                    <div className="hr"></div>
                    <li>
                      <p className="text-loader"></p>
                    </li>
                  </ul>
                ) : (
                  <ul className="nav_list_items row-gap_10">
                    {isAdmin && (
                      <>
                        <li className="align-center pointer">
                          <Dashboard />
                          <p>Dashboard</p>
                        </li>
                        <li className="align-center pointer">
                          <Link
                            href="/feedbacklist"
                            className="no-underline align-center"
                          >
                            <FeedbackSubmission />
                            <p>Feedback Submissions</p>
                          </Link>
                        </li>

                        <li className="align-center pointer">
                          <Reports />
                          <p>Reports</p>
                        </li>
                      </>
                    )}
                    <li className="align-center highlight-background">
                      <Settings />
                      <p>Settings</p>
                    </li>
                    <li
                      className="align-center pointer"
                      onClick={() => logout(router)}
                    >
                      <Logout />
                      <p>Logout</p>
                    </li>
                    <div className="hr"></div>
                    <li className="row-gap row-gap_10">
                      <div className="align-center pointer">
                        <Delete />
                        {isDelete ? (
                          <div className="align-center">
                            <span className="delete-account" onClick={onDelete}>
                              Really Delete?
                            </span>
                            <span
                              className="text-09x1 grey-medium"
                              onClick={() => setIsDelete(false)}
                            >
                              Cancel
                            </span>
                          </div>
                        ) : (
                          <span
                            className="delete-account"
                            onClick={() => setIsDelete(true)}
                          >
                            Delete Account
                          </span>
                        )}
                      </div>
                      {error && isDelete && (
                        <p className="error text-09x1">{error}</p>
                      )}
                      {success && isDelete && (
                        <p className="success text-09x1">{success}</p>
                      )}
                    </li>
                  </ul>
                )}
              </nav>
            </main>
          </aside>
        </>
      )}
      <div className="flex__1 max-height scrollable">
        <header className="header__white space-between padding-around-global">
          <div
            className="mob__hamburger desktop-hide"
            onClick={() => setMobNav(!mobNav)}
          >
            <Hamburger />
          </div>
          <Link
            href="/userfeedback"
            className="no-underline align-center mob-hide tab-hide"
          >
            <span className="black-regular">Open the survey</span> <NavArrow />
          </Link>

          <div>
            <div className="align-center">
              <div className="user-border">
                <User />
              </div>
              <div className="loader-used">
                {loading && !user.password_confirmation ? (
                  <div className="text-loader"></div>
                ) : (
                  <p>{user.username || 'Username'}</p>
                )}
                {loading && !user.password_confirmation ? (
                  <div className="text-loader"></div>
                ) : (
                  <span className="grey-medium text-09x1">
                    {user.role === 0 ? 'User' : 'Admin'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </header>
        <div className="form__white dashboard-col margin-around-global row-gap row-gap_20 ">
          <div className="form__white dashboard-col padding-around-global row-gap row-gap_20">
            <div className="row-gap row-gap_20 padding-around-global border-around">
              <div className="align-center settings__heading">
                <Overview />
                <h1 className="text-1x1 black-regular">Personal Info</h1>
              </div>
              <div className="align-center col__flex mob__col-left mob__col-gap">
                <div className="row-gap row-gap_10 flex__1">
                  <span className="grey-medium text-09x1">Name</span>
                  {loading && !user.password_confirmation ? (
                    <div className="text-loader"></div>
                  ) : (
                    <p>{user.username}</p>
                  )}
                </div>

                <div className="row-gap row-gap_10 flex__1 full-width">
                  <span className="grey-medium text-09x1">Email</span>
                  {loading && !user.password_confirmation ? (
                    <div className="text-loader"></div>
                  ) : (
                    <p className="ellipses">{user.email}</p>
                  )}
                </div>

                <div className="row-gap row-gap_10 flex__1">
                  <span className="grey-medium text-09x1 align-right mob-no-right">
                    Role
                  </span>
                  {loading && !user.password_confirmation ? (
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
                  onSubmit={onUpdate}
                >
                  <label htmlFor="password">Old Password</label>
                  <input
                    id="password"
                    type="password"
                    value={user.old_password}
                    required
                    placeholder="Old Password"
                    onChange={(e) =>
                      setUser({ ...user, old_password: e.target.value })
                    }
                  />

                  <div className="relative input">
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
                    <p className="validation-error">
                      must contain 8 or more characters that are of at least one
                      number, and one uppercase and lowercase letter
                    </p>
                  </div>

                  <div className="relative input">
                    <label htmlFor="password">Confirm Password</label>
                    <input
                      id="password_confirmation"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={user.password_confirmation}
                      placeholder="Confirm Password"
                      required
                      onChange={(e) =>
                        setUser({
                          ...user,
                          password_confirmation: e.target.value,
                        })
                      }
                    />
                    <span
                      className="show-password-icon"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? <Eye /> : <EyeSlash />}
                    </span>
                  </div>

                  {loading && user.password_confirmation ? (
                    <button
                      className="align-center text-1x1"
                      disabled={buttonDisabled}
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

                {error && <p className="error text-09x1">{error}</p>}
                {success && <p className="success text-09x1">{success}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Setting;
