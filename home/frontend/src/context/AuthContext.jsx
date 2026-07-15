import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

// Proveedor de autenticación para toda la aplicación
// Gestiona el estado de inicio de sesión mediante tokens JWT almacenados en localStorage
export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('access_token'))

  // Guarda los tokens al iniciar sesión
  const login = (accessToken, refreshToken) => {
    localStorage.setItem('access_token', accessToken)
    localStorage.setItem('refresh_token', refreshToken)
    setToken(accessToken)
  }

  // Elimina los tokens al cerrar sesión
  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setToken(null)
  }

  // Derivado: si no hay token, el usuario es invitado
  const isGuest = !token

  return (
    <AuthContext.Provider value={{ token, login, logout, isGuest }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para acceder al contexto de autenticación desde cualquier componente
export function useAuth() {
  return useContext(AuthContext)
}
