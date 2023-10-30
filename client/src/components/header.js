import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from "../AuthContext.js";
import handleLogout from '../components/LogoutHandler.js';

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

  const { isLoggedIn } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  // userinfo is the username, pfp, userID from the JWT

  useEffect(() => {
    if (isLoggedIn) {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        const tokenParts = jwt.split('.');
        if (tokenParts.length === 3) {
          try {
            const payload = JSON.parse(atob(tokenParts[1]));
            setUserInfo(payload);
          } catch (error) {
            console.error('Failed to decode JWT token:', error);
          }
        }
      }
    }
  }, [isLoggedIn]);

  console.log(userInfo)
  console.log(isLoggedIn)


  return (
    <div className="flex item-center">

      <Link to="/explore" className="text-sm sm:text-lg md:text-xl mr-8">
        Explore
      </Link>


      {isLoggedIn ? (
        // to do add dropdown and logout
        <div className="flex items-center sm:ml-4">
          {/* <Link to="/dashboard" className="h-10 w-10 rounded-full mr-2">
            <img src={userInfo.pfp} alt="Profile"/>
          </Link> */}
        </div>
      ) 
      : // if the user is not logged in
      (
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