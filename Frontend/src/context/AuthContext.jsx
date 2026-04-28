import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('ss_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('ss_user')

    if (stored && token) {
      try {
        const parsedUser = JSON.parse(stored)
        setUser(parsedUser)
      } catch (err) {
        console.error("Invalid user data in localStorage, clearing...")
        localStorage.removeItem('ss_user')
        setUser(null)
      }
    } else {
      setUser(null)
    }

    setLoading(false)
  }, [token])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)

    localStorage.setItem('ss_token', authToken)

    try {
      localStorage.setItem('ss_user', JSON.stringify(userData))
    } catch (err) {
      console.error("Failed to store user data")
    }
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