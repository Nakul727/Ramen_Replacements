import '../styles/Home.css';
import { Header, Logo_Name, Links} from '../components/header.js';
import { Footer } from "../components/footer.js"

// only accessible when the user is logged in
// otherwise redirected to the login page

function Dashboard() {

  const header_linkData = [
    { to: '/explore', text: 'Explore' },
    { to: '/login', text: 'Login' },
  ];


  return (
    <div>
      <header>
        <Header leftChildren={<Logo_Name />} rightChildren={<Links linkData={header_linkData} />} />
      </header>

      <p class="text-center text-3xl  mt-10">Welcome to Dashboard</p>

      <footer>
        <Footer/>
      </footer>
    </div>
  );
}

export default Dashboard;