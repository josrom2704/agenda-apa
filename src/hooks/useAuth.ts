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
            // Usuario no existe, crearlo usando la función
            const { error: createError } = await supabase.rpc('create_user_from_auth', {
              user_id: authUser.id,
              user_name: authUser.user_metadata?.full_name || authUser.email || 'Usuario',
              user_email: authUser.email || ''
            })

            if (createError) throw createError
            
            // Obtener el usuario creado
            const { data: newUser, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('id', authUser.id)
              .single()

            if (fetchError) throw fetchError
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
            // Crear usuario usando la función
            const { error: createError } = await supabase.rpc('create_user_from_auth', {
              user_id: session.user.id,
              user_name: session.user.user_metadata?.full_name || session.user.email || 'Usuario',
              user_email: session.user.email || ''
            })

            if (createError) throw createError
            
            // Obtener el usuario creado
            const { data: newUser, error: fetchError } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (fetchError) throw fetchError
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
        provider: 'google'
        // Sin redirectTo - que Supabase maneje todo
      })
      if (error) {
        console.error('Error en signInWithOAuth:', error)
        throw error
      }
      console.log('Login iniciado correctamente')
    } catch (error) {
      console.error('Error signing in with Google:', error)
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