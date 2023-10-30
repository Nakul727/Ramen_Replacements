import { useAuth } from '../AuthContext.js';

const handleLogout = () => {
  const { logout } = useAuth();
  localStorage.removeItem('jwt');
  logout();
};

export default handleLogout;
