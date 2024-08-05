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
import useDeleteAccount from '@/handlers/deleteAccount';
import useLogout from '../handlers/logout';

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

  //handle logout
  const {
    isLogoutLoading,
    isLogoutError,
    isLogoutSuccess,
    logoutDisable,
    onLogout,
  } = useLogout();
  const handleLogout = async () => {
    onLogout();
  };

  //handle delete account
  const { disable, isDeleteLoading, isDeleteError, isDeleteSuccess, onDelete } =
    useDeleteAccount();
  const handleDelete = () => {
    onDelete(user.email);
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
                    <li className="row-gap row-gap_10" onClick={handleLogout}>
                      <div className="align-center pointer">
                        <Signout />
                        {isLogoutLoading ? (
                          <span
                            className={
                              'align-center ' + logoutDisable ? 'disabled' : ''
                            }
                          >
                            Logging Out
                          </span>
                        ) : (
                          <span className="align-center">Logout</span>
                        )}
                      </div>
                      {isLogoutError && (
                        <p className="error text-09x1">{isLogoutError}</p>
                      )}
                      {isLogoutSuccess && (
                        <p className="success text-09x1">{isLogoutSuccess}</p>
                      )}
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
                                  className={
                                    'delete-account ' + disable
                                      ? 'disabled'
                                      : ''
                                  }
                                  onClick={handleDelete}
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
                          {isDeleteLoading && (
                            <p className="error text-09x1">deleting...</p>
                          )}
                          {isDeleteError && (
                            <p className="error text-09x1">{isDeleteError}</p>
                          )}
                          {isDeleteSuccess && (
                            <p className="success text-09x1">
                              {isDeleteSuccess}
                            </p>
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
                  <li className="row-gap row-gap_10" onClick={handleLogout}>
                    <div className="align-center pointer">
                      <Signout />
                      {isLogoutLoading ? (
                        <span
                          className={
                            'align-center ' + logoutDisable ? 'disabled' : ''
                          }
                        >
                          Logging Out
                        </span>
                      ) : (
                        <span className="align-center">Logout</span>
                      )}
                    </div>
                    {isLogoutError && (
                      <p className="error text-09x1">{isLogoutError}</p>
                    )}
                    {isLogoutSuccess && (
                      <p className="success text-09x1">{isLogoutSuccess}</p>
                    )}
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
                                className={
                                  'delete-account ' + disable ? 'disabled' : ''
                                }
                                onClick={handleDelete}
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
                        {isDeleteLoading && (
                          <p className="error text-09x1">deleting...</p>
                        )}
                        {isDeleteError && (
                          <p className="error text-09x1">{isDeleteError}</p>
                        )}
                        {isDeleteSuccess && (
                          <p className="success text-09x1">{isDeleteSuccess}</p>
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
