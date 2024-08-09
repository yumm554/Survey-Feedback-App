'use client';

import { Hamburger, NavArrow, Settings } from '@/assets/icons/getIcon';
import { User } from '../assets/icons/getIcon';
import Link from 'next/link';
import Logo from './Logo';

const Header = ({ data }: any) => {
  const { user, mobNav, setMobNav, isLoading, sidebar, isAdmin } = data;

  return (
    <>
      <header className="header__white space-between padding-around-global">
        <>
          <div
            className="mob__hamburger desktop-hide pointer"
            onClick={() => setMobNav(!mobNav)}
            aria-label="mob nav toggle"
          >
            <Hamburger />
          </div>
          {sidebar && (
            <Link
              href="/userfeedback"
              className="no-underline align-center mob-hide tab-hide"
            >
              <span className="black-regular">Open the survey</span>{' '}
              <NavArrow />
            </Link>
          )}
          {!sidebar && (
            <div className="mob-hide tab-hide">
              <Logo />
            </div>
          )}
        </>

        <div className="align-center">
          {!sidebar &&
            (isLoading ? (
              <div
                className="text-loader"
                aria-label="header item loader"
              ></div>
            ) : isAdmin ? (
              <Link
                href="/feedbacklist"
                className="no-underline align-center mob-hide tab-hide"
              >
                <span className="black-regular">Dashboard</span> <NavArrow />
              </Link>
            ) : (
              <Link
                href="/settings"
                className="no-underline align-center mob-hide tab-hide"
              >
                <span className="black-regular">Settings</span> <NavArrow />
              </Link>
            ))}

          <div className="align-center">
            <div className="user-border">
              <User />
            </div>
            <div className="loader-used">
              {isLoading ? (
                <div
                  className="text-loader"
                  aria-label="header item loader"
                ></div>
              ) : (
                <p>{user.username || `couldn't fetch`}</p>
              )}
              {isLoading ? (
                <div
                  className="text-loader"
                  aria-label="header item loader"
                ></div>
              ) : (
                <span className="grey-medium text-09x1">
                  {isAdmin ? 'Admin' : 'User'}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
