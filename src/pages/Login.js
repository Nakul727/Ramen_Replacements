import { Link } from "react-router-dom";
import {displayMessage} from "../components/helper.js";
import { Footer } from "../components/footer.js"
import logo_img from "../assets/logo.png"
import menu_img from "../assets/menu.png"


function Login() {
  function login_check() {
    let name_or_email = document.getElementById("name").value;
    let password = document.getElementById("pass").value;

    if (name_or_email === "" || password === "") {
      displayMessage("registration-result", "Some field(s) are empty.");
    }
    else{
      // send a GET request to api
      // LoginAuth function will authenticate user
      // route user to the dashboard and display that user was logged in.
      
      window.location.href = "/"; //placeholder link to home, will go to dashboard once connecter is finished and can call for password
    }
  }

  return (
    <div>

      <header className="bg-zinc-300 flex items-center justify-between p-5">
        <div className="flex items-center mx-5">
          <Link to="/">
            <img src={logo_img} className="h-14 w-auto mx-4" alt="Logo" />
          </Link>
          <h1 className="text-black text-4xl ml-2">Ramen Replacements</h1>
        </div>

        <div className="flex items-center mx-5">
          <img src={menu_img} className="h-12 w-12" alt="Menu" />
        </div>
      </header>


      <div className="mt-32 md:mt-48 xl:mt-60">
        <main className="form">
          <h2 className="text-center text-2xl font-bold">Log In</h2>
          <hr className="border-black"/>
          <br/>
          <section className="inline-block w-40">
            <div className="text-center">
              <label type="text">Email or Username</label>
              <br/>
              <label type="password">Password</label>
              <br/>
            </div>
          </section>
          <section className="inline-block">
            <input className="border border-solid border-black w-24 md:w-32 xl:w-40" id="name"></input>
            <br/>
            <input className="border border-solid border-black w-24 md:w-32 xl:w-40" id="pass"></input>
            <br/>
          </section>
          <div className="text-center">
            <button className="w-20 h-8 m-1 bg-stone-300"
            onClick={login_check}>Log In</button>
            <p id="registration-result"></p>
          </div>
          <Link to="/register">
            <button className="text-center w-full">
              <label className="my-1">Don't have an account? </label>
              <label className="my-1 text-blue-700">Register</label>
            </button>
          </Link>
          <br/>
          <Link to="/">
            <button className="text-center w-full">
              <p className="m-2">Cancel</p>
            </button>
          </Link>
        </main>
      </div>

      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default Login;
