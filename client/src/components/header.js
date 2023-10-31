import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext.js";
import { getUserInfo } from './UserInfo.js';
import logo_img from '../assets/logo.png';


// Left component of the header 
// Logo and Name
const LeftHeader = () => {
  return (
    <div className="flex items-center">
      <Link to="/">
        <img src={logo_img} className="h-14 w-auto mx-1 sm:mx-4" alt="Logo" />
      </Link>
      <h1 className="text-md sm:text-xl md:text-2xl">Ramen_Replacements</h1>
    </div>
  );
};

// Right component of the header
// Dynamic based on user logged in state
const RightHeader = () => {
  const { isLoggedIn, logout } = useAuth();
  const userInfo = getUserInfo();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex items-center">
      <Link to="/explore" className="text-sm sm:text-lg md:text-xl mr-8">
        Explore
      </Link>

      {isLoggedIn ? (
        <div className="flex items-center">
          <button onClick={handleLogout} className="text-sm sm:text-lg md:text-xl mr-8">
            Logout
          </button>

          <Link to="/dashboard" className="h-10 w-10 rounded-full mr-8">
            <img src={userInfo.pfp} alt="Profile" />
          </Link>
        </div>
      ) : (
        <Link to="/login" className="text-sm sm:text-lg md:text-xl mr-8">
          Login
        </Link>
      )}
    </div>
  );
};

const Header = () => {
  return (
    <header className="fixed top-0 w-full bg-slate-100 z-10">
      <div className="flex items-center justify-between p-4 flex-wrap">
        <LeftHeader />
        <RightHeader />
      </div>
    </header>
  );
};

export { Header };