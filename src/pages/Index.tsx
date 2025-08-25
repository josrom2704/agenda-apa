import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Index() {
  const { user, loading, signInWithGoogle, signOut, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Cargando...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Verificando autenticación...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="min-h-screen p-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Dashboard - Bienvenido, {user.name}!</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>Email: {user.email}</p>
              <p>Timezone: {user.timezone}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Agenda</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Gestiona tus eventos y citas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tareas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Organiza tus tareas pendientes</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Solicitudes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Revisa solicitudes entrantes</p>
                  </CardContent>
                </Card>
              </div>
              <Button onClick={signOut} className="mt-6">
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Prueba de Supabase - Autenticación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">Para probar la funcionalidad, necesitas autenticarte primero.</p>
          <Button onClick={signInWithGoogle} className="w-full">
            Iniciar sesión con Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
