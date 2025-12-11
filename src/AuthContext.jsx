import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Получить текущую сессию
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        }
        setUser(null) // Не восстанавливать сессию
      } catch (err) {
        console.error('Session fetch failed:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getSession()

    // Timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 5000)

    // Слушать изменения аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
        clearTimeout(timeout)
      }
    )

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeout)
    }
  }, [])

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const register = async (email, password, name) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        }
      }
    })
    if (error) throw error

    // Generate unique discriminator
    let discriminator
    let attempts = 0
    do {
      discriminator = Math.floor(Math.random() * 9000) + 1000 // 1000-9999
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('discriminator', discriminator)
        .single()
      if (!existing) break
      attempts++
    } while (attempts < 10)

    if (attempts >= 10) throw new Error('Failed to generate unique discriminator')

    // Update profile with discriminator
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ discriminator })
      .eq('id', data.user.id)

    if (updateError) throw updateError

    return data
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}
