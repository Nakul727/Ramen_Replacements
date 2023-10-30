import '../styles/Home.css';
import { Header } from '../components/header.js';
import { Footer } from "../components/footer.js"

import { HomeRecipes } from '../components/HomeRecipes';

function Home() {

  return (
    <div className="homepage">

      <header>
        <Header />
      </header>
      
      <div className='body_sections'>
        <div className="section1" style={{ backgroundColor: 'lightblue', height: '300px' }}>
        </div>
        <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
        </div>
        <div className="section3" style={{ backgroundColor: 'lightpink', height: '300px' }}>
        </div>
      </div>

      <div>
        <HomeRecipes />
      </div>

      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

export default Home;