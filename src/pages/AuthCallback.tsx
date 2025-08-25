import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthCallback() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Obtener el código de autorización de la URL
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        // Si hay un error en la URL, mostrarlo
        if (errorParam) {
          setError(`Error de OAuth: ${errorDescription || errorParam}`)
          setLoading(false)
          return
        }

        // Si no hay código, intentar obtener la sesión existente
        if (!code) {
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            setError(error.message)
            setLoading(false)
            return
          }

          if (data.session) {
            // Usuario ya autenticado, redirigir
            setTimeout(() => {
              navigate('/', { replace: true })
            }, 2000)
            return
          } else {
            setError('No se pudo obtener la sesión')
            setLoading(false)
            return
          }
        }

        // Intercambiar el código por una sesión
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('Error intercambiando código:', error)
          setError(`Error al intercambiar código: ${error.message}`)
          setLoading(false)
          return
        }

        if (data.session) {
          // Usuario autenticado exitosamente
          console.log('Usuario autenticado:', data.session.user.email)
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 2000)
        } else {
          setError('No se pudo crear la sesión después del intercambio')
          setLoading(false)
        }
      } catch (err) {
        console.error('Error inesperado durante la autenticación:', err)
        setError('Error inesperado durante la autenticación')
        setLoading(false)
      }
    }

    handleAuthCallback()
  }, [navigate, searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Autenticando...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Procesando tu inicio de sesión...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Error de Autenticación</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volver al inicio
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}