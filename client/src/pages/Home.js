import '../styles/Home.css';
import { Header, Logo_Name, Links} from '../components/header.js';
import { Footer } from "../components/footer.js"

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
        </div>
        <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>
        </div>
        <div className="section3" style={{ backgroundColor: 'lightpink', height: '300px' }}>
        </div>
      </div>

      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

export default Home;