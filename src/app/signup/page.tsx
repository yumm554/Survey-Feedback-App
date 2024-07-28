'use client';

import axios from 'axios';
import Link from 'next/link';
import './signup.css';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FeedbackSubmission, SignIn } from '../../assets/icons/getIcon';

const SignUp = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: '',
    email: '',
    role: 0,
    password: '',
    password_confirmation: '',
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

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

  const onSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(`/api/users/signup`, user);
      console.log('Signup success', response.data);
      toast.success('Successfully Signed Up');
      router.push('/login');
    } catch (error: any) {
      console.log('Signup failed', error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="col__flex max-height mob__col">
      <header className="padding-around-global desktop-hide tab-hide">
        <Image
          className="PS-logo desktop-hide"
          src={require('../../assets/images/PS-logo.png')}
          alt="PS logo"
        />
      </header>
      <aside className="padding-around-global side-width mob-hide">
        <header>
          <Image
            className="PS-logo"
            src={require('../../assets/images/PS-logo.png')}
            alt="PS logo"
          />
        </header>
        <main className="row-gap row-gap_20 main__wrapper mob-hide padding-fixer-top padding-fixer-bottom">
          <ul className="bullet_list_items row-gap row-gap_20">
            <li className="align-center">
              <div className="bullet purple"></div>
              <p>Your Voice Matters</p>
            </li>
            <li className="align-center">
              <div className="bullet lighter-purple"></div>
              <p>Real Impact</p>
            </li>
            <li className="align-center">
              <div className="bullet light-purple"></div>
              <p>Easy Participation</p>
            </li>
            <li className="align-center">
              <div className="bullet highlight"></div>
              <p>Personalized Experience</p>
            </li>
          </ul>
          <div className="row-gap row-gap row-gap_10">
            <h3 className="text-23x1 black-medium">S-2100</h3>
            <p>Over 2,100 responses have been collected from users.</p>
          </div>
        </main>
      </aside>
      <div className="flex__1 main__wrapper padding-around-global scrollable padding-fixer-top padding-fixer-bottom">
        <div className="form__white row-gap row-gap_20 padding-around-global">
          <div className="align-center signup__heading">
            <FeedbackSubmission />
            <h1 className="text-1x1 black-regular">
              Signup to share your thoughts
            </h1>
          </div>
          <div className="boxes align-center">
            <div className="rectangular-box purple"></div>
            <div className="rectangular-box lighter-purple"></div>
            <div className="rectangular-box light-purple"></div>
            <div className="rectangular-box highlight"></div>
          </div>
          <label htmlFor="username">Username</label>
          <input
            className=""
            id="username"
            type="text"
            value={user.username}
            placeholder="Username"
            onChange={(e) => setUser({ ...user, username: e.target.value })}
          />

          <label htmlFor="email">Email</label>
          <input
            className=""
            id="email"
            type="text"
            value={user.email}
            placeholder="Email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
          {/* <label htmlFor="role">Role</label>
      <input
        className=""
        id="role"
        type="text"
        value={user.role}
        placeholder="role"
        onChange={(e) => setUser({ ...user, role: e.target.value })}
      /> */}

          <label>Role:</label>
          <div className="align-center">
            <input
              type="checkbox"
              value={0}
              checked={user.role === 0}
              onChange={() => setUser({ ...user, role: 0 })}
            />
            <label className="no-hide">User</label>

            <input
              type="checkbox"
              value={1}
              checked={user.role === 1}
              onChange={() => setUser({ ...user, role: 1 })}
            />
            <label className="no-hide">Admin</label>
          </div>

          <label htmlFor="password">Password</label>
          <input
            className=""
            id="password"
            type="password"
            value={user.password}
            placeholder="Password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />

          <label htmlFor="password">Confirm Password</label>
          <input
            className=""
            id="password_confirmation"
            type="password"
            value={user.password_confirmation}
            placeholder="Confirm Password"
            onChange={(e) =>
              setUser({ ...user, password_confirmation: e.target.value })
            }
          />

          <button
            className="align-center text-1x1"
            onClick={onSignUp}
            disabled={buttonDisabled}
          >
            <span className="black-regular">Signup</span> <SignIn />
          </button>

          <p className="align-center text-09x1 centralize">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="p-2  mb-4 focus:outline-none focus:border-gray-600 text-gray-500"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
