import React from 'react';
import { Link } from 'react-router-dom';
import logo_img from '../assets/logo.png';

// Separate Header components for logged in and not logged in users
const LoggedInHeader = ({ userInfo, handleLogout }) => (
  <div>
    {userInfo && userInfo.profilePicture && (
      <img
        src={userInfo.profilePicture}
        alt="Profile"
        className="h-10 w-10 rounded-full mr-4"
      />
    )}
    <button onClick={handleLogout} className="text-blue-700">
      Logout
    </button>
  </div>
);

const NotLoggedInHeader = () => (
  <div>
    {/* Additional elements or links for not logged in users */}
    <Link to="/login">Login</Link>
  </div>
);

const Header = ({ leftChildren, rightChildren }) => {
  return (
    <header className="fixed top-0 w-full bg-slate-100 z-10">
      <div className="flex items-left sm:items-center justify-between p-4">
        <div className="flex items-center sm:mx-5 sm:mb-0">
          {leftChildren}
        </div>
        <div className="flex items-center justify-end">
          {rightChildren}
        </div>
      </div>
    </header>
  );
};

const Logo_Name = () => {
  return (
    <div className="flex items-center">
      <Link to="/">
        <img src={logo_img} className="h-14 w-auto mx-1 sm:mx-4" alt="Logo" />
      </Link>
      <h1 className="text-md sm:text-xl md:text-2xl">Ramen_Replacements</h1>
    </div>
  );
};

const Links = ({ linkData }) => {
  return (
    <div>
      {linkData.map((link, index) => (
        <div
          className="w-16 sm:w-20 md:w-24 mr-2 sm:mr-4 float-right text-center h-9 sm:h-12 bg-slate-200 pt-1 sm:pt-2"
          key={index}
        >
          <Link to={link.to} className="text-sm sm:text-lg md:text-xl">
            {link.text}
          </Link>
        </div>
      ))}
    </div>
  );
};

export { Header, Logo_Name, Links, LoggedInHeader, NotLoggedInHeader };
