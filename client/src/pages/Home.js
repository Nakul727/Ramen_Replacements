import React from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/header.js";
import { Footer } from "../components/footer.js";
import home_img from "../assets/whitebg.svg";
import { TopHomeRecipe } from "../components/TopHomeRecipe.js";

function Home() {
  return (
    <div className="homepage">
      <header>
        <Header />
      </header>

      <div className="body_sections">
        <div className="section1 mt-32 md:mt-20 flex flex-col items-center justify-center bg-orange-200">
          <div className="flex-1 mx-4 px-4 w-full">
            <img
              src={home_img}
              alt="Platform Image"
              className="h-full w-1/2 m-auto"
            />
          </div>

          <div className="flex-1 mx-4 px-4 w-full">
            <div className="mt-1 lg:mt-10 text-center text-3xl font-arvo">
              Welcome to Ramen Replacements!
            </div>

            <Link to="/register">
              <button className="block mx-auto mt-4 mb-10 py-3 px-4 font-arvo text-gray-900 rounded-xl bg-gray-200 hover:bg-gray-400 md-hover-bg-transparent transition-all duration-200 ease-in-out">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="px-16 pb-16 pt-16 bg-amber-100">
        <div className="flex justify-center items-center">
          {/* Left Section */}
          <div className="flex-1 ml-20 p-4">
            <p className="text-lg lg:text-xl font-arvo mb-8">
              Ramen_Replacements is a platform built for college students to
              find cheap, fast, and simple recipes!
            </p>

            <p className="text-lg lg:text-xl font-arvo font-arvo_bold mb-8">
              Here you can:
            </p>

            <p className="text-md lg:text-lg font-arvo mx-10 mb-8">
              - Create your own custom recipes! <br />
              - Get automatic cost and nutrition estimates.<br />
              - Share your recipes with the world! <br />
              - Explore recipes made by others. <br />
            </p>

            <Link to="/explore">
              <button className="block mx-auto mb-10 py-3 px-4 font-arvo text-gray-900 rounded-xl bg-gray-200 hover:bg-gray-400 md-hover-bg-transparent transition-all duration-200 ease-in-out">
                View Recipes
              </button>
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex-1 p-4">
            <p className="ml-20 mb-1 font-arvo font-arvo_bold mt-20">
              Top Recipe this week:
            </p>
            <hr className="ml-20 w-48 mb-4 border border-black"></hr>
            <TopHomeRecipe />
          </div>
        </div>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
