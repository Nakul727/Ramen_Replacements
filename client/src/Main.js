import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthProvider } from './AuthContext';
import Home from './pages/Home.js';
import Login from './pages/Login.js';
import Register from './pages/Register.js';
import Dashboard from './pages/Dashboard.js';
import Explore from './pages/Explore.js';
import Recipe from './pages/RecipeCard.js';
import RecipeMaker from './pages/RecipeMaker.js';

export default function Main() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/recipe/:recipeID" element={<Recipe />}></Route>
        <Route path="/explore/recipe/:recipeID" element={<Recipe />}></Route>
        <Route path="/explore" element={<Explore />}></Route>
        <Route path="/recipemaker" element={<RecipeMaker />}></Route>
      </Routes>
    </AuthProvider>
  );
}
