import React from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation()
  const isLoggedIn = useSelector(state => state.auth.isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default AuthGuard