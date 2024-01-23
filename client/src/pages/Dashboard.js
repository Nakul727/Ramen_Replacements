import React from 'react';
import { useEffect, useState } from 'react';
import { displayMessage } from '../components/helper.js';
import { Header } from '../components/header.js';
import { Footer } from '../components/footer.js';
import { useAuth } from '../AuthContext.js';
import { getUserInfo } from '../components/UserInfo.js';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { isLoggedIn } = useAuth();
  const userInfo = getUserInfo();
  const [recipes, setRecipes] = useState([]);

  const handleDashboardRecipes = async () => {
    try {
      const backendApi = process.env.REACT_APP_BACKEND;
      const response = await fetch(`${backendApi}/recipe/${userInfo.userID}/dashboard`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        displayMessage('Error', `Failed to fetch recipes: ${errorResponse.error}`);
        return;
      } else {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      displayMessage('Error', `An error occurred while fetching recipes: ${error}`);
    }
  };

  useEffect(() => {
    handleDashboardRecipes();
  }, []);

  return (
    <div>
      <header>
        <Header />
      </header>

      <div>
        {isLoggedIn ? (
          <div className="body_sections overflow-hidden">
            <div className="p-16" style={{ backgroundColor: 'lightgrey' }}>
              <div className="flex justify-center items-center">
                <div className="flex-1 ml-20 p-4">
                  <img
                    alt="User Profile Picture"
                    className="rounded-full border-2 border-neutral-950 object-cover w-96 h-96"
                    src={userInfo.pfp}
                  />
                </div>

                <div className="flex-1 mr-20 p-4 font-arvo">
                  <p className="text-2xl font-arvo_bold text-center">
                    {' '}
                    Welcome to the Dashboard {userInfo.username}!
                  </p>
                  <hr className="mt-2 mb-10 border-1 border-black"></hr>
                  <p>
                    {' '}
                    Here you can find all the recipes made by you, both public and private. Use the
                    buttons in the header to create an new recipe, explore other pulic recipes and
                    logout.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-16" style={{ backgroundColor: 'lightblue' }}>
              <p className="text-2xl mb-6 font-arvo text-center">Your Recipes</p>

              {recipes === null ? (
                <p>No recipe found.</p>
              ) : (
                <div className="grid grid-cols-3 gap-4 place-items-center">
                  {recipes.map((recipe) => (
                    <div key={recipe.ID} className="border p-4 rounded-md">
                      <Link
                        to={isLoggedIn ? `/recipe/${recipe.ID}` : '#'}
                        onClick={isLoggedIn ? null : showLoginPopupHandler}
                      >
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-96 h-96 object-cover rounded-md"
                        />
                        <h3 className="text-lg w-96 p-4 font-arvo text-center bg-zinc-200 font-semibold">
                          {recipe.title}
                        </h3>
                        {!isLoggedIn && (
                          <button onClick={showLoginPopupHandler}>Log in to view recipe</button>
                        )}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="body_sections overflow-hidden pt-20">
            <div className="section1">
              {/* Access Denied if user is not logged in and link to the login page */}
              <p className="text-center text-3xl mt-10">Access Denied</p>
              <p className="text-center">Please log in to access the dashboard.</p>
              <a href="/login" className="text-center text-blue-700">
                Login
              </a>
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
