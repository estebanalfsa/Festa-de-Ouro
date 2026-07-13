import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RutaProtegida({ children }) {
  const { isGuest } = useAuth()

  if (isGuest) {
    return <Navigate to="/login" replace />
  }

  return children
}