import '../styles/Home.css';
import '../styles/RecipeCard.css';
import { Footer } from "../components/footer.js";
import { useParams } from 'react-router-dom';
import { Header } from '../components/header.js';
import { displayMessage } from "../components/helper.js";
import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext.js';


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
                <div className="body_sections overflow-hidden pt-20">


                    {recipe ? (
                        <div className="p-12 mx-12 mb-12 rounded-3xl" style={{ backgroundColor: "lightgrey" }}>

                            <div className="flex justify-center items-center">
                                {/* Left Section */}
                                <div className="flex-1 mx-4 p-4">
                                    <p className="font-arvo text-3xl text-center">{recipe.title}</p>
                                    <hr className='mx-auto w-80 mt-2 border border-black'></hr>
                                    <div className="my-10 p-12 rounded-3xl bg-zinc-200">
                                        {recipe.description}
                                    </div>
                                    <div className="section1 flex items-center justify-center">
                                        <div className="flex-1 mx-4 p-4">
                                            <p className="font-arvo text-3xl text-center">Added By: {recipe.username}</p>
                                        </div>
                                        <div className="flex-1 mx-4 p-4">
                                            <p className="font-arvo text-3xl text-center">Likes: {recipe.likes}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Section */}
                                <div className="flex-1 mx-4 p-4 flex items-center justify-center">
                                    <div className="relative w-96 h-96 aspect-w-1 aspect-h-1">
                                        <img
                                            src={recipe.image}
                                            alt={`${recipe.title}`}
                                            className="absolute inset-0 mx-auto my-auto object-contain rounded-lg"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-zinc-200 mt-8">
                                <p>Ingredients: {recipe.Ingredients}</p>
                                <p>Instructions: {recipe.Instructions}</p>
                                <p>Total Cost: $ {recipe.totalCost} CAD</p>
                                <br></br>
                                <p>Nutritional Values</p>

                                <p>Calories: {recipe.nutrients.calories} kcal</p>
                            </div>


                            {/* Like function */}
                            <div className="flex bg-zinc-200 mt-8">
                                <p>Like the Recipe</p>
                                <button className="font-arvo bg-white hover:bg-slate-200 ml-12" onClick={handleLike}>Like</button>
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