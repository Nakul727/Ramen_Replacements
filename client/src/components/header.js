import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo_img from '../assets/logo.png';
import { useAuth } from '../AuthContext.js';
import { getUserInfo } from './UserInfo';
import { useNavigate } from 'react-router-dom';

const buttonStyles = "block mr-2 py-3 px-4 text-gray-900 rounded-xl hover:bg-gray-100 md-hover-bg-transparent transition-all duration-200 ease-in-out";

const Header = () => {
  const { isLoggedIn, logout } = useAuth();
  const userInfo = getUserInfo();

  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div>
      <nav className="bg-white font-arvo fixed w-full z-20 top-0 left-0 drop-shadow-lg">
        <div className="flex flex-wrap items-center justify-between p-4">

          {/* Left Part */}
          <div className="flex items-center justify-between ml-4">
            <Link to="/">
              <img src={logo_img} className="h-12 mr-6" />
            </Link>
            <span className="self-center text-2xl font-arvo_bold whitespace-nowrap">Ramen_Replacements</span>
          </div>

          {/* Right Header */}
          <div className="flex items-center justify-between font-medium">
            <Link to="/">
              <button className={buttonStyles}>Home</button>
            </Link>
            <Link to="/explore">
              <button className={buttonStyles}>Explore</button>
            </Link>

            {isLoggedIn ? (
              <div className='flex items-center justify-between font-medium'>
                <Link to="/recipemaker">
                  <button className={buttonStyles}>Create Recipe</button>
                </Link>

                <div className="relative">
                  <button className={`${buttonStyles} flex items-center justify-between`} onClick={toggleDropdown}>
                    <img src={userInfo.pfp} alt="User Profile Picture" className="w-8 h-8 rounded-full border" />
                    <svg className="w-2.5 h-2.5 ml-2.5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 10 6">
                      <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d={showDropdown ? "M9 1L5 5 1 1" : "M1 1L5 5 9 1"} />
                    </svg>
                  </button>

                  {showDropdown && (
                    <div className="absolute bg-white border border-gray-300 rounded-lg translate-x-[-35px]">
                      <Link to="/dashboard">
                        <button className="py-3 px-4 w-full text-gray-900 hover:bg-gray-100 md-hover-bg-transparent transition-all duration-200 ease-in-out">Dashboard</button>
                      </Link>
                      <button className="py-3 px-4 w-full text-gray-900 hover:bg-gray-100 md-hover-bg-transparent transition-all duration-200 ease-in-out"
                        onClick={handleLogout}>Logout</button>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between font-medium">
                <Link to="/login">
                  <button className={buttonStyles}>Log In</button>
                </Link>
                <Link to="/register">
                  <button className={buttonStyles}>Get Started</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export { Header };
