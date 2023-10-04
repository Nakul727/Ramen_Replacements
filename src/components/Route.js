import React from 'react';
import {Routes, Route} from 'react-router-dom';

import Home from './Home.js';
import Login from './Login.js';

function Main() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
    </Routes>
  );
}

export default Main;