import React from 'react'
import profileImg from '../assets/profile.png'
import { useLoaderData } from 'react-router-dom'

export default function RecipeDetails() {
  const recipe = useLoaderData()
  console.log("Loaded recipe:", recipe)

  return (
    <div className='outer-container'>
      <div className='profile'>
        <img src={profileImg} width="50px" height="50px" alt="Profile" />
        <h5>{recipe.email || "Anonymous"}</h5>
      </div>

      <h3 className='title'>{recipe.title}</h3>

      <img
        src={`http://localhost:5000/api/images/${recipe.coverImage}`}
        width="220px"
        height="200px"
        alt={recipe.title}
        onError={(e) => (e.target.style.display = 'none')}
      />

      <div className='recipe-details'>
        <div className='ingredients'>
          <h4>Ingredients</h4>
          <ul>
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.map((item, i) => <li key={i}>{item}</li>)
              : recipe.ingredients?.split('\n')?.map((item, i) => <li key={i}>{item}</li>)
            }
          </ul>
        </div>

        <div className='instructions'>
          <h4>Instructions</h4>
          <ol>
            {recipe.instructions?.split('\n')?.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
