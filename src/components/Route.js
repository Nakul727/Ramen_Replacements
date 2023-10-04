import React from 'react';
import {Routes, Route} from 'react-router-dom';

import Home from './Home.js';
import Login from './Login.js';
import Register from './Register.js';

function Main() {
  return (
    /*<Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
    </Routes>*/
    <Register/>
  );
}

export default Main;