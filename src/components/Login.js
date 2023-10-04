import '../styles/Login.css';

function Login() {
  return (
    <div className="mt-60">
      <main className="h-24 w-3/12 m-auto">
        <h2>Log In</h2>
        <hr/>
        <section className="inline-block w-40">
          <div className="text-center">
            <label>Email or Username</label>
            <br/>
            <label type="password">Password</label>
            <br/>
          </div>
        </section>
        <section className="inline-block">
          <input></input>
          <br/>
          <input></input>
          <br/>
        </section>
        <div className="text-center">
          <button className="w-20 h-8 m-1 bg-stone-300">Log In</button>
        </div>
      </main>
    </div>
  );
}

export default Login;