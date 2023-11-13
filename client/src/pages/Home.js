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
        <div className="section1 mt-32 md:mt-20 flex flex-col items-center justify-center bg-zinc-200 h-[22rem] 
        xl:h-[27rem]">
          <div className="flex-1 mx-4 px-4 w-full" style={{ backgroundColor: 'pink' }}>
            <img
              src={home_img}
              alt="Platform Image"
              className="h-full w-1/2 m-auto"
            />
          </div> 
          <div className="flex-1 mx-4 px-4 w-full" style={{ backgroundColor: 'pink' }}>

            <div className="mt-1 lg:mt-10 text-center text-3xl font-arvo 
            font-semibold">Welcome to Ramen Replacements!</div>

              <Link to="/register">
              <button className="block mx-auto mt-4 mb-10 py-3 px-4 font-arvo 
              text-gray-900 rounded-xl bg-gray-200 hover:bg-gray-400 md-hover-bg-transparent 
              transition-all duration-200 ease-in-out">Sign Up</button>
              </Link>

          </div>

        </div>
      </div>

      <div className="section2 h-40 md:h-32">

        {/* Why ramen replacements?
          - Who this platform is for. 
          Explore button } */}
          <div className="m-10">
            <p className="text-ld text-center lg:text-xl font-arvo">Welcome to Ramen_Replacements, 
            the best platform for cheap, fast and simple recipes! <br/>
            Many recipes are waiting for you to explore!
            </p>
            <Link to="/explore">
              <button className="block mx-auto mt-4 mb-10 py-3 px-8 font-arvo 
              text-gray-900 rounded-xl bg-green-300 hover:bg-green-600 md-hover-bg-transparent 
              transition-all duration-200 ease-in-out">View Recipes!</button>
            </Link>
          </div>

      </div>
      <div className="section3" style={{ backgroundColor: 'lightgrey', height: '300px' }}>
        {/* 
        Features
          - Create your own custom recipies!
          - add ingredients, add instructions, enjoy!
          - Explore the Top latest recipies (pictures of the highest rated and latest recipies)
          - Share your recipies with the world! */}
          <div className="pt-10 my-10 w-11/12 md:w-7/12 xl:w-5/12 mx-auto">
            <p className="text-lg lg:text-xl font-arvo">
            What you can do here: </p>
            <p className="text-md lg:text-lg font-arvo mx-10">
            - Create your own custom recipies! <br/>
            - add ingredients, add instructions, enjoy! <br/>
            - Explore the Top latest recipies <br/>
            - Share your recipies with the world! <br/>
            </p>
            <Link to="/login">
              <button className="block mx-auto mt-4 mb-10 py-3 px-8 font-arvo 
              text-gray-900 rounded-xl bg-green-300 hover:bg-green-600 md-hover-bg-transparent 
              transition-all duration-200 ease-in-out">Get Started!</button>
            </Link>
          </div>
      </div>





      <footer>
        <Footer />
      </footer>

    </div>
  );
}

export default Home;