import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { getSession, getCurrentUser, signIn, signUp, signOut } from '../lib/supabaseAuth.js'
import { isSupabaseConfigured } from '../lib/config.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null)
      setLoading(false)
      return
    }
    const session = getSession()
    if (!session) {
      setUser(null)
      setLoading(false)
      return
    }
    const currentUser = await getCurrentUser()
    setUser(currentUser)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
    window.addEventListener('3wm-auth-change', refresh)
    return () => window.removeEventListener('3wm-auth-change', refresh)
  }, [refresh])

  const value = {
    user,
    loading,
    isConfigured: isSupabaseConfigured,
    signIn: async (email, password) => {
      await signIn(email, password)
      await refresh()
    },
    signUp: async (email, password) => {
      return signUp(email, password)
    },
    signOut: async () => {
      await signOut()
      setUser(null)
    },
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé à l\'intérieur de <AuthProvider>')
  return ctx
}
