import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Obtener usuario actual
    const getUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          // Buscar o crear usuario en nuestra tabla
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (error && error.code === 'PGRST116') {
            // Usuario no existe, crearlo
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert([{
                id: authUser.id,
                name: authUser.user_metadata?.full_name || 'Usuario',
                email: authUser.email || '',
                timezone: 'America/El_Salvador'
              }])
              .select()
              .single()

            if (createError) throw createError
            setUser(newUser)
          } else if (error) {
            throw error
          } else {
            setUser(userData)
          }
        }
      } catch (error) {
        console.error('Error getting user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          // Usuario se autenticó
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (error && error.code === 'PGRST116') {
            // Crear usuario
            const { data: newUser, error: createError } = await supabase
              .from('users')
              .insert([{
                id: session.user.id,
                name: session.user.user_metadata?.full_name || 'Usuario',
                email: session.user.email || '',
                timezone: 'America/El_Salvador'
              }])
              .select()
              .single()

            if (createError) throw createError
            setUser(newUser)
          } else if (error) {
            throw error
          } else {
            setUser(userData)
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'https://agenda-apa.vercel.app/' // ✅ URL CORREGIDA: tu app, no el callback de Supabase
        }
      })
      if (error) throw error
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signOut,
    isAuthenticated: !!user
  }
}