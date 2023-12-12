import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/header.js";
import { displayMessage } from "../components/message.js";
import { Footer } from "../components/footer.js";
import { useAuth } from "../AuthContext.js";
import { fetchExploreRecipes } from "../helpers/api.js";
import Modal from "react-modal";

function Explore() {

  const { isLoggedIn } = useAuth();
  
  const [recipes, setRecipes] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleExploreRecipes = async () => {
    try {
      const data = await fetchExploreRecipes();
      setRecipes(data);
    } catch (error) {
      displayMessage('Error', `An error occurred while fetching recipes: ${error.message}`);
    }
  };

  // make sure the function is called on page load
  useEffect(() => {
    handleExploreRecipes();
  }, []);

  //---------------------------------------------------------------------------

  // Function to show the login popup
  const showLoginPopupHandler = () => {
    setShowLoginPopup(true);
  };

  // Function to hide the login popup
  const hideLoginPopupHandler = () => {
    setShowLoginPopup(false);
  };

  //---------------------------------------------------------------------------

  return (
    <div>

      <header>
        <Header />
      </header>

      <div className="body_sections overflow-hidden">

        {/* Section 1 - Welcome to the Explore page */}
        {/* Section 2 - Search bar */}
        {/* Section 3 - Filtering bar */}

        {/* Section 4 - Recipes Grid */}
        <div className="p-16" style={{ backgroundColor: "lightgrey" }}>

          <h1 className="text-center font-arvo text-3xl mb-12">Explore Recipes</h1>

          {/* If the api response is null, there are no recipes */
           /* Otherwise Display the recipes in a grid */}

          {recipes === null ? (
            <p>No recipe found.</p>
          ) : (
            <div className="grid grid-cols-3 gap-4 place-items-center">
                {/* For each recipe in the grid col */}
                {recipes.map((recipe) => (
                  <div key={recipe.ID} className="border p-4 rounded-md text-center">
                    <Link
                      to={isLoggedIn ? `/recipe/${recipe.ID}` : "#"}
                      onClick={isLoggedIn ? null : showLoginPopupHandler}
                    >
                      <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-96 h-96 object-cover rounded-md mx-auto"
                      />
                      <h3 className="text-lg w-96 p-4 font-arvo bg-zinc-200 font-semibold">{recipe.title}</h3>
                    </Link>
                  </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <footer>
        <Footer />
      </footer>

      {/* --------------------------------------------------------------------------- */}

      {/* Popup using React Modal */}
      <Modal
        isOpen={showLoginPopup}
        onRequestClose={hideLoginPopupHandler}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-md"
        overlayClassName="fixed inset-0 bg-zinc-200 bg-opacity-75"
        contentLabel="Login Popup"
      >
        <div className="bg-zinc-500 p-10 bg-opacity-100 rounded-md">
          <p className="text-lg lg:text-xl font-arvo text-neutral-200 mb-8">
            You must be logged in to view the recipes.
          </p>

          <div className="flex items-center justify-center">
            <Link to="/login">
              <button className="bg-zinc-200 text-black font-arvo px-4 py-2 rounded-md mr-2 hover:bg-zinc-400">
                Go to Login Page
              </button>
            </Link>

            <button
              className="bg-zinc-200 text-black font-arvo px-4 py-2 rounded-md mr-2 hover:bg-zinc-400"
              onClick={hideLoginPopupHandler}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* --------------------------------------------------------------------------- */}
    </div>
  );
}

export default Explore;