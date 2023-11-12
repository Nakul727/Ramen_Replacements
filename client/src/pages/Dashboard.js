import React from 'react';
import { Header } from '../components/header.js';
import { Footer } from '../components/footer.js';
import { useAuth } from '../AuthContext.js';
import { getUserInfo } from '../components/UserInfo.js';
import { useNavigate } from 'react-router-dom';

function Dashboard() {

  const { isLoggedIn, logout } = useAuth();
  const userInfo = getUserInfo();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <header>
        <Header />
      </header>

      <div>
        {isLoggedIn ? (

          <div className="body_sections">
            

            <div className="section1" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
              <p className="mt-10">Welcome to the Dashboard {userInfo.username} You have been successfully logged in and authenticated</p>
              <button className={`mt-10 cursor-pointer`} onClick={handleLogout}>Logout</button>
            </div>

            <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
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