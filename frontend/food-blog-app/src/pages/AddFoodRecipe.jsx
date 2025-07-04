import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AddFoodRecipe() {
  const [recipeData, setRecipeData] = useState({})
  const navigate = useNavigate()

  const onHandleChange = (e) => {
    let val
    if (e.target.name === "ingredients") {
      val = e.target.value.split(",")
    } else if (e.target.name === "coverImage") {
      val = e.target.files[0]
    } else {
      val = e.target.value
    }
    setRecipeData(prev => ({ ...prev, [e.target.name]: val }))
  }

  const onHandleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("title", recipeData.title)
    formData.append("time", recipeData.time)
    formData.append("instructions", recipeData.instructions)
    formData.append("email", JSON.parse(localStorage.getItem("user"))?.email || "")
    formData.append("ingredients", recipeData.ingredients?.join("\n") || "")
    formData.append("coverImage", recipeData.coverImage)

    try {
      await axios.post('/api/recipe', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      })
      navigate("/")
    } catch (error) {
      console.error("Error adding recipe:", error)
    }
  }

  return (
    <div className='container'>
      <form className='form' onSubmit={onHandleSubmit}>
        <div className='form-control'>
          <label>Title</label>
          <input type="text" className='input' name="title" onChange={onHandleChange} />
        </div>

        <div className='form-control'>
          <label>Time</label>
          <input type="text" className='input' name="time" onChange={onHandleChange} />
        </div>

        <div className='form-control'>
          <label>Ingredients (comma separated)</label>
          <textarea name="ingredients" rows="5" className='input-textarea' onChange={onHandleChange} />
        </div>

        <div className='form-control'>
          <label>Instructions</label>
          <textarea name="instructions" rows="5" className='input-textarea' onChange={onHandleChange} />
        </div>

        <div className='form-control'>
          <label>Recipe Image</label>
          <input type="file" className='input' name="coverImage" onChange={onHandleChange} />
        </div>

        <button style={{ backgroundColor: "#f15a29", color: "#fff", padding: "0.5rem 1rem", borderRadius: "5px" }} type="submit">Add Recipe</button>
      </form>
    </div>
  )
}
