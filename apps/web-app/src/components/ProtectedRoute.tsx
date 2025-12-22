import React from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const authToken = localStorage.getItem('voiceAI_authToken')
  
  if (!authToken) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
