import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { displayMessage } from "../components/helper.js";
import { useAuth } from "../AuthContext.js";
import Modal from "react-modal";

function TopHomeRecipe() {
  const [topRecipe, setTopRecipe] = useState({});
  const { isLoggedIn } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const getMostLiked = async () => {
    try {
      const backendApi = process.env.REACT_APP_BACKEND;
      const response = await fetch(`${backendApi}/recipe/most_liked`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.json();
        displayMessage(
          "Error",
          `Failed to fetch recipes: ${errorResponse.error}`
        );
      } else {
        const data = await response.json();
        setTopRecipe(data);
      }
    } catch (error) {
      displayMessage(
        "Error",
        `An error occurred while fetching recipes: ${error}`
      );
    }
  };

  useEffect(() => {
    getMostLiked();
  }, []);

  const showLoginPopupHandler = () => {
    setShowLoginPopup(true);
  };

  const hideLoginPopupHandler = () => {
    setShowLoginPopup(false);
  };

  return (
    <div>
      {topRecipe.ID ? (
        <div key={topRecipe.ID} className="ml-20 mr-32 border border-black rounded-md">
          <Link
            to={isLoggedIn ? `/recipe/${topRecipe.ID}` : "#"}
            onClick={isLoggedIn ? null : showLoginPopupHandler}
          >
            <img
              src={topRecipe.image}
              alt={topRecipe.title}
              className="w-96 h-96 object-cover rounded-md"
            />
            <h3 className="text-lg w-96 p-4 font-arvo text-center bg-zinc-200 font-semibold">
              {topRecipe.title}
            </h3>
          </Link>
        </div>
      ) : (
        <p>No recipe found.</p>
      )}

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
    </div>
  );
}

export { TopHomeRecipe };