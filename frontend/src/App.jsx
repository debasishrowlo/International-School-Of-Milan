import { useEffect } from "react"
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from "axios"

import { logout } from '@/redux/features/auth/authSlice';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.status === 401) {
          dispatch(logout())
        }
        return error.response
      }
    )
  }, [])

  return <Outlet/>
}

export default App