import { Link } from "react-router-dom";
import { Header, Logo_Name, Links } from '../components/header.js';
import { displayMessage, hideMessage } from "../components/helper.js";
import { Footer } from "../components/footer.js"
import { useNavigate } from 'react-router-dom';


function Register() {

  const navigate = useNavigate();

  const header_linkData = [
    { to: '/explore', text: 'Explore' },
    { to: '/login', text: 'Login' },
  ];

  async function register_user(name, email, pass, pfp) {
    try {
      const backendApi = process.env.REACT_APP_BACKEND;
      const response = await fetch(`${backendApi}/acc/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: name, email: email, password: pass, pfp: pfp }),
      });
      if (response.ok) {
        displayMessage("registration-result", "Profile Registered");

        setTimeout(() => {
          navigate('/login');
        }, 2000);

      } else {
        const errorData = await response.json();
        displayMessage("registration-result", errorData.error);
      }
    } catch (error) {
      displayMessage("registration-result", "API could not be contacted.");
    }
  }

  function submit() {
    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let pfp = document.getElementById("register-pfp").value;
    let pass = document.getElementById("register-pass").value;
    let pass_confirm = document.getElementById("register-pass-confirm").value;

    if (name === "" || email === "" || pass === "" || pass_confirm === "") {
      displayMessage("registration-result", "Some field(s) are empty.");
    } else {
      if (pass !== pass_confirm) {
        displayMessage("registration-result", "Passwords do not match.");
        return;
      } else {
        hideMessage("registration-result");
      }
      register_user(name, email, pass, pfp);
    }
  }


  return (
    <div>

      <header>  
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
      </header>

      <div className="mt-32 md:mt-48 xl:mt-60">
        <main className="form">
          <h2 className="text-center text-2xl font-bold">Register</h2>
          <hr className="border-black" />
          <br />
          <section className="inline-block w-40">
            <div className="text-center">
              <label for="type">Username</label>
              <br />
              <label for="name">Email</label>
              <br />
              <label for="type">Profile Picture</label>
              <br />
              <label for="name">Password</label>
              <br />
              <label for="name">Confirm Password</label>
              <br />
            </div>
          </section>
          <section className="inline-block">
            <input id="register-name" name="name" type="text"
              className="border border-solid border-black w-24 md:w-32 xl:w-40"></input>
            <br />
            <input id="register-email" name="email" type="text"
              className="border border-solid border-black w-24 md:w-32 xl:w-40"></input>
            <br />
            <input id="register-pfp" name="pfp" type="text"
              className="border border-solid border-black w-24 md:w-32 xl:w-40"></input>
            <br />
            <input id="register-pass" name="pass" type="password"
              className="border border-solid border-black w-24 md:w-32 xl:w-40"></input>
            <br />
            <input id="register-pass-confirm" name="pass-confirm" type="password"
              className="border border-solid border-black w-24 md:w-32 xl:w-40"></input>
            <br />
          </section>
          <div className="text-center">
            <button type="submit" className="w-20 h-8 m-1 bg-stone-300"
              onClick={submit}>Submit</button>
            <p id="registration-result"></p>
          </div>

          <Link to="/login">
            <button className="text-center w-full">
              <label className="m-1">Already have an account?</label>
              <label className="my-1 text-blue-700">Log In</label>
            </button>
          </Link>
          <br />
          <Link to="/">
            <button className="text-center w-full">
              <p className="m-2">Cancel</p>
            </button>
          </Link>
        </main>
      </div>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Register;