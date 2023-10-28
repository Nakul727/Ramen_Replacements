import { useState, useEffect } from 'react';
import { displayMessage} from "./helper.js"
import { Link } from "react-router-dom";
import "../styles/Home.css";


function RecipeCard(rec) {
    const link = "recipe/" + String(rec.UserID);
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

function getRecipeData() {
    async function getData() {
        try{
            const response = await fetch("http://localhost:8080/recipe/latest");
            if (response.ok) {
                return response.json();
            } else {
                const error = await response.json();
                displayMessage("error: ", error.error);
                return error;
            }
        } catch(error) {
            displayMessage("500 internal server error", "there was an error contacting the server")
            return response.json();
        }
    }

    return getData();
}


function HomeRecipes() {
    const [recipeData, setRecipeData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            const data = await getRecipeData();
            setRecipeData(data);
        }

        fetchData();
    }, []);

    return (
        <div className="grid-container-container">
            <div className="grid-container">
                <div className="recipe-grid">
                    {recipeData === null ? (
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

export {HomeRecipes};