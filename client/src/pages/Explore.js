import '../styles/Home.css';
import { Header } from '../components/header.js';
import { Footer } from "../components/footer.js"
import { ExploreRecipes } from '../components/ExploreRecipes';

// if the user is not logged in, clicking on a recipe promopts to login and redirects
// if the user is logged in, they can click on any recipe and view/rate i

// TODO
// section 1:
/*  Welcome to the explore page!*/
// section 2:
/* Div for welcome message to the explore page and what the page is about
           Here you can find ....*/
// section 3
/* Div for the results of the filtering and recipies 
          Get the top 100 highest rated recipies from the database
          Display them here in a grid like manner, users can click on it
          It gets routed to the recipe's unique card. */
function Explore() {

  return (
    <div className="explorepage">
      <header>
        <Header/>
      </header>

      <div>
        <ExploreRecipes />
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Explore;