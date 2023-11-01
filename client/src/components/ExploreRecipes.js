import { useState, useEffect } from 'react';
import { displayMessage } from "./helper.js";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function RecipeCard(rec) {
    const link = "recipe/" + String(rec.ID);
    return (
        <Link to={link} className="recipe-card">
            <h3 className="text-lg md:text-2xl pt-4"> {rec.Title} </h3>
            <div className="picture-container">
                <img className="recipe-pic" src={rec.Picture} alt={`alt${rec.Title}`} />
            </div>
            <div className="pb-4">
                <p className="text-md md:text-lg">{rec.Description}</p>
            </div>
        </Link>
    );
}

function ExploreRecipes() {
    
    const [recipeData, setRecipeData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const backendApi = process.env.REACT_APP_BACKEND;
                const response = await fetch(`${backendApi}/recipe/latest`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setRecipeData(data);
                } else {
                    const errorData = await response.json();
                    displayMessage("Error: " + errorData.error);
                    throw new Error("Request failed with status: " + response.status);
                }
            } catch (error) {
                displayMessage("500 Internal Server Error", "There was an error contacting the server");
                throw error;
            }
        }

        fetchData();
    }, []);

    return (
        <div className="grid-container-container">
            <div className="grid-container">
                <div className="recipe-grid">
                    {recipeData.length === 0 ? (
                        <p>No recipes found</p>
                    ) : (
                        recipeData.map(recipe => (
                            <RecipeCard key={recipe.id} {...recipe} />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export { ExploreRecipes };
