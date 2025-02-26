import { useEffect } from "react"
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from "axios"

import { handleInvalidToken } from '@/redux/features/auth/authSlice';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    axios.interceptors.response.use(
      response => response,
      error => {
        if (error.status === 401) {
          dispatch(handleInvalidToken())
        }
        return error.response
      }
    )
  }, [])

  return <Outlet/>
}

export default App