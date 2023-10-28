import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./AuthContext";

import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import RecipeMaker from './pages/RecipeMaker.js'
import Explore from './pages/Explore.js';
import Recipe from './pages/RecipeCard.js';



export default function Main() {
  return (
<<<<<<< HEAD
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route>
      <Route path='/dashboard' element={<Dashboard/>}></Route>
      <Route path='/recipemaker' element={<RecipeMaker/>}></Route>
      <Route path='/recipe/:recipeID' element={<Recipe/>}></Route>
      <Route path='/explore' element={<Explore/>}></Route>
    </Routes>
=======
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/dashboard' element={<Dashboard />}></Route>
        <Route path='/explore' element={<Explore />}></Route>
      </Routes>
    </AuthProvider>
>>>>>>> bdbbe7b2ac16af503f235025ceb85f2158f48613
  );
}