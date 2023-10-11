import '../styles/Home.css';
import { Link } from "react-router-dom";
import { Header } from "../components/header.js"
import { Footer } from "../components/footer.js"
import menu_img from "../assets/menu.png"

function Dashboard() {
  return (
    <div>
      <header class="homeheader">
        <Header/> 
      <img src={menu_img} className="m-4 md:m-12 w-12 float-right"></img>
      <Link to="/login">
        <button className="float-right">
          <p className="m-3 md:m-8 bg-slate-200 p-5 text-xl md:text-2xl xl:text-3xl">USERNAME HERE</p>
        </button>
      </Link>
        <p className="m-6 md:m-12 p-1 text-xl md:text-2xl xl:text-3xl float-right">EXPLORE</p>
      </header>
      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default Dashboard;
