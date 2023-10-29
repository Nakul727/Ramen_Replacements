import '../styles/Home.css';
import { Header, Logo_Name, Links} from '../components/header.js';
import { Footer } from "../components/footer.js"
import { HomeRecipes } from '../components/HomeRecipes';

function Home() {

  const header_linkData = [
    { to: '/login', text: 'Login' },
    { to: '/explore', text: 'Explore' },
  ];
  
  return (
    <div className="homepage">

      <header>
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
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