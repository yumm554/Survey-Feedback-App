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
  Settings,
} from '@/assets/icons/getIcon';
import { useRouter } from 'next/navigation';

interface Feedback {
  username: string;
  email: string;
  role: number;
  rating: number;
  comments: string;
}

const UserFeedback = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();
  const [nav, setNav] = useState<boolean>(false);

  const [feedback, setFeedback] = useState<Feedback>({
    username: '',
    email: '',
    role: 1,
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
        setLoading(true)
        const response = await axios.get(`/api/users/me`);
        console.log(response);
        setFeedback({
          ...feedback,
          username: response.data?.user.username,
          email: response.data?.user.email,
          role: response.data?.user.role,
        });
      } catch (error: any) {
        console.log('Get user details failed', error.message);
      }
      finally{
        setLoading(false)
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setSuccess('');
      setError('');
      setLoading(true);
      const response = await axios.post(`/api/users/userfeedback`, feedback);
      console.log('Submission success', response.data);
      toast.success('Successfully Submitted');
      setSuccess(response.data?.message);
      setFeedback({ ...feedback, comments: '', rating: 3 });
    } catch (error: any) {
      console.log('Submission failed', error.message);
      toast.error('An error occurred');
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();
  const logout = async () => {
    try {
      await axios.get(`/api/users/logout`);
      toast.success('Successfully Logged Out');
      router.push('/login');
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
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
        {loading?<div className="loader-used">
                <div className="text-loader"></div>
                <div className="text-loader"></div>
                </div>
            :feedback.username ? (
          <div className="relative pointer">
            <div className="align-center" onClick={() => setNav(!nav)}>
              <div className="user-border">
                <User />
              </div>
              <div>
                <p>{feedback.username || 'Username'}</p>
                <span className="grey-medium text-09x1">
                  {feedback.role === 0 ? 'User' : 'Admin'}
                </span>
              </div>
            </div>
            {nav && (
              <div className="popup padding-around-global row-gap row-gap_20">
                <Link
                  className="align-center pointer no-underline"
                  href="/settings"
                >
                  <Settings />
                  <span className="black-regular">Settings</span>
                </Link>
                <div className="hr"></div>
                <div className="align-center pointer" onClick={logout}>
                  <span className="black-regular">Logout</span> <NavArrow />
                </div>
              </div>
            )}
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
            <form onSubmit={onSubmit} className="row-gap row-gap_20">
            {loading?<div className='input-loader' ><div className='text-loader' ></div></div>:
              <>
              <label htmlFor="username">Username</label>
              <input
                className=""
                id="username"
                type="text"
                disabled
                value={'' + feedback.username}
                placeholder="Username"
                required
              /></>}
              
              {loading?<div className='input-loader' ><div className='text-loader' ></div></div>:
<>
              <label htmlFor="email">Email</label>
              <input
                className=""
                id="email"
                type="text"
                disabled
                value={'' + feedback.email}
                placeholder="Email"
                required
              />
              </>}

              <label>Rating:</label>
              <div className="align-center rating_wrapper">
                <div
                  className={`rating-box align-center lighter-green ${
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
                className=""
                id="comments"
                rows={6}
                value={feedback.comments}
                placeholder="Comments"
                required
                onChange={(e) =>
                  setFeedback({ ...feedback, comments: e.target.value })
                }
              />
              {loading ? (
                <button
                  className="align-center text-1x1"
                  disabled={buttonDisabled}
                >
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
            {error && <p className="error text-09x1">{error}</p>}
            {success && <p className="success text-09x1">{success}</p>}
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
