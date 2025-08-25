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
        console.log('🔍 DEBUG: AuthCallback iniciado')
        
        // Obtener el código de autorización de la URL
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')
        
        console.log('🔍 DEBUG: Parámetros de URL:')
        console.log('  - code:', code ? 'PRESENTE' : 'AUSENTE')
        console.log('  - error:', errorParam)
        console.log('  - error_description:', errorDescription)
        
        // Si hay un error en la URL, mostrarlo
        if (errorParam) {
          console.error('❌ ERROR de OAuth en URL:', errorParam, errorDescription)
          setError(`Error de OAuth: ${errorDescription || errorParam}`)
          setLoading(false)
          return
        }

        // Si no hay código, intentar obtener la sesión existente
        if (!code) {
          console.log('🔍 DEBUG: No hay código, intentando getSession...')
          const { data, error } = await supabase.auth.getSession()
          
          if (error) {
            console.error('❌ ERROR en getSession:', error)
            setError(error.message)
            setLoading(false)
            return
          }

          if (data.session) {
            console.log('✅ DEBUG: Sesión existente encontrada')
            // Usuario ya autenticado, redirigir
            setTimeout(() => {
              navigate('/', { replace: true })
            }, 2000)
            return
          } else {
            console.log('❌ DEBUG: No hay sesión existente')
            setError('No se pudo obtener la sesión')
            setLoading(false)
            return
          }
        }

        // Intercambiar el código por una sesión
        console.log('🔍 DEBUG: Intercambiando código por sesión...')
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('❌ ERROR intercambiando código:', error)
          setError(`Error al intercambiar código: ${error.message}`)
          setLoading(false)
          return
        }

        if (data.session) {
          console.log('✅ DEBUG: Sesión creada exitosamente:', data.session.user.email)
          // Usuario autenticado exitosamente
          setTimeout(() => {
            navigate('/', { replace: true })
          }, 2000)
        } else {
          console.log('❌ DEBUG: No se pudo crear la sesión')
          setError('No se pudo crear la sesión después del intercambio')
          setLoading(false)
        }
      } catch (err) {
        console.error('❌ ERROR inesperado en handleAuthCallback:', err)
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