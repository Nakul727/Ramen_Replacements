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
      
      <div className="mt-32">
        <p class="text-center text-3xl  mt-10">Welcome to Ramen_Replacements</p>
        <p class="text-xl mt-10 ml-5">Here are the latest recipes:</p>
        <div>
          <HomeRecipes/>
        </div>
      </div>
      
      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

export default Home;
