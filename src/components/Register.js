import '../styles/Register.css';
import { Link } from "react-router-dom";
import {displayMessage, hideMessage} from "./helper.js";


function Register() {
    async function register_user(name, email, pass) 
  {
      try 
    {
      // Make a POST request to the Go API for creating a user at /acc/create endpoint
      // if the registeration was successful, display the response from the API
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
              displayMessage("registeration-result", "Profile Registered");
          } else {
              const errorData = await response.json();
              displayMessage("registeration-result", errorData.error);
          }
      } 
    catch (error) 
    {
      // If the API couldn't be contacted
      // display the error message to the User
          displayMessage("registeration-result","API could not be contacted.");
      }
  }
  
  window.onload = () => {
    let submit_button = document.getElementById("register-submit");

    submit_button.onclick = async () => {
        let name = document.getElementById("register-name").value;
        let email = document.getElementById("register-email").value;
        let pass = document.getElementById("register-pass").value;
        let pass_confirm = document.getElementById("register-pass-confirm").value;

        // make sure that the fields are not empty (*)
        // password encryption and user authentication - JWT tokens

        // Check if the passwords match
        if (pass !== pass_confirm) {
            displayMessage("registeration-result","Passwords do not match.");
            return;
        } else {
            hideMessage("registeration-result");
        }
        register_user(name, email, pass);
    };
  };
  
  return (
    <div id="background">
      <div className="form">
        <h2 className="text-xl font-bold">Register</h2>
        <hr className="border-black"/><br/>
        <label for="type">Username</label>
        <input id="register-name" name="name" type="text" 
        className="mx-1 border border-black border-solid"></input>
        <br/><br/>
        <label for="name">Email</label>
        <input id="register-email" name="email" type="text"
        className="mx-1 border border-black border-solid"></input>
        <br/><br/>
        <label for="name">Password</label>
        <input id="register-pass" name="pass" type="password"
        className="mx-1 border border-black border-solid"></input>
        <br/><br/>
        <label for="name">Confirm</label>
        <input id="register-pass-confirm" name="pass-confirm" type="password"
        className="mx-1 border border-black border-solid"></input>
        <br/><br/>
        <button id="register-submit" type="submit"
        className="w-20 h-8 m-1 bg-stone-300">Submit</button>
        <br/><br/>
        <p id="registeration-result"></p>
      </div>
    </div>
  );
}

export default Register;