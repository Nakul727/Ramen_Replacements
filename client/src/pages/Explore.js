import '../styles/Home.css';
import { Header } from '../components/header.js';
import { Footer } from "../components/footer.js"

// if the user is not logged in, clicking on a recipe promopts to login and redirects
// if the user is logged in, they can click on any recipe and view/rate it

function Explore() {

  return (
    <div className="explorepage">
      <header>
        <Header/>
      </header>

      <div className='body_sections'>
        <div className="section1" style={{ backgroundColor: 'lightblue', height: '300px' }}>
          Explore Page
        </div>
        <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
        </div>
        <div className="section3" style={{ backgroundColor: 'lightpink', height: '300px' }}>
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Explore;