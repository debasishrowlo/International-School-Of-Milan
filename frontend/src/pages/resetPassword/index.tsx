import { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSelector } from "react-redux";
const ResetPassword = () => {
  const { user } = useSelector((state: any) => state.auth)
  const [data, setData] = useState({
    newPassword: ''
  })
  console.log("User", user)
  const navigate = useNavigate();
  const reset = async (e: any) => {
    e.preventDefault();
    try {
      const userId = user._id
      console.log("Userid ", userId)
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/auth/reset-password`, data, {
        headers: {
          authorization: `${localStorage.getItem('token')}`
        }
      })
      console.log("Response", response)
      if (response.status === 200) {
        alert("Password reset successfully")
        navigate('/')
      }
      navigate('/login')

    } catch (error) {

      console.log("Error", error)
      alert("Failed to reset password")
    }
    console.log("Password reset", data)
  }
  return (<div className='max-w-sm bg-white mx-auto p-8 mt-36'>
    <h2 className='text-2xl font-semibold text-center pt-5'>Reset Password</h2>
    <form onSubmit={reset} className='space-y-5 max-w-sm mx-auto pt-8'>

      <input type="text" value={data.newPassword}
        name="newPassword"
        className='w-full bg-bgPrimary border-slate-300 rounded-md  focus:border-2 focus:outline-none px-5 py-3'
        onChange={(e) => setData({ ...data, newPassword: e.target.value })}
        placeholder="Enter New Password"
        required
        autoFocus
      />

      <button type="submit"
        className='w-full mt-5 bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md'
      >Submit</button>
    </form>


  </div>);
}
export default ResetPassword; 
