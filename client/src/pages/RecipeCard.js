import '../styles/Home.css';
import '../styles/RecipeCard.css';
import { Footer } from "../components/footer.js";
import { useParams } from 'react-router-dom';
import { Header, Logo_Name, Links} from '../components/header.js';
import { displayMessage} from "../components/helper.js";

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

    const header_linkData = [
        { to: '/explore', text: 'Explore' },
        { to: '/login', text: 'Login' },
    ];
      
    return (
        <div>
            
            <header>
                <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
            </header>

            <div className="h-[35vw]">
                <section className="float-left w-7/12 h-[30vw] mt-28">
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

                <aside className="float-right w-4/12 mt-32 m-auto">
                    <img src={recipe.Picture} alt={`${recipe.Title}`} 
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
