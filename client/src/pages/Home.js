import '../styles/Home.css';
import { Header, Logo_Name, Links} from '../components/header.js';
import { Footer } from "../components/footer.js"
import { HomeRecipes } from "../components/HomeRecipes.js"

function Home() {

  const header_linkData = [
    { to: '/explore', text: 'Explore' },
    { to: '/login', text: 'Login' },
  ];
  
  return (
    <div className="homepage">

      <header>
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
      </header>
      
      <div className='body_sections'>
        <div className="section1" style={{ backgroundColor: 'lightblue', height: '300px' }}>

          {/* Short description of the platform 
          Call to action sign up button
          Image on the right */}

        </div>
        <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>

          {/* Why ramen replacements?
          - Who this platform is for. 
          Explore button */}
          
        </div>
        <div className="section3" style={{ backgroundColor: 'lightpink', height: '300px' }}>

          {/* Features
          - Create your own custom recipies!
            - add ingredients, add instructions, enjoy!
          - Explore the Top latest recipies (pictures of the highest rated and latest recipies)
          - Share your recipies with the world!
          */}

        </div>
      </div>

      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

export default Home;
