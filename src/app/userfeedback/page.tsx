'use client';

import { useState } from 'react';
import './userFeedback.css';
import {
  SubmitFeedback,
  Dashboard,
  FeedbackFormBack,
  RatingStar,
} from '@/assets/icons/getIcon';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import GetUserDetails from '@/handlers/me';
import useFeedbackForm from '@/handlers/feedbackForm';

interface Feedback {
  name: string;
  email: string;
  rating: number;
  comments: string;
}

const UserFeedback = () => {
  const [mobNav, setMobNav] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<Feedback>({
    name: '',
    email: '',
    rating: 3,
    comments: '',
  });
  const handleRatingClick = (rating: number) => {
    setFeedback({ ...feedback, rating });
  };

  //me call
  const { user, isAdmin, isLoading } = GetUserDetails();

  //form submit
  const {
    isFeedbackFormLoading,
    isFeedbackFormError,
    isFeedbackFormSuccess,
    onSubmit,
    disable,
  } = useFeedbackForm();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedFeedback = { ...feedback, email: user.email };
    console.log(updatedFeedback);
    onSubmit(updatedFeedback, setFeedback);
  };

  return (
    <div>
      <Sidebar
        data={{
          user,
          mobNav,
          setMobNav,
          isLoading,
          active: 'feedback',
          sidebar: false,
          isAdmin,
        }}
      />
      <Header
        data={{
          user,
          mobNav,
          setMobNav,
          isLoading,
          sidebar: false,
        }}
      />
      <div className="col__flex tab__col padding-around-global feedback_wrapper align-center mob__col mob__col-gap">
        <div className="full-width side-width-feedback full-width">
          <h3 className="tab-text-align text-23x1 black-medium">
            Submit the Survey Feedback Form
          </h3>
        </div>
        <div className="justify-top main__wrapper feedback relative">
          <div className="absolute-back-container">
            <FeedbackFormBack />
          </div>
          <div className="form__white row-gap row-gap_20 padding-around-global">
            <div className="align-center signup__heading">
              <Dashboard />
              <h1 className="text-1x1 black-regular">
                We Value Your Opinion - Fill Out Our Feedback Form
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="row-gap row-gap_20">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                value={feedback.name}
                placeholder="Full Name"
                required
                onChange={(e) =>
                  setFeedback({ ...feedback, name: e.target.value })
                }
              />

              {isLoading ? (
                <div className="input-loader">
                  <div className="text-loader"></div>
                </div>
              ) : (
                <>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="text"
                    pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                    disabled
                    value={user.email}
                    placeholder="Email"
                    required
                  />
                </>
              )}

              <label>Rating:</label>
              <div className="align-center rating_wrapper">
                <div
                  className={`rating-box align-center green ${
                    feedback.rating === 5 ? 'active' : ''
                  }`}
                  onClick={() => handleRatingClick(5)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">5</span>
                </div>

                <div
                  className={`rating-box align-center rate-lighter-green ${
                    feedback.rating === 4 ? 'active' : ''
                  }`}
                  onClick={() => handleRatingClick(4)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">4</span>
                </div>

                <div
                  className={`rating-box align-center rate-light-green ${
                    feedback.rating === 3 ? 'active' : ''
                  }`}
                  onClick={() => handleRatingClick(3)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">3</span>
                </div>

                <div
                  className={`rating-box align-center rate-lightest-green ${
                    feedback.rating === 2 ? 'active' : ''
                  }`}
                  onClick={() => handleRatingClick(2)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">2</span>
                </div>

                <div
                  className={`rating-box align-center highlight ${
                    feedback.rating === 1 ? 'active' : ''
                  }`}
                  onClick={() => handleRatingClick(1)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">1</span>
                </div>
              </div>

              <label htmlFor="comments">Comments</label>
              <textarea
                id="comments"
                rows={6}
                value={feedback.comments}
                placeholder="Comments"
                required
                onChange={(e) =>
                  setFeedback({ ...feedback, comments: e.target.value })
                }
              />
              {isFeedbackFormLoading ? (
                <button className="align-center text-1x1" disabled={disable}>
                  <span className="black-regular">Submitting Feedback</span>{' '}
                  <i className="loader"></i>
                </button>
              ) : (
                <button className="align-center text-1x1">
                  <span className="black-regular">Submit Feedback</span>{' '}
                  <SubmitFeedback />
                </button>
              )}
            </form>
            {isFeedbackFormError && (
              <p className="error text-09x1">{isFeedbackFormError}</p>
            )}
            {isFeedbackFormSuccess && (
              <p className="success text-09x1">{isFeedbackFormSuccess}</p>
            )}
          </div>
        </div>
        <div className="side-width-feedback full-width">
          <ul className="bullet_list_items row-gap row-gap_20 smaller-row-gap">
            <li className="align-center">
              <div className="bullet red"></div>
              <p>Your Voice Matters</p>
            </li>
            <li className="align-center">
              <div className="bullet lighter-red"></div>
              <p>Real Impact</p>
            </li>
            <li className="align-center">
              <div className="bullet light-red"></div>
              <p>Easy Participation</p>
            </li>
            <li className="align-center">
              <div className="bullet highlight"></div>
              <p>Personalized Experience</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserFeedback;
