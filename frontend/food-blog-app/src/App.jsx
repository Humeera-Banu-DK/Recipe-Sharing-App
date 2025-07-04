import React from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './pages/Home'
import MainNavigation from './components/MainNavigation'
import axios from 'axios'
import AddFoodRecipe from './pages/AddFoodRecipe'
import EditRecipe from './pages/EditRecipe'
import RecipeDetails from './pages/RecipeDetails'

// 🔄 Loader: Fetch all recipes
const getAllRecipes = async () => {
  try {
    const res = await axios.get('/api/recipe')
    return res.data
  } catch (err) {
    console.error("Failed to fetch all recipes", err)
    return []
  }
}

// 🔄 Loader: Fetch recipes created by logged-in user
const getMyRecipes = async () => {
  const user = JSON.parse(localStorage.getItem("user"))
  if (!user) return []
  const allRecipes = await getAllRecipes()
  return allRecipes.filter(item => item.createdBy === user._id)
}

// 🔄 Loader: Fetch favorite recipes from localStorage
const getFavRecipes = () => {
  return JSON.parse(localStorage.getItem("fav")) || []
}

// 🔄 Loader: Fetch a single recipe (with optional author email)
const getRecipe = async ({ params }) => {
  try {
    const res = await axios.get(`/api/recipe/${params.id}`)
    let recipe = res.data

    // If recipe has a createdBy field, fetch user email
    if (recipe.createdBy) {
      const userRes = await axios.get(`/api/user/${recipe.createdBy}`)
      recipe = { ...recipe, email: userRes.data.email }
    }

    return recipe
  } catch (err) {
    console.error("Failed to fetch single recipe", err)
    throw new Response("Recipe not found", { status: 404 })
  }
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainNavigation />,
    children: [
      { path: "/", element: <Home />, loader: getAllRecipes },
      { path: "/myRecipe", element: <Home />, loader: getMyRecipes },
      { path: "/favRecipe", element: <Home />, loader: getFavRecipes },
      { path: "/addRecipe", element: <AddFoodRecipe /> },
      { path: "/editRecipe/:id", element: <EditRecipe /> },
      { path: "/recipe/:id", element: <RecipeDetails />, loader: getRecipe }
    ]
  }
])

export default function App() {
  return (
    <RouterProvider router={router} />
  )
}
