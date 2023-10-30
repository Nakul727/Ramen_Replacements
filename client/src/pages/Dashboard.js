import React from 'react';
import { Header } from '../components/header.js';
import { Footer } from '../components/footer.js';
import { useAuth } from '../AuthContext.js';
import { getUserInfo } from '../components/UserInfo.js';

function Dashboard() {
  const { isLoggedIn, logout } = useAuth();
  const userInfo = getUserInfo();

  return (
    <div>
      <header>
        <Header />
      </header>

      <div>
        {isLoggedIn ? (

          <div className="body_sections">

            <div className="section1" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
              {/* Add more user information fields as needed */}
              {/* Main Dashboard Section */}
              <p>Welcome to the Dashboard {userInfo.username} You have been successfully logged in and authenticated</p>
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