import '../styles/Home.css';
import { Header } from '../components/header.js'
import { Footer } from "../components/footer.js"
import home_img from "../assets/whitebg.svg"
import { Link } from 'react-router-dom';




function Home() {

  return (
    <div className="homepage">

      <header>
        <Header />
      </header>


      <div className='body_sections'>
        <div className="section1 flex items-center justify-center bg-zinc-200 h-[40rem]">
{/* 
          Text Section
          <div className="flex-1 mx-4 px-4" style={{ backgroundColor: 'pink' }}>

            <div className="mt-10 text-center text-3xl font-arvo font-semibold">Welcome to Ramen Replacements</div>

            <Link to="/register">
            <button className="mt-4 mb-10 py-3 px-4 font-arvo text-gray-900 rounded-xl bg-gray-200 hover:bg-gray-400 md-hover-bg-transparent transition-all duration-200 ease-in-out">Sign Up</button>
            </Link>

          </div>

          Image Section
          <div className="flex-1 mx-4 px-4" style={{ backgroundColor: 'pink' }}>
            <img
              src={home_img}
              alt="Platform Image"
              className="h-full w-full object-cover"
            />
          </div> 
*/}

        </div>
      </div>



      <div className="section2" style={{ backgroundColor: 'white', height: '700px' }}>

        {/* Why ramen replacements?
          - Who this platform is for. 
          Explore button } */}

      </div>
      <div className="section3" style={{ backgroundColor: 'lightgrey', height: '700px' }}>
        {/* 
        Features
          - Create your own custom recipies!
          - add ingredients, add instructions, enjoy!
          - Explore the Top latest recipies (pictures of the highest rated and latest recipies)
          - Share your recipies with the world! */}
      </div>





      <footer>
        <Footer />
      </footer>

    </div>
  );
}

export default Home;