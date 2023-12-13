import '../styles/Home.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext.js';

import { Header } from "../layouts/index.js";
import { displayMessage } from "../utils/Message.js";

function Recipe() {

    //---------------------------------------------------------------------------

    const { isLoggedIn } = useAuth();

    // Information Regarding the recipe
    const { recipeID } = useParams();
    const [recipe, setRecipe] = useState(null);

    //---------------------------------------------------------------------------

    // Function to retrive recipe information from backend endpoint
    const getRecipeDetail = async (recipeID) => {
        try {
            const backendApi = process.env.REACT_APP_BACKEND;
            const response = await fetch(backendApi + `/recipe/${recipeID}`, {
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
                const recipeData = await response.json();
                setRecipe(recipeData);
                return;
            }
        } catch (error) {
            displayMessage("500 internal server error", "Error contacting the server");
            return error;
        }
    }

    // get recipe details with API call
    useEffect(() => {
        async function fetchRecipe() {
            try {
                getRecipeDetail(recipeID);
            } catch (error) {
                displayMessage("Error: ", error.error);
            }
        }
        fetchRecipe();
    }, [recipeID]);

    //---------------------------------------------------------------------------
    const handleLike = async () => {
        try {
            const backendApi = process.env.REACT_APP_BACKEND;
            const response = await fetch(`${backendApi}/recipe/${recipeID}/likes`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                displayMessage('Error', `Failed to update likes: ${errorResponse.error}`);
                return;
            }
            else {
                // Update the state with the new number of likes
                setRecipe((prevRecipe) => {
                    return {
                        ...prevRecipe,
                        likes: prevRecipe.likes + 1,
                    };
                });
            }
        } catch (error) {
            displayMessage('500 internal server error', 'Error contacting the server');
            return error;
        }
    };

    //---------------------------------------------------------------------------
    return (
        <div>
            <header>
                <Header />
            </header>

            {isLoggedIn ? (
                <div className="body_sections overflow-hidden pt-20" style={{ backgroundColor: "rgb(255, 220, 220)" }}>


                    {recipe ? (
                        <div className="p-12 mx-20 mb-12 border-2 border-black rounded-3xl" style={{ backgroundColor: "lightgrey" }}>

                            <div className="flex justify-center items-center mb-16">
                                {/* Left Section */}
                                <div className="flex-1 mx-4 p-4">
                                    <p className="font-arvo font-arvo_bold text-3xl text-center">{recipe.title}</p>
                                    <hr className='mx-auto w-80 mt-2 border border-black'></hr>
                                    <div className="my-10 p-12 font-arvo rounded-xl bg-zinc-100">
                                        {recipe.description}
                                    </div>
                                    <div className="section1 flex items-center justify-center">
                                        <div className="flex-1 mx-4 p-4">
                                            <p className="font-arvo text-xl text-center">Added By: {recipe.username}</p>
                                        </div>
                                        <div className="flex-1 mx-4 p-4">
                                            <p className="font-arvo text-xl text-center">Likes: {recipe.likes}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="flex-1 mx-4 p-4 flex items-center justify-center">
                                    <div className="relative w-96 h-96 aspect-w-1 aspect-h-1">
                                        <img
                                            src={recipe.image}
                                            alt={`${recipe.title}`}
                                            className="border border-neutral-950 object-cover w-96 h-96"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="relative mb-20 mx-20">
                                <div className="absolute bg-zinc-200 w-48 px-4 py-2 border border-black z-10">
                                    <h1 className='text-center font-arvo font-arvo_bold'>Ingredients</h1>
                                </div>
                                <div className="bg-zinc-200 w-auto mx-20 h-auto border border-black translate-y-8">
                                    <ul className="list-disc py-8 px-16 font-arvo">
                                        {/* replace the escaped newline characters with actual newline characters */}
                                        {recipe.Ingredients.replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n').split('\n').map((ingredient, index) => (
                                            <li key={index}>{ingredient}</li>
                                        ))}
                                    </ul>

                                </div>
                            </div>

                            <div className="relative mb-20 mx-20">
                                <div className="absolute bg-zinc-200 w-48 px-4 py-2 border border-black z-10">
                                    <h1 className='text-center font-arvo font-arvo_bold'>Instructions</h1>
                                </div>
                                <div className="bg-zinc-200 w-auto mx-20 h-auto border border-black translate-y-8">
                                    <ul className="list-disc py-8 px-16 font-arvo">
                                        {/* replace the escaped newline characters with actual newline characters */}
                                        {recipe.Instructions.replace(/^"(.*)"$/, '$1').replace(/\\n/g, '\n').split('\n').map((instruction, index) => (
                                            <li key={index}>{instruction}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="relative mb-20 mx-20">
                                <div className="absolute bg-zinc-200 w-48 px-4 py-2 border border-black z-10">
                                    <h1 className='text-center font-arvo font-arvo_bold'>Nutrition</h1>
                                </div>
                                <div className="bg-zinc-200 w-auto mx-20 h-auto border border-black translate-y-8 p-8">
                                    <div className="grid grid-cols-2 gap-4 font-arvo">
                                        <div>
                                            <label className="block font-arvo_bold">Calories:</label>
                                            <span className="ml-2">{recipe.nutrients.calories.toFixed(1)} kcal</span>
                                        </div>
                                        <div>
                                            <label className="block font-arvo_bold">Carbohydrates:</label>
                                            <span className="ml-2">{recipe.nutrients.carbohydrates.toFixed(1)} g</span>
                                        </div>
                                        <div>
                                            <label className="block font-arvo_bold">Protein:</label>
                                            <span className="ml-2">{recipe.nutrients.protein.toFixed(1)} g</span>
                                        </div>
                                        <div>
                                            <label className="block font-arvo_bold">Fats:</label>
                                            <span className="ml-2">{recipe.nutrients.fat.toFixed(1)} g</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Like function */}
                            <div className="flex items-center justify-center p-4 bg-zinc-200 mt-8">
                                <p>Like the Recipe</p>
                                <button className="font-arvo bg-white rounded-3xl hover:bg-slate-200 p-4 ml-12" onClick={handleLike}>Like</button>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}

                </div>

            ) : (
                // if the user is not logged in
                <div className="body-sections">
                    <div className="mt-40">
                        <p>You are not logged In</p>
                    </div>
                </div>
            )}

            <footer>
                <Footer />
            </footer>
        </div>
    );
}

export default Recipe;