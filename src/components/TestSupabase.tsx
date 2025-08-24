import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from '@/hooks/useTasks'
import { useEvents, useCreateEvent } from '@/hooks/useEvents'
import { useToast } from '@/hooks/use-toast'

export function TestSupabase() {
  const { user, loading, signInWithGoogle, signOut, isAuthenticated } = useAuth()
  const { toast } = useToast()
  
  // Estados para formularios
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newEventTitle, setNewEventTitle] = useState('')
  const [newEventDate, setNewEventDate] = useState('')

  // Hooks de tareas
  const { data: tasks, refetch: refetchTasks } = useTasks()
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()

  // Hooks de eventos
  const { data: events, refetch: refetchEvents } = useEvents()
  const createEvent = useCreateEvent()

  // Función para probar creación de tarea
  const handleCreateTask = async () => {
    if (!newTaskTitle.trim()) return

    try {
      await createTask.mutateAsync({
        title: newTaskTitle,
        description: 'Tarea de prueba',
        priority: 1,
        status: 'pending',
        reminders: [60]
      })
      
      setNewTaskTitle('')
      toast({
        title: "Tarea creada",
        description: "La tarea se creó exitosamente en Supabase",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear la tarea",
        variant: "destructive"
      })
    }
  }

  // Función para probar creación de evento
  const handleCreateEvent = async () => {
    if (!newEventTitle.trim() || !newEventDate) return

    try {
      const startDate = new Date(newEventDate)
      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000) // +1 hora

      await createEvent.mutateAsync({
        title: newEventTitle,
        start_at: startDate.toISOString(),
        end_at: endDate.toISOString(),
        event_type: 'meeting',
        attendees: []
      })
      
      setNewEventTitle('')
      setNewEventDate('')
      toast({
        title: "Evento creado",
        description: "El evento se creó exitosamente en Supabase",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo crear el evento",
        variant: "destructive"
      })
    }
  }

  // Función para probar actualización de tarea
  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'pending' ? 'completed' : 'pending'
      await updateTask.mutateAsync({
        id: taskId,
        status: newStatus
      })
      
      toast({
        title: "Tarea actualizada",
        description: `Estado cambiado a: ${newStatus}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar la tarea",
        variant: "destructive"
      })
    }
  }

  // Función para probar eliminación de tarea
  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask.mutateAsync(taskId)
      toast({
        title: "Tarea eliminada",
        description: "La tarea se eliminó exitosamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la tarea",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p>Cargando...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <CardTitle>Prueba de Supabase - Autenticación</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Para probar la funcionalidad, necesitas autenticarte primero.</p>
            <Button onClick={signInWithGoogle} className="w-full">
              Iniciar sesión con Google
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Usuario Autenticado</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Nombre:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Zona horaria:</strong> {user?.timezone}</p>
          <Button onClick={signOut} variant="outline" className="mt-2">
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>

      {/* Prueba de Tareas */}
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Tareas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Título de la tarea"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <Button onClick={handleCreateTask} disabled={createTask.isPending}>
              {createTask.isPending ? 'Creando...' : 'Crear Tarea'}
            </Button>
          </div>
          
          <Button onClick={() => refetchTasks()} variant="outline">
            Refrescar Tareas
          </Button>

          <div className="space-y-2">
            <h4 className="font-medium">Tareas existentes:</h4>
            {tasks?.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 border rounded">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Estado: {task.status} | Prioridad: {task.priority}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleTask(task.id, task.status)}
                    disabled={updateTask.isPending}
                  >
                    {task.status === 'pending' ? 'Completar' : 'Pendiente'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteTask(task.id)}
                    disabled={deleteTask.isPending}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            ))}
            {(!tasks || tasks.length === 0) && (
              <p className="text-muted-foreground">No hay tareas creadas</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Prueba de Eventos */}
      <Card>
        <CardHeader>
          <CardTitle>Prueba de Eventos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Input
              placeholder="Título del evento"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
            />
            <Input
              type="datetime-local"
              value={newEventDate}
              onChange={(e) => setNewEventDate(e.target.value)}
            />
          </div>
          
          <Button onClick={handleCreateEvent} disabled={createEvent.isPending}>
            {createEvent.isPending ? 'Creando...' : 'Crear Evento'}
          </Button>

          <Button onClick={() => refetchEvents()} variant="outline">
            Refrescar Eventos
          </Button>

          <div className="space-y-2">
            <h4 className="font-medium">Eventos existentes:</h4>
            {events?.map((event) => (
              <div key={event.id} className="p-2 border rounded">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(event.start_at).toLocaleString()} - {new Date(event.end_at).toLocaleString()}
                </p>
              </div>
            ))}
            {(!events || events.length === 0) && (
              <p className="text-muted-foreground">No hay eventos creados</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}