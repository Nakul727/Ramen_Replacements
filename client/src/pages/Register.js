import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "../components/header.js";
import { displayMessage } from "../components/helper.js";
import { Footer } from "../components/footer.js";
import { useAuth } from "../AuthContext.js";

function Register() {

  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  // constants
  const maxNameLen = 50;
  const minPasswordLen = 3;
  const maxPasswordLen = 20;

  // react hook states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pfp, setPfp] = useState("");
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");
  const [passConfirmError, setPassConfirmError] = useState("");

  // main handler function
  const register_user = async () => {
    let hasErrors = false;

    if (name === "") {
      setUsernameError("Username is required.");
      hasErrors = true; // Set the flag to true
    } else if (name.length > maxNameLen) {
      setUsernameError("Username is too long.");
      hasErrors = true; // Set the flag to true
    } else {
      setUsernameError("");
    }

    if (email === "") {
      setEmailError("Email is required.");
      hasErrors = true; // Set the flag to true
    } else {
      setEmailError("");
    }

    if (pass === "" || passConfirm === "") {
      setPassError("Passwords are required.");
      setPassConfirmError("Passwords are required.");
      hasErrors = true; // Set the flag to true
    } else if (pass !== passConfirm) {
      setPassError("Passwords do not match.");
      setPassConfirmError("Passwords do not match.");
      hasErrors = true; // Set the flag to true
    } else if (pass.length < minPasswordLen) {
      setPassError("Password is too short.");
      setPassConfirmError("Password is too short.");
      hasErrors = true; // Set the flag to true
    } else if (pass.length > maxPasswordLen) {
      setPassError("Password is too long.");
      setPassConfirmError("Password is too long.");
      hasErrors = true; // Set the flag to true
    } else {
      setPassError("");
      setPassConfirmError("");
    }

    if (hasErrors) {
      // Display validation errors and prevent registration
      displayMessage("registration-result", "Please resolve the field erros.");
      return;
    }

    // Validation passed, proceed with registration
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
          navigate("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        displayMessage("registration-result", errorData.error);
      }
    } catch (error) {
      displayMessage("registration-result", "API could not be contacted.");
    }
  };

  return (
    <div>
      <header>
        <Header />
      </header>

      {isLoggedIn ? (
        <div className="body_sections">
          <div className="mt-40">
            You are already logged in
          </div>
        </div>
      ) : (
        <div className="body_sections overflow-hidden pt-20">
          <div className="Form py-20 mx-56 mb-12 rounded-3xl" style={{ backgroundColor: "lightgrey" }}>
            <div>
              <p className="font-arvo text-3xl text-center">Ramen Replacements</p>
              <p className="font-arvo mt-2 text-sm text-center">Create a new account</p>
            </div>

            <div className="px-32 mt-24">
              <label htmlFor="name" className={`font-arvo text-sm text-gray-600 mb-2 ${usernameError ? "text-red-500" : ""}`}>
                Username*
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`block rounded-xl w-full h-12 px-4 ${usernameError ? "border-red-500" : "border-gray-300"} focus:outline-none focus-border-indigo-500 text-gray-700`}
              />
              {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
            </div>

            <div className="px-32 mt-4">
              <label htmlFor="email" className={`font-arvo text-sm text-gray-600 mb-2 ${emailError ? "text-red-500" : ""}`}>
                Email*
              </label>
              <input
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`block rounded-xl w-full h-12 px-4 ${emailError ? "border-red-500" : "border-gray-300"} focus:outline-none focus-border-indigo-500 text-gray-700`}
              />
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
            </div>

            <div className="px-32 mt-4">
              <label htmlFor="pfp" className="font-arvo text-sm text-gray-600 mb-2">
                Profile Picture
              </label>
              <input
                id="pfp"
                type="text"
                value={pfp}
                onChange={(e) => setPfp(e.target.value)}
                className="block rounded-xl w-full h-12 px-4 border border-gray-300 focus:outline-none focus-border-indigo-500 text-gray-700"
              />
            </div>

            <div className="px-32 mt-4">
              <label htmlFor="pass" className={`font-arvo text-sm text-gray-600 mb-2 ${passError ? "text-red-500" : ""}`}>
                Password*
              </label>
              <input
                id="pass"
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                className={`block rounded-xl w-full h-12 px-4 ${passError ? "border-red-500" : "border-gray-300"} focus:outline-none focus-border-indigo-500 text-gray-700`}
              />
              {passError && <p className="text-red-500 text-sm">{passError}</p>}
            </div>

            <div className="px-32 mt-4">
              <label htmlFor="pass-confirm" className={`font-arvo text-sm text-gray-600 mb-2 ${passConfirmError ? "text-red-500" : ""}`}>
                Confirm Password*
              </label>
              <input
                id="pass-confirm"
                type="password"
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.target.value)}
                className={`block rounded-xl w-full h-12 px-4 ${passConfirmError ? "border-red-500" : "border-gray-300"} focus:outline-none focus-border-indigo-500 text-gray-700`}
              />
              {passConfirmError && <p className="text-red-500 text-sm">{passConfirmError}</p>}
            </div>

            <div className="text-center font-arvo text-red-900 mt-10" id="registration-result"></div>

            <div className="flex items-center justify-center my-8">
              <button className="font-arvo bg-white hover-bg-slate-200 rounded-xl px-12 py-4" onClick={register_user}>
                Register
              </button>
            </div>

            <div className="flex items-center justify-center font-arvo text-base">
              <p className="mr-1">Already have an account?</p>
              <Link to="/login" className="text-blue-800 hover-underline">
                Log In
              </Link>
            </div>
          </div>
        </div>
      )}

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Register;