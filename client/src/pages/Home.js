import '../styles/Home.css';
import { Header } from '../components/header.js';
import { Footer } from "../components/footer.js"

function Home() {

  return (
    <div className="homepage">

      <header>
        <Header />
      </header>
      <br/><br/><br/><br/>
      <h1>Welcome to Ramen Replacements, your new home for delicious and affordable recipes</h1>
      <p>
        Here you can view, rate and comment on others' recipes, as well as upload your own. 
        You can get started by making an account and logging in, then check out the Explore page to see other recipes, 
        or upload a recipe of your own.
      </p>
      <>
      
      <div className='body_sections'>
        <div className="section1" style={{ backgroundColor: 'white', height: '675px' }}>

          {/* Short description of the platform 
          Call to action sign up button
          Image on the right */}

        </div>
      </div>
      {/*
        <div className="section2" style={{ backgroundColor: 'lightgreen', height: '300px' }}>

          {/* Why ramen replacements?
          - Who this platform is for. 
          Explore button }
          
        </div>
        <div className="section3" style={{ backgroundColor: 'lightpink', height: '300px' }}>

          {/* Features
          - Create your own custom recipies!
            - add ingredients, add instructions, enjoy!
          - Explore the Top latest recipies (pictures of the highest rated and latest recipies)
          - Share your recipies with the world!
          }
        }
        </div>
      </div>
      */}
      </>

      <footer>
        <Footer/>
      </footer>

    </div>
  );
}

export default Home;