import '../styles/Home.css';
import { Link } from "react-router-dom";
import { Header } from "../components/header.js"
import { Footer } from "../components/footer.js"
import menu_img from "../assets/menu.png"

function Home() {
  return (
    <div>
      <header class="homeheader">
        <Header/> 
      <img src={menu_img} className="m-12 w-12 float-right"></img>
      <Link to="/login">
        <button className="float-right">
          <p className="m-8 bg-slate-200 p-5 text-3xl">LOGIN</p>
        </button>
      </Link>
        <p className="m-12 p-1 text-3xl float-right">EXPLORE</p>
      </header>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default Home;
