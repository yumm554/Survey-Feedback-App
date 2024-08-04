'use client';

import Link from 'next/link';
import '../app/settings/settings.css';
import Image from 'next/image';
import {
  Dashboard,
  Delete,
  FeedbackSubmission,
  Signout,
  NavArrow,
  Reports,
  Settings,
} from '../assets/icons/getIcon';
import logout from '../handlers/logout';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

interface User {
  username: string;
  email: string;
  role: number;
}

interface HeadAsideProps {
  data: Data;
}
interface Data {
  user: User;
  mobNav: boolean;
  setMobNav: (value: boolean) => void;
  isLoading: boolean;
  active: string;
  sidebar: boolean;
  isAdmin: boolean;
}

const Sidebar: React.FC<HeadAsideProps> = ({ data }) => {
  const router = useRouter();
  const { user, mobNav, setMobNav, active, isLoading, sidebar, isAdmin } = data;
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const onDelete = async () => {
    try {
      setError('');
      setSuccess('');
      setLoading(true);
      const response = await axios.delete(`/api/users/deleteaccount`, {
        data: { email: user.email },
      });
      console.log('Deletion success', response.data);
      setSuccess('User deleted successfully');
      router.push('/signup');
    } catch (error: any) {
      console.log(
        'Deletion failed',
        error?.response?.data?.error?.message || error.message
      );
      setError(error?.response?.data?.error?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                src="/PS-logo.png"
                alt="PS logo"
                width="70"
                height="70"
              />
            </header>
            <main className="sidebar-padding-around">
              <nav>
                {isLoading ? (
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
                    {active === 'settings' ? (
                      <>
                        <div className="hr"></div>
                        <li>
                          <p className="text-loader"></p>
                        </li>
                      </>
                    ) : (
                      ''
                    )}
                  </ul>
                ) : (
                  <ul className="nav_list_items row-gap_10">
                    {isAdmin && (
                      <>
                        <li className="align-center pointer">
                          <Dashboard />
                          <p>Dashboard</p>
                        </li>
                        <li
                          className={`${
                            active === 'list'
                              ? 'highlight-background disabled'
                              : 'pointer'
                          }`}
                        >
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
                    <li
                      className={`${
                        active === 'settings'
                          ? 'highlight-background disabled'
                          : 'pointer'
                      }`}
                    >
                      <Link
                        href="/settings"
                        className="no-underline align-center"
                      >
                        <Settings />
                        <p>Settings</p>
                      </Link>
                    </li>
                    <li
                      className="align-center pointer"
                      onClick={() => logout(router)}
                    >
                      <Signout />
                      <p>Logout</p>
                    </li>
                    {active === 'feedback' ? (
                      ''
                    ) : (
                      <li className="desktop-hide pointer">
                        <Link
                          href="/userfeedback"
                          className="no-underline align-center"
                        >
                          <span className="black-regular">Open the survey</span>{' '}
                          <NavArrow />
                        </Link>
                      </li>
                    )}
                    {active === 'settings' ? (
                      <>
                        <div className="hr"></div>
                        <li className="row-gap row-gap_10">
                          <div className="align-center pointer">
                            <Delete />
                            {isDelete ? (
                              <div className="align-center">
                                <span
                                  className="delete-account"
                                  onClick={onDelete}
                                >
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
                      </>
                    ) : (
                      ''
                    )}
                  </ul>
                )}
              </nav>
            </main>
          </aside>
        </>
      )}

      {sidebar && (
        <aside className="relative side-width feedback-sidebar mob-hide tab-hide">
          <header className="padding-around-global">
            <Image
              className="PS-logo"
              src="/PS-logo.png"
              alt="PS logo"
              width="70"
              height="70"
            />
          </header>
          <main className="sidebar-padding-around">
            <nav>
              {isLoading ? (
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
                  {active === 'settings' ? (
                    <>
                      <div className="hr"></div>
                      <li>
                        <p className="text-loader"></p>
                      </li>
                    </>
                  ) : (
                    ''
                  )}
                </ul>
              ) : (
                <ul className="nav_list_items row-gap_10">
                  {isAdmin && (
                    <>
                      <li className="align-center pointer">
                        <Dashboard />
                        <p>Dashboard</p>
                      </li>
                      <li
                        className={`${
                          active === 'list'
                            ? 'highlight-background disabled'
                            : 'pointer'
                        }`}
                      >
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
                  <li
                    className={`align-center ${
                      active === 'settings'
                        ? 'highlight-background disabled '
                        : 'pointer'
                    }`}
                  >
                    <Link
                      href="/settings"
                      className="no-underline align-center"
                    >
                      <Settings />
                      <p>Settings</p>
                    </Link>
                  </li>
                  <li
                    className="align-center pointer"
                    onClick={() => logout(router)}
                  >
                    <Signout />
                    <p>Logout</p>
                  </li>
                  {active === 'settings' ? (
                    <>
                      <div className="hr"></div>
                      <li className="row-gap row-gap_10">
                        <div className="align-center pointer">
                          <Delete />
                          {isDelete ? (
                            <div className="align-center">
                              <span
                                className="delete-account"
                                onClick={onDelete}
                              >
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
                        {loading && isDelete && (
                          <p className="error text-09x1">deleting...</p>
                        )}
                        {error && isDelete && (
                          <p className="error text-09x1">{error}</p>
                        )}
                        {success && isDelete && (
                          <p className="success text-09x1">{success}</p>
                        )}
                      </li>
                    </>
                  ) : (
                    ''
                  )}
                </ul>
              )}
            </nav>
          </main>
        </aside>
      )}
    </>
  );
};
export default Sidebar;
