import { Link } from "react-router-dom";
import { displayMessage } from "../components/helper.js";
import { Footer } from "../components/footer.js"
import { Header, Logo_Name, Links } from '../components/header.js';



function Login() {

  const header_linkData = [];


  function login_check() {
    let name_or_email = document.getElementById("name").value;
    let password = document.getElementById("pass").value;

    if (name_or_email === "" || password === "") {
      displayMessage("registration-result", "Some field(s) are empty.");
    }
    else {
      // send post request to authenticate user
      // once user is authenticated, open new page or generate page 
      // page code is in dashboard.js
    }
  }


  return (
    <div>

      <header>
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
      </header>



      <div className="body_sections">

        {/* Main Form Section */}
        <div className="form" style={{ backgroundColor: 'lightblue', height: '300px' }}>
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
            <input className="border border-solid border-black w-24 md:w-32 xl:w-40" id="name"></input>
            <br />
            <input className="border border-solid border-black w-24 md:w-32 xl:w-40" id="pass"></input>
            <br />
          </section>
          <div className="text-center">
            <button className="w-20 h-8 m-1 bg-stone-300"
              onClick={login_check}>Log In</button>
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
            <br />
            <Link to="/">
              <button className="text-center w-full">
                <p className="m-2">Cancel</p>
              </button>
            </Link>
          </div>
          

        </div>
      </div>



      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Login;