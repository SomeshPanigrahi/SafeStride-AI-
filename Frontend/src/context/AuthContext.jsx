

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  
  const [token, setToken] = useState(() => {
    return localStorage.getItem('ss_token') || null
  })

  const [loading, setLoading] = useState(true)

  
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ss_user')

      if (stored && stored !== "undefined" && token) {
        const parsedUser = JSON.parse(stored)
        setUser(parsedUser)
      } else {
        setUser(null)
      }

    } catch (err) {
      console.error("Invalid user in localStorage:", err)

  
      localStorage.removeItem('ss_user')
      setUser(null)
    }

    setLoading(false)
  }, [token])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)

    localStorage.setItem('ss_token', authToken)

  
    localStorage.setItem('ss_user', JSON.stringify(userData || null))
  }


  const logout = () => {
    setUser(null)
    setToken(null)

    localStorage.removeItem('ss_token')
    localStorage.removeItem('ss_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

