import '../styles/Home.css';
import '../styles/RecipeCard.css';
import { Footer } from "../components/footer.js";
import { useParams } from 'react-router-dom';
import { Header } from '../components/header.js';
import { displayMessage } from "../components/helper.js";
import { useEffect, useState } from 'react'

function Recipe() {

    // Information Regarding the recipe
    const { recipeID } = useParams();
    const [recipe, setRecipe] = useState(null);

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
                return response.json();
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
                const recipeData = await getRecipeDetail(recipeID);
                setRecipe(recipeData);
            } catch (error) {
                displayMessage("Error: ", error.error);
            }
        }
        fetchRecipe();
    }, [recipeID]);


    return (
        <div>
            {recipe == null ? <p>loading...</p> :
                <>
                    <header>
                        <Header />
                    </header>

                    <div className="h-[35vw]">
                        <section className="float-left w-7/12 h-[30vw] mt-28">
                            <h1 className="text-center text-4xl py-10">{recipe.title}</h1>
                            <hr className="border-slate-600 w-4/6 m-auto"></hr>
                            <div className="bg-slate-200 mx-20 my-5 h-64 rounded-xl">
                                <h3 className="text-xl px-10 pt-10"> {recipe.description} </h3>
                            </div>
                            {/*userid is a placeholder for username*/}
                            <p className="text-2xl mx-20 mt-3 float-left">Added by: {recipe.userID}</p>
                            <div className="pr-20">
                                <span class={recipe.rating >= 5 ? "coloured_star" : "uncoloured_star"}>★</span>
                                <span class={recipe.rating >= 4 ? "coloured_star" : "uncoloured_star"}>★</span>
                                <span class={recipe.rating >= 3 ? "coloured_star" : "uncoloured_star"}>★</span>
                                <span class={recipe.rating >= 2 ? "coloured_star" : "uncoloured_star"}>★</span>
                                <span class={recipe.rating >= 1 ? "coloured_star" : "uncoloured_star"}>★</span>
                            </div>
                        </section>

                        <aside className="float-right w-4/12 mt-32 m-auto">
                            <img src={recipe.image} alt={`${recipe.title}`}
                                class="recipe_image"></img>
                        </aside>
                    </div>
                    <div className="mt-28"></div>

                    <article>
                        <div class="info_box">
                            <h3 className="text-4xl px-20 pt-10">Ingredients</h3>
                            <hr className="border-black w-11/12 m-auto"></hr>
                            <p class="info_text">{recipe.Ingredients}</p>
                        </div>

                        <div class="info_box">
                            <h3 className="text-4xl px-20 pt-10">Instructions</h3>
                            <hr className="border-black w-11/12 m-auto"></hr>
                            <p class="info_text">{recipe.Instructions}</p>
                        </div>


                        <div class="info_box">
                            <h3 className="text-4xl px-20 pt-10">Post Time</h3>
                            <hr className="border-black w-11/12 m-auto"></hr>
                            <p class="info_text">{recipe.postTime}</p>
                        </div>

                        <div class="info_box">
                            <h3 className="text-4xl px-20 pt-10">Total Cost</h3>
                            <hr className="border-black w-11/12 m-auto"></hr>
                            <p class="info_text">{recipe.totalCost}</p>
                        </div>

                        <div class="info_box">
                            <h3 className="text-4xl px-20 pt-10">Nutrition</h3>
                            <hr className="border-black w-11/12 m-auto"></hr>
                            <p class="info_text">Calories: {recipe.nutrients.calories}</p>
                        </div>

                        <section className="m-auto w-3/4">
                            <p class="info_text">Rate it: </p>
                            <hr className="border-black w-11/12 m-auto"></hr>
                            <p class="info_text">Comments </p>
                        </section>
                        <div className="m-20"> </div>
                    </article>

                    <footer>
                        <Footer />
                    </footer>
                </>
            }
        </div>
    );
}

export default Recipe;