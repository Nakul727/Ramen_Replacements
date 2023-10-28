import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// Used to access the context in the pages
function useAuth() {
  return useContext(AuthContext);
}

// wrapper for authentication context
// this is passed to each page/component, see Main.js
function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));

  const login = () => {
    setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('jwt');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export {useAuth, AuthProvider};