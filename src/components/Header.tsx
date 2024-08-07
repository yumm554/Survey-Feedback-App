'use client';

import { Hamburger, NavArrow, Settings } from '@/assets/icons/getIcon';
import { User } from '../assets/icons/getIcon';
import Image from 'next/image';
import Link from 'next/link';

const Header = ({ data }: any) => {
  const { user, mobNav, setMobNav, isLoading, sidebar } = data;

  return (
    <>
      <header className="header__white space-between padding-around-global">
        <>
          <div
            className="mob__hamburger desktop-hide"
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
            <>
              <Image
                className="PS-logo mob-hide tab-hide"
                src="/PS-logo.png"
                alt="PS logo"
                width="70"
                height="70"
              />
            </>
          )}
        </>

        <div className="align-center">
          {!sidebar && (
            <Link
              href="/settings"
              className="no-underline align-center mob-hide tab-hide"
            >
              <span className="black-regular">Settings</span> <NavArrow />
            </Link>
          )}
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
                  {user.role === 0 ? 'User' : 'Admin'}
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
