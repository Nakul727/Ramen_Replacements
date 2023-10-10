
import { Link } from "react-router-dom";
import {displayMessage, hideMessage} from "../components/helper.js";

import { Header } from "../components/header.js"
import { Footer } from "../components/footer.js"

function Login() {
  function login_check() {
    let name_or_email = document.getElementById("name").value;
    let password = document.getElementById("pass").value;

    if (name_or_email === "" || password === "") {
      displayMessage("registration-result", "Some field(s) are empty.");
    }
  }

  return (
    <div>
      <header class="homeheader">
        <Header/>
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