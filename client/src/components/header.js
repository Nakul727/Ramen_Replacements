import React from 'react';
import { Link } from 'react-router-dom';
import logo_img from '../assets/logo.png';
import { useAuth } from '../AuthContext.js';

const buttonStyles = "block mr-2 py-3 px-4 text-gray-900 rounded-xl hover:bg-gray-100 md-hover-bg-transparent transition-all duration-200 ease-in-out";

const Header = () => {
  const { isLoggedIn} = useAuth();

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
              <div className='flex'>
                <Link to="/recipebuilder">
                  <button className={buttonStyles}>Create Recipe</button>
                </Link>
                <Link to="/dashboard">
                  <button className={buttonStyles}>Dashboard</button>
                </Link>
              </div>
            ) : (
              <div>
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