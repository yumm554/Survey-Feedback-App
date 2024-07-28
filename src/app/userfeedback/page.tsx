'use client';

import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import './userFeedback.css';
import {
  SubmitFeedback,
  Dashboard,
  NavArrow,
  User,
  FeedbackFormBack,
  RatingStar,
} from '@/assets/icons/getIcon';

const UserFeedback = () => {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    username: '',
    email: '',
    rating: 3,
    comments: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const handleRatingClick = (rating: number) => {
    setFeedback({ ...feedback, rating });
    console.log(feedback.rating);
  };
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/users/me`);
        setFeedback({
          ...feedback,
          username: response.data?.user.username,
          email: response.data?.user.email,
        });
      } catch (error: any) {
        console.log('Get user details failed', error.message);
      } finally {
        setLoading(false);
      }
    };
    getUserDetails();
  }, []);

  useEffect(() => {
    if (
      feedback.username &&
      feedback.email &&
      feedback.rating &&
      feedback.comments
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [feedback]);

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/userfeedback`, feedback);
      console.log('Submission success', response.data);
      toast.success('Successfully Submitted');
    } catch (error: any) {
      console.log('Submission failed', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="space-between padding-around-global">
        <Image
          className="PS-logo"
          src={require('../../assets/images/PS-logo.png')}
          alt="PS logo"
        />
        {feedback.username ? (
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
        ) : (
          <Link href="/login" className="no-underline align-center">
            <span className="black-regular">Login</span> <NavArrow />
          </Link>
        )}
      </header>
      <div className="col__flex tab__col padding-around-global align-center mob__col mob__col-gap padding-fixer-bottom">
        <div className="side-width full-width">
          <h3 className="tab-text-align text-23x1 black-medium">
            Submit the Survey Feedback Form
          </h3>
        </div>
        <div className="justify-top flex__1 main__wrapper feedback relative">
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

            <label htmlFor="username">Username</label>
            <input
              className=""
              id="username"
              type="text"
              disabled
              value={feedback.username}
              placeholder="Username"
              onChange={(e) =>
                setFeedback({ ...feedback, username: e.target.value })
              }
            />

            <label htmlFor="email">Email</label>
            <input
              className=""
              id="email"
              type="text"
              disabled
              value={feedback.email}
              placeholder="Email"
              onChange={(e) =>
                setFeedback({ ...feedback, email: e.target.value })
              }
            />

            <label>Rating:</label>
            <div className="align-center rating_wrapper">
              <div className="rating relative">
                <input
                  type="checkbox"
                  value={5}
                  checked={feedback.rating === 5}
                />
                <div
                  className="rating-box align-center green"
                  onClick={() => handleRatingClick(5)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">5</span>
                </div>
              </div>

              <div className="rating relative">
                <input
                  type="checkbox"
                  value={4}
                  checked={feedback.rating === 4}
                />
                <div
                  className="rating-box align-center rate-lighter-green"
                  onClick={() => handleRatingClick(4)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">4</span>
                </div>
              </div>

              <div className="rating relative">
                <input
                  type="checkbox"
                  value={3}
                  checked={feedback.rating === 3}
                />
                <div
                  className="rating-box align-center rate-light-green"
                  onClick={() => handleRatingClick(3)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">3</span>
                </div>
              </div>

              <div className="rating relative">
                <input
                  type="checkbox"
                  value={2}
                  checked={feedback.rating === 2}
                />
                <div
                  className="rating-box align-center rate-lightest-green"
                  onClick={() => handleRatingClick(2)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">2</span>
                </div>
              </div>

              <div className="rating relative">
                <input
                  type="checkbox"
                  value={1}
                  checked={feedback.rating === 1}
                />
                <div
                  className="rating-box align-center highlight"
                  onClick={() => handleRatingClick(1)}
                >
                  <RatingStar />
                  <span className="black-regular text-12x1">1</span>
                </div>
              </div>
            </div>

            <label htmlFor="password">Comments</label>
            <textarea
              className=""
              id="comments"
              rows={6}
              value={feedback.comments}
              placeholder="Comments"
              onChange={(e) =>
                setFeedback({ ...feedback, comments: e.target.value })
              }
            />
            <button
              className="align-center text-1x1"
              onClick={onSubmit}
              disabled={buttonDisabled}
            >
              <span className="black-regular">Submit Feedback</span>{' '}
              <SubmitFeedback />
            </button>
          </div>
        </div>
        <div className="side-width full-width">
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
