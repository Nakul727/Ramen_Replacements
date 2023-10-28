import '../styles/Home.css';
import '../styles/Recipe.css';
import { Link } from "react-router-dom";
import { Footer } from "../components/footer.js";
import { useParams } from 'react-router-dom';
import { displayMessage} from "../components/helper.js";
import menu_img from "../assets/menu.png";
import logo_img from "../assets/logo.png";

function Recipe() {
    const { recipeID } = useParams();

    // get recipe details with API call
    async function getRecipeDetail(recipeID) {
        try{
            const fetchlink = "http://localhost:8080/recipe/" + String(recipeID);
            const response = await fetch(fetchlink);
            if (response.ok) {
                return response.json();
            } else {
                const error = await response.json();
                displayMessage("Error: ", error.error);
                return error;
            }
        } catch(error) {
            displayMessage("500 internal server error", "Error contacting the server")
            return error;
        }
    }

    const recipe = getRecipeDetail(recipeID);
      
    return (
        <div>
            <header className="bg-zinc-300 flex items-center justify-between p-5">
                <div className="flex items-center mx-5">
                <Link to="/">
                    <img src={logo_img} className="h-14 w-auto mx-4" alt="Logo" />
                </Link>
                <h1 className="text-black text-4xl ml-2">Ramen Replacements</h1>
                </div>

                <div className="flex items-center mx-5">
                <Link to="/login">
                    <button className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 mr-10">
                    <p className="text-xl">LOGIN</p>
                    </button>
                </Link>
                <img src={menu_img} className="h-12 w-12" alt="Menu" />
                </div>
            </header>

            <div className="h-[35vw]">
                <section className="float-left w-7/12 h-[30vw] mt-10">
                    <h1 className="text-center text-4xl py-10">{recipe.Title}</h1>
                    <hr className="border-slate-600 w-4/6 m-auto"></hr>
                    <div className="bg-slate-200 mx-20 my-5 h-64 rounded-xl">
                        <h3 className="text-xl px-10 pt-10"> {recipe.Description} </h3>
                    </div>
                    {/*userid is a placeholder for username*/}
                    <p className="text-2xl mx-20 mt-3 float-left">Added by: {recipe.UserID}</p>
                    <div className="pr-20">
                        <span class={recipe.Rating >= 5 ? "coloured_star" : "uncoloured_star"}>★</span>
                        <span class={recipe.Rating >= 4 ? "coloured_star" : "uncoloured_star"}>★</span>
                        <span class={recipe.Rating >= 3 ? "coloured_star" : "uncoloured_star"}>★</span>
                        <span class={recipe.Rating >= 2 ? "coloured_star" : "uncoloured_star"}>★</span>
                        <span class={recipe.Rating >= 1 ? "coloured_star" : "uncoloured_star"}>★</span>
                    </div>
                </section>

                <aside className="float-right w-4/12 mt-10 m-auto">
                    <img src={recipe.Picture} alt={`${recipe.Title}`} 
                    class="recipe_image"></img>
                </aside>
            </div>

            <article>
                <div class="info_box">
                    <h3 className="text-4xl px-20 pt-10">Ingredients</h3>
                    <hr className="border-black w-11/12 m-auto"></hr>
                    <p class="info_text">{recipe.Ingredients}</p>
                </div>
                
                <div class="info_box">
                    <h3 className="text-4xl px-20 pt-10">Instructions</h3>
                    <hr className="border-black w-11/12 m-auto"></hr>
                    <p class="info_text">{recipe.Steps}</p>
                </div>

                <section className="m-auto w-3/4">
                    <p class="info_text">Rate it: </p>
                    <hr className="border-black w-11/12 m-auto"></hr>
                    <p class="info_text">Comments </p>
                </section>
                <div className="m-20"> </div>
            </article>

            <footer>
                <Footer/>
            </footer>
        </div>
  );
}

export default Recipe;
