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
} from '../../assets/icons/getIcon';

interface User {
  username: string;
  email: string;
  role: number;
  password: string;
  password_confirmation: string;
}

const SignUp = () => {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
    role: 0,
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

  return (
    <div className="col__flex">
      {mobNav && (
        <>
          <div
            className="mob-nav-overlay desktop-hide"
            onClick={() => setMobNav(!mobNav)}
          ></div>

          <aside className="relative side-width padding-around-global feedback-sidebar desktop-hide">
            <header>
              <Image
                className="PS-logo"
                src={require('../../assets/images/PS-logo.png')}
                alt="PS logo"
              />
            </header>
            <main>
              <nav>
                <ul className="bullet_list_items row-gap_10">
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
                  <li className="align-center pointer">
                    <Delete />
                    <span className="delete-account">Delete Account</span>
                  </li>
                </ul>
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

          <aside className="relative side-width padding-around-global feedback-sidebar mob-hide tab-hide">
            <header>
              <Image
                className="PS-logo"
                src={require('../../assets/images/PS-logo.png')}
                alt="PS logo"
              />
            </header>
            <main>
              <nav>
                {loading ? (
                  <ul className="bullet_list_items row-gap_10">
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
                  <ul className="bullet_list_items row-gap_10">
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
                    <li className="align-center pointer">
                      <Delete />
                      <span className="delete-account">Delete Account</span>
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
                {loading ? (
                  <div className="text-loader"></div>
                ) : (
                  <p>{user.username || 'Username'}</p>
                )}
                {loading ? (
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
                  {loading ? (
                    <div className="text-loader"></div>
                  ) : (
                    <p>{user.username}</p>
                  )}
                </div>

                <div className="row-gap row-gap_10 flex__1">
                  <span className="grey-medium text-09x1">Email</span>
                  {loading ? (
                    <div className="text-loader"></div>
                  ) : (
                    <p>{user.email}</p>
                  )}
                </div>

                <div className="row-gap row-gap_10 flex__1">
                  <span className="grey-medium text-09x1 align-right mob-no-right">
                    Role
                  </span>
                  {loading ? (
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
              <div className="">
                <form className="row-gap row-gap_20 settings-form">
                  <label htmlFor="password">Password</label>
                  <input
                    className=""
                    id="password"
                    type="password"
                    value={user.password}
                    required
                    placeholder="Password"
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                  />

                  <label htmlFor="password">Confirm Password</label>
                  <input
                    className=""
                    id="password_confirmation"
                    type="password"
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
                  {loading ? (
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

export default SignUp;
