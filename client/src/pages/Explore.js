import '../styles/Home.css';
import { Header, Logo_Name, Links } from '../components/header.js';
import { Footer } from "../components/footer.js"

function Explore() {

  const header_linkData = [
    { to: '/explore', text: 'Explore' },
    { to: '/login', text: 'Login' },
  ];

  return (
    <div className="explorepage">
      <header>
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
      </header>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Explore;