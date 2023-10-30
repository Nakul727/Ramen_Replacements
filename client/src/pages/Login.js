import React, { useState, useEffect } from "react";
import { Link , useNavigate } from 'react-router-dom';
import { Footer } from "../components/footer.js";
import { Header, Logo_Name, Links } from "../components/header.js";
import { useAuth } from "../AuthContext.js";
import { displayMessage } from "../components/helper.js";

function Login() {

  const header_linkData = [];

  // Login Information as React states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // authentication context updater function login/logout
  const { login, logout } = useAuth();

  // Check if the user is already logged in
  // If yes, set the authentication context as logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      login();
    }
  }, []);



  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');

  
  // Main Login function
  const handleLogin = async () => {
    if (email === "" || password === "") {
      displayMessage("registration-result", "Some field(s) are empty.");
      return;
    } else {
      try {
        const backendApi = process.env.REACT_APP_BACKEND;
        const response = await fetch(`${backendApi}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
          // Store the JWT in local storage
          // Set the logged-in state in the authentication context
          const jwt = await response.text();
          localStorage.setItem('jwt', jwt);
          login();


          setSuccessMessage('Successfully logged in!');
          setTimeout(() => {
            setSuccessMessage('');
            navigate('/dashboard');
          }, 2000); // Redirect after 2 seconds



        } else {
          displayMessage("registration-result", "Authentication failed.");
        }
      } catch (error) {
        displayMessage("registration-result", "API could not be contacted.");
      }
    }
  }

  return (
    <div>
      <header>
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
      </header>

      <div className="body_sections">

        <div className="section1" style={{ backgroundColor: 'lightblue', height: '300px' }}>

          {/* Form Contents */}
          <h2 className="text-center text-2xl font-bold">Log In</h2>
          <hr className="border-black" />
          <br />
          <section className="inline-block w-40">
            <div className="text-center">
              <label type="text">Email or Username</label>
              <br />
              <label type="password">Password</label>
              <br />
            </div>
          </section>
          <section className="inline-block">
            <input
              className="border border-solid border-black w-24 md:w-32 xl:w-40"
              id="name"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
            <br />
            <input
              className="border border-solid border-black w-24 md:w-32 xl:w-40"
              id="pass"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
            <br />
          </section>
          <div className="text-center">
            <button className="w-20 h-8 m-1 bg-stone-300" onClick={handleLogin}>
              Log In
            </button>
          </div>

          {/* Error Messages */}
          <div>
            <p id="registration-result"></p>
          </div>

          {/* Link to Register */}
          <div>
            <Link to="/register">
              <button className="text-center w-full">
                <label className="my-1">Don't have an account? </label>
                <label className="my-1 text-blue-700">Register</label>
              </button>
            </Link>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="text-center text-green-500">{successMessage}</div>
          )}


        </div>
      </div>

      <footer>
        <Footer />
      </footer>

    </div>
  );
}

export default Login;