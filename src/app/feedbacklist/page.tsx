// components/FeedbackList.tsx
'use client';
import {
  Dashboard,
  FeedbackSubmission,
  Hamburger,
  Logout,
  Overview,
  PaginationArrow,
  RatingStar,
  Reports,
  Settings,
} from '@/assets/icons/getIcon';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import './feedbackList.css';
import logout from '../../handlers/logout';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { NavArrow, User } from '@/assets/icons/getIcon';

interface Feedback {
  _id: string;
  username: string;
  email: string;
  rating: number;
  comments: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalPages: number;
  totalFeedbacks: number;
}

interface Me {
  username: string;
  role: number;
}

const FeedbackList: React.FC = () => {
  const router = useRouter();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalFeedbacks: 0,
  });
  const [user, setUser] = useState<Me>({
    username: '',
    role: 1,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [mobNav, setMobNav] = useState<boolean>(false);
  const [desktopNav, setDesktopNav] = useState<boolean>(true);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  //me call
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/me`);
        console.log(response);
        setUser({
          username: response.data?.user.username,
          role: response.data?.user.role,
        });
      } catch (error: any) {
        console.log('Get user details failed', error.message);
      }
    };
    getUserDetails();
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        setError('');
        setLoading(true);
        setDisabled(true);
        const res = await fetch(
          `/api/users/feedbacks?page=${pagination.page}&limit=${pagination.limit}`
        );
        const data = await res.json();

        setFeedbacks(data.feedbacks);
        setPagination(data.pagination);
        setDisabled(false);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, [pagination.page]);

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
                <ul className="nav_list_items row-gap_10">
                  <li className="align-center pointer">
                    <Dashboard />
                    <p>Dasboard</p>
                  </li>
                  <li className="align-center highlight-background">
                    <FeedbackSubmission />
                    <p>Feedback Submissions</p>
                  </li>
                  <li className="align-center pointer">
                    <Reports />
                    <p>Reports</p>
                  </li>
                  <li className="align-center pointer">
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
                {loading ? (
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
                  </ul>
                ) : (
                  <ul className="nav_list_items row-gap_10">
                    <li className="align-center pointer">
                      <Dashboard />
                      <p>Dasboard</p>
                    </li>
                    <li className="align-center highlight-background">
                      <FeedbackSubmission />
                      <p>Feedback Submissions</p>
                    </li>
                    <li className="align-center pointer">
                      <Reports />
                      <p>Reports</p>
                    </li>
                    <li className="align-center pointer">
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
                      <Logout />
                      <p>Logout</p>
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
        <div className="form__white dashboard-col margin-around-global row-gap row-gap_20 padding-around-global">
          <div className="align-center overview__heading">
            <Overview />
            <h1 className="text-1x1 black-regular">Overview</h1>
          </div>
          <div className="align-bottom">
            <div className="row-gap row-gap row-gap_10 loader-used">
              {loading ? (
                <div className="text-loader"></div>
              ) : (
                <h3 className="text-23x1 black-medium">
                  S-{pagination.totalFeedbacks}
                </h3>
              )}
              {loading ? (
                <div className="text-loader"></div>
              ) : (
                <p>
                  Over {pagination.totalFeedbacks} responses have been collected
                  from users.
                </p>
              )}
            </div>
            <div className="boxes align-center">
              <div className="rectangular-box green"></div>
              <div className="rectangular-box lighter-green"></div>
              <div className="rectangular-box light-green"></div>
              <div className="rectangular-box highlight"></div>
            </div>
          </div>
        </div>
        <div className="form__white dashboard-col feedback-list margin-around-global">
          <div className="align-center feedback__heading padding-around-global">
            <FeedbackSubmission />
            <h1 className="text-1x1 black-regular">Feedback Submissions</h1>
          </div>

          <table className="margin-around-global mob__col border-around">
            <thead>
              <tr>
                <th className="collapsed-cell">Name</th>
                <th className="collapsed-cell">Email</th>
                <th className="rating-cell align-right">Rating</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr className="no-background">
                  <td className="error text-09x1">{error}</td>
                </tr>
              ) : loading ? (
                <tr className="no-background">
                  <td>Loading...</td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td className="collapsed-cell">{feedback.username}</td>
                    <td className="collapsed-cell">{feedback.email}</td>
                    <td className="rating-cell align-right">
                      <div className="rating-box-light light-green">
                        <RatingStar />
                        <b className="rating-col">{feedback.rating}</b>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="space-between mob__col mob__col-gap pagination padding-around-global">
            <span className="button-lookalike">Showing 10 rows per page</span>
            <div className="align-center">
              <span className="button-lookalike">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <span
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1),
                  }))
                }
                className={
                  (pagination.page === 1 || disabled ? 'disabled' : '') +
                  ' previous-pagination'
                }
              >
                <PaginationArrow />
              </span>

              <span
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    page: Math.min(prev.page + 1, pagination.totalPages),
                  }))
                }
                className={
                  pagination.page === pagination.totalPages || disabled
                    ? 'disabled'
                    : ''
                }
              >
                <PaginationArrow />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;
