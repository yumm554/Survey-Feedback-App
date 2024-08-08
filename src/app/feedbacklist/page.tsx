'use client';
import {
  FeedbackSubmission,
  Overview,
  PaginationArrow,
  RatingStar,
} from '@/assets/icons/getIcon';
import './feedbackList.css';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import RectangularBoxes from '@/components/RectangularBoxes';
import GetUserDetails from '@/handlers/me';
import useFetchFeedbacks from '@/handlers/feedbacks';
import { useDebounceRetry } from '@/utils/debounceRetry';
import ErrorFetchingUser from '@/components/ErrorFetchingUser';

const FeedbackList: React.FC = () => {
  const [mobNav, setMobNav] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  //me call
  const { user, isAdmin, isLoading, isError, retry } = GetUserDetails();

  //fetch feedback
  const {
    feedbacks,
    pagination,
    isFeedbackLoading,
    isFeedbackError,
    retry: retryFeedbacks,
  } = useFetchFeedbacks(page, limit);

  //retry calls on internet back connection
  useDebounceRetry(retry, retryFeedbacks);

  return (
    <>
      {isError ? (
        <ErrorFetchingUser
          retryCalls={{ retry, retrySpecificty: retryFeedbacks }}
        ></ErrorFetchingUser>
      ) : (
        <div className="col__flex">
          <Sidebar
            data={{
              user,
              mobNav,
              setMobNav,
              isLoading,
              active: 'list',
              sidebar: true,
              isAdmin,
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
            <div className="form__white dashboard-col margin-around-global row-gap row-gap_20 padding-around-global">
              <div className="align-center overview__heading">
                <Overview />
                <h1 className="text-1x1 black-regular">Overview</h1>
              </div>
              <div className="align-bottom">
                <div className="row-gap row-gap row-gap_10 loader-used">
                  {isFeedbackLoading ? (
                    <div className="text-loader"></div>
                  ) : (
                    <h3 className="text-23x1 black-medium">
                      S-{pagination.totalFeedbacks}
                    </h3>
                  )}
                  {isFeedbackLoading ? (
                    <div className="text-loader"></div>
                  ) : (
                    <p>
                      Over {pagination.totalFeedbacks} response
                      {pagination.totalFeedbacks > 1 ? 's' : ''} have been
                      collected from users.
                    </p>
                  )}
                </div>
                <RectangularBoxes
                  colors={{
                    normal: 'green',
                    lighter: 'lighter-green',
                    light: 'light-green',
                  }}
                />
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
                    <th className="align-right">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {isFeedbackError ? (
                    <tr className="no-background">
                      <td className="error text-09x1">{isFeedbackError}</td>
                    </tr>
                  ) : isFeedbackLoading ? (
                    <tr className="no-background">
                      <td>loading...</td>
                    </tr>
                  ) : feedbacks.length ? (
                    feedbacks.map((feedback) => (
                      <tr key={feedback._id}>
                        <td className="collapsed-cell">{feedback.name}</td>
                        <td className="collapsed-cell">{feedback.email}</td>
                        <td className="rating-cell align-right">
                          <div className="rating-box-light light-green">
                            <RatingStar />
                            <b className="rating-col">{feedback.rating}</b>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="no-background">
                      <td>There are no feedbacks to list</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="space-between mob__col mob__col-gap pagination padding-around-global">
                <span className="button-lookalike">Show 10 rows per page</span>
                <div className="align-center">
                  <span className="button-lookalike">
                    Page {pagination.page} of {pagination.totalPages || 1}
                  </span>
                  <span
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                    className={
                      (pagination.page === 1 || isFeedbackLoading
                        ? 'disabled'
                        : '') + ' previous-pagination'
                    }
                    aria-label="prev button"
                  >
                    <PaginationArrow />
                  </span>

                  <span
                    onClick={() =>
                      setPage((prev) =>
                        Math.min(prev + 1, pagination.totalPages)
                      )
                    }
                    className={
                      pagination.page >= pagination.totalPages ||
                      isFeedbackLoading
                        ? 'disabled'
                        : ''
                    }
                    aria-label="next button"
                  >
                    <PaginationArrow />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackList;
