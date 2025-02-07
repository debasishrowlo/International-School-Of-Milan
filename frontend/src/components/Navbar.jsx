import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose, IoMenu } from 'react-icons/io5';
import classnames from "classnames"

import Avatar from './Avatar/Avatar';

import { useLogoutUserMutation } from '../redux/features/auth/authapi';
import { logout } from '../redux/features/auth/authSlice';
import { clearUserData } from "../common"
import { navbarActivities } from "@/constants"

import { createActivitiesRoute } from "@/router"

const navLists = [
  { name: 'Home', path: '/' },
  { name: 'News', path: '/news' },
  { name: 'Announcements', path: '/announcements' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [prevScrollPos, setPrevScrollPos] = useState(window.pageYOffset);
  const [visible, setVisible] = useState(true);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const dispatch = useDispatch();
  const [logoutUserMutation] = useLogoutUserMutation()

  const handleLogout = async () => {
    try {
      await logoutUserMutation().unwrap();
      clearUserData()
      dispatch(logout());
    } catch (error) {
      console.error(error)
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prevScrollPos, visible]);

  return (
    <header className={classnames("bg-white py-24 shadow-md sticky z-10 top-0 transition-all duration-300", {
      "translate-y-0 opacity-full": visible,
      "-translate-y-full opacity-0": !visible,
    })}>
      <nav className='container mx-auto flex justify-between items-center px-20'>
        <a href="/" className='flex items-center gap-8'>
          <img
            src="/logo3.jpg"
            alt="Logo"
            className="h-48"
          />
          <span className='text-24 font-semibold text-gray-800'></span>
        </a>

        <ul className='hidden sm:flex items-center gap-40'>
          {navLists.map((list, index) => (
            <li key={index}>
              <NavLink
                to={`${list.path}`}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-4 font-medium'
                    : 'text-gray-600 hover:text-blue-600 transition-all'
                }
              >
                {list.name}
              </NavLink>
            </li>
          ))}
          <li ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="inline-block relative text-gray-600 hover:text-blue-600 transition-all"
            >
              Activities
              {isOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 translate-y-10 w-160 bg-gray-50 shadow-lg">
                  {navbarActivities.map((activity, index) => (
                    <NavLink
                      key={index}
                      to={createActivitiesRoute(activity.type)}
                      className='block px-16 py-12 hover:bg-gray-200 text-gray-600 hover:text-blue-600 transition-all'
                    >
                      {activity.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </button>
          </li>

          {user ? (
            <li className='flex items-center gap-3'>
              <button
                onClick={handleLogout}
                className='text-gray-600 hover:text-blue-600 transition-all font-medium'>Logout</button>
            </li>
          ) : (
            <li>
              <NavLink
                to='/login'
                className='text-gray-600 hover:text-blue-600 transition-all font-medium'>
                Login
              </NavLink>
            </li>
          )}

          {(user && (user.role === "admin" || user.role === "moderator" || user.role === 'creator')) && (
            <li className='flex items-center gap-3'>
              <Link to="/dashboard"><button className='bg-[#1E73BE] px-16 py-6 text-white rounded-sm'>Dashboard</button></Link>
            </li>
          )}
          {user && (
            <li>
              <Avatar username={user.username} />
            </li>
          )}
        </ul>

        <div className='flex items-center sm:hidden'>
          <button
            onClick={toggleMenu}
            className='flex items-center p-12 bg-gray-100 rounded-full shadow-md text-gray-700 hover:bg-gray-200 transition'
          >
            {isMenuOpen ? <IoClose className='size-24' /> : <IoMenu className='size-24' />}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <ul className='fixed z-10 top-88 left-0 w-full h-auto pb-32 bg-white shadow-lg rounded-b-lg'>
          {navLists.map((list, index) => (
            <li className='mt-20 px-24' key={index}>
              <NavLink
                onClick={() => setIsMenuOpen(false)}
                to={`${list.path}`}
                className={({ isActive }) =>
                  isActive
                    ? 'text-blue-600 border-b-2 border-blue-600 pb-4 font-medium'
                    : 'text-gray-600 hover:text-blue-600 transition-all'
                }
              >
                {list.name}
              </NavLink>
            </li>
          ))}
          <li className='px-24 mt-20'>
            <NavLink
              to='/login'
              onClick={() => setIsMenuOpen(false)}
              className='text-gray-600 hover:text-blue-600 transition-all font-medium'
            >
              Login
            </NavLink>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;
