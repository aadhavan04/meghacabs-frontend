import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('mc_user')
    return u ? JSON.parse(u) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('mc_token') || null)

  const login = (userData, tok) => {
    setUser(userData)
    setToken(tok)
    localStorage.setItem('mc_user', JSON.stringify(userData))
    localStorage.setItem('mc_token', tok)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('mc_user')
    localStorage.removeItem('mc_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)