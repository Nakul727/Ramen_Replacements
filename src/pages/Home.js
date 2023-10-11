import '../styles/Home.css';
import { Link } from "react-router-dom";
import { HomeRecipes } from "../components/HomeRecipes.js"
import { Footer } from "../components/footer.js"
import menu_img from "../assets/menu.png"
import logo_img from "../assets/logo.png"


function Home() {
  return (
    <div className="homepage">

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

      <p class="text-center text-3xl  mt-10">Welcome to Ramen_Replacements</p>
      <p class="text-xl mt-10 ml-5">Here are the latest recipes:</p>

      <div>
        <HomeRecipes/>
      </div>
      
      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

export default Home;
