import React, { useEffect, useState } from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { Header, Logo_Name, Links } from '../components/header.js';
import { Footer } from '../components/footer.js';
import { useAuth } from '../AuthContext.js';
import handleLogout from '../components/LogoutHandler.js';


function Dashboard() {

  const navigate = useNavigate();
  const header_linkData = [
    { to: '/explore', text: 'Explore' },
  ];

  const { isLoggedIn } = useAuth();
  const [userInfo, setUserInfo] = useState(null);



  useEffect(() => {
    // Check if the user is logged in
    // If logged in, retrieve the JWT token from local storage
    // Decode the JWT token to get user information (payload)

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


  return (
    <div>
      
      <header>
        <Header
          leftChildren={<Logo_Name />}
          rightChildren={
            <div>
              {isLoggedIn ? (
                <div>
                  {/* Display user's profile picture if logged in */}
                  {userInfo && userInfo.profilePicture && (
                    <img
                      src={userInfo.profilePicture}
                      alt="Profile"
                      className="h-10 w-10 rounded-full mr-4"
                    />
                  )}

                  {/* Logout button if logged in */}
                  <button
                    onClick={() => handleLogout()}
                    className="text-blue-700"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          }
        />
      </header>


      <div className="body_sections">

        <div>
          {isLoggedIn ? (

            <div className="section1">
              {/* Add more user information fields as needed */}
              {/* Main Dashboard Section */}

              <p className="text-center text-3xl mt-10">Welcome to Dashboard</p>
              {userInfo && (
                <div>
                  <h3>User Information</h3>
                  <p>Name: {userInfo.name}</p>
                  <p>Email: {userInfo.email}</p>
                </div>
              )}
            </div>

          ) : (
            <div className="section1">

              {/* Access Denied if user is not logged in and link to the login page */}  
              <p className="text-center text-3xl mt-10">Access Denied</p>
              <p className="text-center">Please log in to access the dashboard.</p>
              <a href="/login" className="text-center text-blue-700">Login</a>
            </div>
          )}
        </div>


      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Dashboard;