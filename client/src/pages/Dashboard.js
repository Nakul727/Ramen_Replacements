import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/header.js';
import { Footer } from '../components/footer.js';
import { useAuth } from '../AuthContext.js';

function Dashboard() {

  const navigate = useNavigate();

  const { isLoggedIn } = useAuth();
  const [userInfo, setUserInfo] = useState(null);

  // Check if the user is logged in
  // If logged in, retrieve the JWT token from local storage
  // Decode the JWT token to get user information (payload)

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

  

  return (
    <div>
      <header>
        <Header/>
      </header>

      <div>
        {isLoggedIn ? (

          <div className="body_sections">

            <div className="section1" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
            {/* Add more user information fields as needed */}
            {/* Main Dashboard Section */}
            </div>

            <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
            {/* Div for welcome message to the explore page and what the page is about
            Here you can find ....*/}
            </div>

          </div>

        ) : (

          <div className="body_sections">
            <div className="section1">
              {/* Access Denied if user is not logged in and link to the login page */}  
              <p className="text-center text-3xl mt-10">Access Denied</p>
              <p className="text-center">Please log in to access the dashboard.</p>
              <a href="/login" className="text-center text-blue-700">Login</a>
            </div>
          </div>
        )}
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Dashboard;