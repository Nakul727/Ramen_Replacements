import '../styles/Register.css';
import { Link } from "react-router-dom";
import {displayMessage, hideMessage} from "./helper.js";


function Register() {
  async function register_user(name, email, pass) {
      try {
      // Make a POST request to the Go API for creating a user at /acc/create endpoint
      // if the registration was successful, display the response from the API
      // otherwise display an error message and say that profile couldnt be registered
          
          const response = await fetch("http://localhost:8080/acc/create", {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify({ username: name, email: email, password: pass }),
          });
          if (response.ok) {
              const result = await response.text();
              displayMessage("registration-result", "Profile Registered");
          } else {
              const errorData = await response.json();
              displayMessage("registration-result", errorData.error);
          }
      } catch (error) {
      // If the API couldn't be contacted
      // display the error message to the User
          displayMessage("registration-result","API could not be contacted.");
      }
  }
  
  function submit() {
    let name = document.getElementById("register-name").value;
    let email = document.getElementById("register-email").value;
    let pass = document.getElementById("register-pass").value;
    let pass_confirm = document.getElementById("register-pass-confirm").value;

    // make sure that the fields are not empty (*)
    // password encryption and user authentication - JWT tokens
    // Check if the passwords match
    if (name === "" || email === "" || pass === "" || pass_confirm === "") {
      displayMessage("registration-result", "Some field(s) are empty.");
    } else {
      if (pass !== pass_confirm) {
          displayMessage("registration-result", "Passwords do not match.");
          return;
      } else {
          hideMessage("registration-result");
      }
      register_user(name, email, pass);
    }
  }

  
  return (
    <div className="mt-60">
      <main className="h-24 w-3/12 m-auto">
        <h2 className="text-center text-2xl font-bold">Register</h2>
        <hr className="border-black"/>
        <br/>
        <section className="inline-block w-40">
          <div className="text-center">
            <label for="type">Username</label>
            <br/>
            <label for="name">Email</label>
            <br/>
            <label for="name">Password</label>
            <br/>
            <label for="name">Confirm</label>
            <br/>
          </div>
        </section>
        <section className="inline-block">
          <input id="register-name" name="name" type="text" 
          className="border border-solid border-black"></input>
          <br/>
          <input id="register-email" name="email" type="text"
          className="border border-solid border-black"></input>
          <br/>
          <input id="register-pass" name="pass" type="password"
          className="border border-solid border-black"></input>
          <br/>
          <input id="register-pass-confirm" name="pass-confirm" type="password"
          className="border border-solid border-black"></input>
          <br/>
        </section>
        <div className="text-center">
          <button type="submit" className="w-20 h-8 m-1 bg-stone-300"
          onClick={submit}>Submit</button>
          <p id="registration-result"></p>
        </div>

        <Link to="/login">
          <button className="text-center w-full">
            <p className="m-1">Already have an account? Log In</p>
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
  );
}

export default Register;