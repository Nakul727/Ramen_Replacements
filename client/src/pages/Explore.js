import '../styles/Home.css';
import { Header, Logo_Name, Links } from '../components/header.js';
import { Footer } from "../components/footer.js"

import { ExploreRecipes } from '../components/ExploreRecipes';

function Explore() {

  const header_linkData = [
    { to: '/explore', text: 'Explore' },
    { to: '/login', text: 'Login' },
  ];

  return (
    <div className="explorepage">
      <header>
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
      </header>

      <div className='body_sections'>
        <div className="section1" style={{ backgroundColor: 'lightblue', height: '300px' }}>
          {/*  Welcome to the explore page!*/}
        </div>

        <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
          {/* Div for welcome message to the explore page and what the page is about
           Here you can find ....*/}
        </div>

        <div className="section3" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
          {/* Div for the filtering bar */}
        </div>

        <div className="section4" style={{ backgroundColor: 'lightpink', height: '300px' }}>

          {/* Div for the results of the filtering and recipies 
          Get the top 100 highest rated recipies from the database
          Display them here in a grid like manner, users can click on it
          It gets routed to the recipe's unique card. */}

          {/* When the recipies are rendered, make sure to check that if the user is logged in
          then only it routes to the recipe card otherwise routes to the hompage */}

        </div>
      </div>

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