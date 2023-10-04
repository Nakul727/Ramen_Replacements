
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="mt-60">
      <main className="h-24 w-3/12 m-auto">
        <h2 className="text-center">Log In</h2>
        <hr className="border-black"/>
        <section className="inline-block w-40">
          <div className="text-center">
            <label>Email or Username</label>
            <br/>
            <label type="password">Password</label>
            <br/>
          </div>
        </section>
        <section className="inline-block">
          <input className="border border-solid border-black"></input>
          <br/>
          <input className="border border-solid border-black"></input>
          <br/>
        </section>
        <div className="text-center">
          <button className="w-20 h-8 m-1 bg-stone-300">Log In</button>
        </div>
        <Link to="/register">
          <button className="text-center w-full">
            <p className="m-1">Don't have an account? Register</p>
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

export default Login;