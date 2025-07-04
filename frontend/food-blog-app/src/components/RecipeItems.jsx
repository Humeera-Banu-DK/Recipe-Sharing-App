import React, { useEffect, useState } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router-dom'
import { BsStopwatchFill } from "react-icons/bs";
import { FaHeart } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import axios from 'axios';

export default function RecipeItems() {
  const recipes = useLoaderData()
  const [allRecipes, setAllRecipes] = useState([])
  const [isFavRecipe, setIsFavRecipe] = useState(false)
  const navigate = useNavigate()

  let path = window.location.pathname === "/myRecipe"
  let favItems = JSON.parse(localStorage.getItem("fav")) ?? []

  useEffect(() => {
    setAllRecipes(recipes)
  }, [recipes])

  const onDelete = async (id) => {
  try {
    await axios.delete(`/api/recipe/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    });

    // Update UI
    setAllRecipes(recipes => recipes.filter(recipe => recipe._id !== id));

    let filterItem = favItems.filter(recipe => recipe._id !== id);
    localStorage.setItem("fav", JSON.stringify(filterItem));
  } catch (err) {
    console.error("Failed to delete recipe", err);
    alert("Not authorized to delete this recipe");
  }
};


  const favRecipe = (item) => {
    let exists = favItems.some(recipe => recipe._id === item._id)
    favItems = exists
      ? favItems.filter(recipe => recipe._id !== item._id)
      : [...favItems, item]
    localStorage.setItem("fav", JSON.stringify(favItems))
    setIsFavRecipe(prev => !prev)
  }

  return (
    <div className='card-container'>
      {allRecipes?.map((item, index) => (
        <div key={index} className='card' onDoubleClick={() => navigate(`/recipe/${item._id}`)}>
          <img
            src={`http://localhost:5000/api/images/${item.coverImage}`}
            width="120px"
            height="100px"
            alt={item.title}
            onError={(e) => (e.target.style.display = 'none')}
          />
          <div className='card-body'>
            <div >{item.title}</div>
            <div className='icons'>
              <div className='timer'><BsStopwatchFill /> {item.time}</div>
              {!path ? (
                <FaHeart
                  onClick={() => favRecipe(item)}
                  style={{ color: favItems.some(res => res._id === item._id) ? "red" : "" }}
                />
              ) : (
                <div className='action'>
                  <Link to={`/editRecipe/${item._id}`} className="editIcon"><FaEdit /></Link>
                  <MdDelete onClick={() => onDelete(item._id)} className='deleteIcon' />
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
