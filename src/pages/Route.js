import React from 'react';
import {Routes, Route} from 'react-router-dom';

import Home from './Home.js';
import Login from './Login.js';
import Register from './Register.js';
import Dashboard from './Dashboard.js';


function Main() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
    </Routes>
  );
}

export default Main;