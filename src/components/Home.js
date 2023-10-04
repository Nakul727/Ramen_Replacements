import '../styles/Home.css';
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <div>
        <header>
          <h2 className="float-left text-xl m-5">Logo goes here</h2>
          <h1 className="text-4xl float-left m-5">Ramen Replacements</h1>
          <h1 className="text-4xl text-center float-left m-5">Search bar</h1>
        </header>
      </div>
      <aside>
        <Link to="/login">
          <button>
            <p>Log In</p>
          </button>
        </Link>
        <p>Explore</p>
        <p>Find</p>
        <p>Help</p>
      </aside>
    </div>
  );
}

export default Home;
