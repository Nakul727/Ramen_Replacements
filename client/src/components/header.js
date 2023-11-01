import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../AuthContext.js";
import { getUserInfo } from './UserInfo.js';
import logo_img from '../assets/logo.png';


const Header = () => {

  const { isLoggedIn, logout } = useAuth();
  const userInfo = getUserInfo();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>

      <nav className="bg-white fixed w-full z-20 top-0 left-0 border-b border-gray-200">
        <div className="flex flex-wrap items-center justify-between p-4">

          {/* Left Part */}
          <div className="flex items-center justify-between ml-4">
            <Link to="/">
              <img src={logo_img} className="h-8 mr-4" />
            </Link>
            <span className="self-center text-2xl font-semibold whitespace-nowrap">Ramen_Replacements</span>
          </div>


          {/* Right Header */}

          <div className="flex items-center justify-between mr-4">
            <div className="flex items-center justify-between py-2 font-medium">
              <Link to="/">
                <p className="block mx-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent md-hover-text-blue-700 md-p-0">Home</p>
              </Link>
              <Link to="/explore">
                <p className="block mx-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent md-hover-text-blue-700 md-p-0">Explore</p>
              </Link>

              {isLoggedIn ? (
              <div className='flex'>
              <Link to="/recipebuilder">
               <p className="block mx-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent md-hover-text-blue-700 md-p-0">Create Recipe</p>
              </Link>
              <p className="block mx-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent cursor-pointer md-hover-text-blue-700 md-p-0" onClick={handleLogout}>Logout</p>
              <Link to="/dashboard">
                {/* TO DO PROFILE IMAGE */}
                <p className="block mx-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent md-hover-text-blue-700 md-p-0">Dashboard</p>
              </Link>
              </div>
              ) : (
              <div>
              <Link to="/register">
                <p className="block mx-4 text-gray-900 rounded hover-bg-gray-100 md-hover-bg-transparent md-hover-text-blue-700 md-p-0">Get Started</p>
              </Link>
              </div>
              )}
            </div>
          </div>

        </div >
      </nav >

    </div >
  );
};

export { Header };