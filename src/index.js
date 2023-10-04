import React from 'react';
import ReactDOM from 'react-dom/client';

import Home from './components/Home.js';
import Login from './components/Login.js'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);