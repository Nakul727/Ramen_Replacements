import { useAuth } from '../AuthContext.js';

// function to extract userInfo from the JWT token
// stored at the client local storage

const getUserInfo = () => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return null;
  }

  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    return null;
  }

  const tokenParts = jwt.split('.');
  if (tokenParts.length !== 3) {
    return null;
  }

  try {
    const payload = JSON.parse(atob(tokenParts[1]));
    return payload;
  } catch (error) {
    console.error('Failed to decode JWT token:', error);
    return null;
  }
};

export { getUserInfo };
