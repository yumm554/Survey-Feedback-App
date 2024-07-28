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
import Link from 'next/link';
import Image from 'next/image';
import './feedbackList.css';
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

const FeedbackList: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalFeedbacks: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [mobNav, setMobNav] = useState<boolean>(true);

  useEffect(() => {
    setMobNav(!(window.innerWidth <= 1024));
    const handleResize = () => {
      setMobNav(!(window.innerWidth <= 1024));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/users/feedbacks?page=${pagination.page}&limit=${pagination.limit}`
        );
        const data = await res.json();
        setFeedbacks(data.feedbacks);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
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

          <aside className="relative side-width padding-around-global feedback-sidebar">
            <header>
              <Image
                className="PS-logo"
                src={require('../../assets/images/PS-logo.png')}
                alt="PS logo"
              />
            </header>
            <main>
              <nav>
                <ul className="bullet_list_items row-gap_30">
                  <li className="align-center">
                    <Dashboard />
                    <p>Dasboard</p>
                  </li>
                  <li className="align-center">
                    <FeedbackSubmission />
                    <p>Feedback Submissions</p>
                  </li>
                  <li className="align-center">
                    <Reports />
                    <p>Reports</p>
                  </li>
                  <li className="align-center">
                    <Settings />
                    <p>Settings</p>
                  </li>
                  <li className="align-center">
                    <Logout />
                    <p>Logout</p>
                  </li>
                  <li className="desktop-hide">
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
              <div>
                <p>Username</p>
                <span className="grey-medium text-09x1">Admin</span>
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
            <div className="row-gap row-gap row-gap_10">
              <h3 className="text-23x1 black-medium">S-2100</h3>
              <p>Over 2,100 responses have been collected from users.</p>
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

          <table className="margin-around-global">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr className="no-background">
                  <td>Loading...</td>
                </tr>
              ) : (
                feedbacks.map((feedback) => (
                  <tr key={feedback._id}>
                    <td>{feedback.username}</td>
                    <td>{feedback.email}</td>
                    <td>
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
                  (pagination.page === 1 ? 'disabled' : '') +
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
                  pagination.page === pagination.totalPages ? 'disabled' : ''
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
