import React, { useState } from "react";
import { useAuth } from "../AuthContext.js";
import { Link, useNavigate } from "react-router-dom";

import logo_img from "../assets/logo.png";
import dropdown_img from "../assets/dropdown.png";
import { getUserInfo } from "../utils/UserInfo.js";
import { Button } from "../components/index.js";

const Header = () => {

  const { isLoggedIn, logout } = useAuth();
  const userInfo = getUserInfo();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
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
            <span className="self-center text-2xl font-arvo_bold whitespace-nowrap">
              Ramen_Replacements
            </span>
          </div>

          {/* Right Part */}
          <div className="flex items-center justify-between font-medium">
            <Button onClick={() => navigate("/")}>Home</Button>
            <Button onClick={() => navigate("/explore")}>Explore</Button>

            {isLoggedIn ? (
              <div className="flex items-center justify-between font-medium">
                <Button onClick={() => navigate("/recipemaker")}>
                  Create Recipe
                </Button>

                <div className="relative">
                  <Button onClick={toggleDropdown} className={"flex items-center justify-center"}>
                    <img
                      src={userInfo.pfp}
                      alt="User Profile Picture"
                      className="w-8 h-8 rounded-full border"
                    />
                    <img
                      src={dropdown_img}
                      alt="Drop Down"
                      className="w-2.5 h-2.5 ml-2.5"
                    />
                  </Button>

                  {showDropdown && (
                    <div className="absolute bg-white border border-gray-300 rounded-lg translate-x-[-35px]">
                      <Button onClick={() => navigate("/dashboard")}>
                        Dashboard
                      </Button>
                      <Button onClick={handleLogout}>Logout</Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between font-medium">
                <Button onClick={() => navigate("/login")}>Log In</Button>
                <Button onClick={() => navigate("/register")}>
                  Get Started
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;