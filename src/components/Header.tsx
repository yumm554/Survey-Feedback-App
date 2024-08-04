import { Hamburger, NavArrow, Settings } from '@/assets/icons/getIcon';
import { User } from '../assets/icons/getIcon';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const Header = ({ data }: any) => {
  const { user, mobNav, setMobNav, isLoading, sidebar } = data;

  const [nav, setNav] = useState<boolean>(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest('.hamburger')) {
        setNav(false);
      }
    };

    window.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="header__white space-between padding-around-global">
        <>
          <div
            className="mob__hamburger desktop-hide"
            onClick={() => setMobNav(!mobNav)}
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
                <div className="text-loader"></div>
              ) : (
                <p>{user.username || 'Username'}</p>
              )}
              {isLoading ? (
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
    </>
  );
};

export default Header;
