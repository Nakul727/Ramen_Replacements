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
      <div class="form">
          <h2>Register</h2>
          <hr/><br/>
          <label for="type">Username</label>
          <input id="register-name" name="name" type="text"></input>
          <br/><br/>
          <label for="name">Email</label>
          <input id="register-email" name="email" type="text"></input>
          <br/><br/>
          <label for="name">Password</label>
          <input id="register-pass" name="pass" type="password"></input>
          <br/><br/>
          <label for="name">Confirm</label>
          <input id="register-pass-confirm" name="pass-confirm" type="password"></input>
          <br/><br/>
          <button id="register-submit" type="submit">Submit</button>
          <br/><br/>
      <p id="registeration-result"></p>
      </div>
    </div>
  );
}

export default Register;