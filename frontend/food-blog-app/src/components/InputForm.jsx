import React, { useState } from 'react'
import axios from 'axios'

export default function InputForm({setIsOpen}) {
   const [email,setEmail]=useState("")
   const [password,setPassword]=useState("")
   const [isSignUp,setIsSignUp]=useState(false) 
   const [error,setError]=useState("")

  const handleOnSubmit = async (e) => {
  e.preventDefault();
  let endpoint = isSignUp ? "user/signup" : "user/login";
  
  await axios.post(`/api/${endpoint}`, { email, password })
    .then((res) => {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setIsOpen(); // closes modal or form
    })
    .catch((data) => setError(data.response?.data?.error));
};


  return (
    <>
        <form className='form' onSubmit={handleOnSubmit}>
            <div className='form-control'>
                <label>Email</label>
                <input type="email" className='input' onChange={(e)=>setEmail(e.target.value)} required></input>
            </div>
            <div className='form-control'>
                <label>Password</label>
                <input type="password" className='input' onChange={(e)=>setPassword(e.target.value)} required></input>
            </div>
            <button style={{ backgroundColor: "#f15a29", color: "#fff", padding: "0.5rem 1rem", borderRadius: "5px" }} type='submit'>{(isSignUp) ? "Sign Up": "Login"}</button><br></br>
          { (error!="") && <h6 className='error'>{error}</h6>}<br></br>
            <p onClick={()=>setIsSignUp(pre=>!pre)}>{(isSignUp) ? "Already have an account": "Create new account"}</p>
        </form>
    </>
  )
}
