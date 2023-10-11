import { useState, useEffect } from 'react';
import "../styles/Home.css";

function RecipeCard(rec) {
    const link = "localhost:3000/recipe/" + String(rec.UserID);
    return (
        <div className="recipe-card">
            <a href={link}>{rec.Title}</a>
            <div className="picture-container">
                <img className="recipe-pic" src={rec.Picture} alt={`alt${rec.Title}`} />
            </div>
            <div className="text-container">
                <p>{rec.Description}</p>
            </div>
        </div>
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


function Body() {
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
                    {recipeData.map(recipe => (
                        <RecipeCard key={recipe.id} {...recipe} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Body;