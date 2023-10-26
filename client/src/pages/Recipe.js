import '../styles/Home.css';
import { Link } from "react-router-dom";
import { Footer } from "../components/footer.js";
import { useParams } from 'react-router-dom';
import menu_img from "../assets/menu.png";
import logo_img from "../assets/logo.png";

function Recipe() {
    const { recipeID } = useParams();
      
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

      <p>{recipeID}</p>
      <p class="text-center text-3xl  mt-10">Recipe</p>

      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default Recipe;
