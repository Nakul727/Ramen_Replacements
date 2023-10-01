import '../styles/Home.css';

function Home() {
  return (
    <div>
      <div>
          <header>
              <h2 className="float-left text-xl m-5">Logo goes here</h2>
              <h1 className="text-4xl float-left m-5">Ramen Replacements</h1>
              <h1 className="text-4xl text-center float-left m-5">Search bar</h1>
          </header>
      </div>
      <aside>
          <p>Log In</p>
          <p>Explore</p>
          <p>Find</p>
          <p>Help</p>
      </aside>
    </div>
  );
}

export default Home;
