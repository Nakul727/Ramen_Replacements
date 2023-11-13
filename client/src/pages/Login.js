import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/header.js";
import { displayMessage } from "../components/helper.js";
import { Footer } from "../components/footer.js";
import { useAuth } from "../AuthContext.js";

function Login() {

  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  // If the user is already logged in
  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      login();
    }
  }, []);

  // form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // errors
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // main handler function
  const handleLogin = async () => {

    let hasErrors = false;

    // check for field errors
    if (username === "") {
      setUsernameError("Username field is empty.");
      hasErrors = true;
    } else {
      setUsernameError("");
    }

    if (password === "") {
      setPasswordError("Password field is empty.");
      hasErrors = true;
    } else {
      setPasswordError("");
    }


    // if their are field errors, dont make the API call and prompt user to solve error
    // otherwise, call the backend and authenticate user with the information
    // if there are errors thrown from the backend, display them

    if (hasErrors) {
      displayMessage("registration-result", "Please fill in all required fields.");
      return;
    }

    try {
      const backendApi = process.env.REACT_APP_BACKEND;
      const response = await fetch(`${backendApi}/acc/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });
      if (response.ok) {
        const data = await response.json();
        const jwt = data.token;
        localStorage.setItem("jwt", jwt);
        displayMessage("registration-result", "Logging In...");

        setTimeout(() => {
          login();
          navigate("/dashboard");
        }, 2000);
      } else {
        displayMessage("registration-result", "Authentication failed. Please check your credentials or sign up.");
      }
    } catch (error) {
      displayMessage("registration-result", "API could not be contacted.");
    }
  }

  return (
    <div>
      <header>
        <Header />
      </header>

      {isLoggedIn ? (
        <div className="body-sections">
          <div className="mt-40">
              You are already logged in
          </div>

        </div>
      ) : (
        <div className="body_sections overflow-hidden pt-20">
          <div className="Form py-20 mx-56 mb-12 rounded-3xl" style={{ backgroundColor: "lightgrey" }}>
            <div>
              <p className="font-arvo text-3xl text-center">Ramen Replacements</p>
              <p className="font-arvo mt-2 text-sm text-center">Sign in to access your account</p>
            </div>

            <div className="px-32 mt-24">
              <label htmlFor="username" className={`font-arvo text-sm text-gray-600 mb-2 ${usernameError ? "text-red-500" : ""}`}>Username*</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`block rounded-xl w-full h-12 px-4 ${usernameError ? "border-red-500" : "border-gray-300"} focus:outline-none focus-border-indigo-500 text-gray-700`}
              />
              {usernameError && <p className="text-red-500 text-xs mt-1 font-arvo">{usernameError}</p>}
            </div>

            <div className="px-32 mt-4">
              <label htmlFor="password" className={`font-arvo text-sm text-gray-600 mb-2 ${passwordError ? "text-red-500" : ""}`}>Password*</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`block rounded-xl w-full h-12 px-4 ${passwordError ? "border-red-500" : "border-gray-300"} focus:outline-none focus-border-indigo-500 text-gray-700`}
              />
              {passwordError && <p className="text-red-500 text-xs mt-1 font-arvo">{passwordError}</p>}
            </div>

            <div className="text-center font-arvo text-red-900 mt-10" id="registration-result"></div>

            <div className="flex items-center justify-center my-8">
              <button className="font-arvo bg-white hover:bg-slate-200 rounded-xl px-12 py-4" onClick={handleLogin}>Log In</button>
            </div>

            <div className="flex items-center justify-center font-arvo text-base">
              <p className="mr-1">Don't have an account?</p>
              <Link to="/register" className="text-blue-800 hover:underline">Signup</Link>
            </div>
          </div>
        </div>
      )}

      <footer>
        <Footer />
      </footer>

    </div >
  );
}

export default Login;
