import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/header.js";
import { displayMessage } from "../components/helper.js";
import { Footer } from "../components/footer.js";
import { useAuth } from "../AuthContext.js";
import Modal from "react-modal";

function Explore() {

  const [recipes, setRecipes] = useState([]);
  const { isLoggedIn } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleExploreRecipes = async () => {
    try {
      const backendApi = process.env.REACT_APP_BACKEND;
      const response = await fetch(`${backendApi}/recipe/explore`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorResponse = await response.json();
        displayMessage('Error', `Failed to fetch recipes: ${errorResponse.error}`);
        return;
      }
      else {
        const data = await response.json();
        console.log(data)
        setRecipes(data);
      }
    } catch (error) {
      displayMessage('Error', `An error occurred while fetching recipes: ${error}`);
    }
  }

  useEffect(() => {
    handleExploreRecipes();
  }, []);

  // Function to show the login popup
  const showLoginPopupHandler = () => {
    setShowLoginPopup(true);
  };

  // Function to hide the login popup
  const hideLoginPopupHandler = () => {
    setShowLoginPopup(false);
  };

  return (
    <div>
      <header>
        <Header />
      </header>

      <div className="body_sections overflow-hidden pt-20">
        <div className="py-20 mx-56 mb-12 rounded-3xl" style={{ backgroundColor: "lightgrey" }}>
          <h1>Recipes</h1>
          <div className="grid grid-cols-3 gap-4">
            {recipes.map((recipe) => (
              <div key={recipe.ID} className="border p-4 rounded-md">
                <Link
                  to={isLoggedIn ? `/recipe/${recipe.ID}` : "#"}
                  onClick={isLoggedIn ? null : showLoginPopupHandler}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <h3 className="text-lg font-semibold">{recipe.title}</h3>
                  {!isLoggedIn && (
                    <button onClick={showLoginPopupHandler}>
                      Log in to view recipe
                    </button>
                  )}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <footer>
        <Footer />
      </footer>


      <Modal isOpen={showLoginPopup} onRequestClose={hideLoginPopupHandler}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-800 p-6 rounded-md shadow-lg text-white"
      overlayClassName="fixed inset-0 bg-black opacity-75"  // Set opacity to 50 for a faded background
      contentLabel="Login Popup">

      <p>You must be logged in to view the recipes.</p>
      <Link to="/login">
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600">
          Go to Login Page
        </button>
      </Link>
      <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400" onClick={hideLoginPopupHandler}>
        Close
      </button>

      </Modal>

    </div>
  );
}

export default Explore;
