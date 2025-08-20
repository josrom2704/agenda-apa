import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { User, Bell, Calendar, Shield, Palette, Globe } from "lucide-react"

export function SettingsView() {
  const { toast } = useToast()
  const [profile, setProfile] = useState({
    name: "Usuario Demo",
    email: "usuario@ejemplo.com",
    timezone: "America/El_Salvador"
  })

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    pushNotifications: false,
    meetingRequests: true,
    taskDeadlines: true
  })

  const [calendar, setCalendar] = useState({
    defaultView: "week",
    workingHours: {
      start: "09:00",
      end: "17:00"
    },
    weekStart: "monday"
  })

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Tus cambios han sido guardados exitosamente.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Configuración</h1>
        <Button onClick={handleSave}>
          Guardar cambios
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Perfil de usuario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona horaria</Label>
              <Select value={profile.timezone} onValueChange={(value) => setProfile(prev => ({ ...prev, timezone: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/El_Salvador">El Salvador (GMT-6)</SelectItem>
                  <SelectItem value="America/Guatemala">Guatemala (GMT-6)</SelectItem>
                  <SelectItem value="America/Honduras">Honduras (GMT-6)</SelectItem>
                  <SelectItem value="America/Mexico_City">México Central (GMT-6)</SelectItem>
                  <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recordatorios por email</Label>
                <p className="text-sm text-muted-foreground">Recibe recordatorios de eventos por correo</p>
              </div>
              <Switch
                checked={notifications.emailReminders}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailReminders: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificaciones push</Label>
                <p className="text-sm text-muted-foreground">Notificaciones en el navegador</p>
              </div>
              <Switch
                checked={notifications.pushNotifications}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Solicitudes de reunión</Label>
                <p className="text-sm text-muted-foreground">Notificar nuevas solicitudes</p>
              </div>
              <Switch
                checked={notifications.meetingRequests}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, meetingRequests: checked }))}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Fechas límite de tareas</Label>
                <p className="text-sm text-muted-foreground">Recordatorios de tareas próximas a vencer</p>
              </div>
              <Switch
                checked={notifications.taskDeadlines}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, taskDeadlines: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Calendar Settings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Configuración del calendario
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Vista predeterminada</Label>
              <Select value={calendar.defaultView} onValueChange={(value) => setCalendar(prev => ({ ...prev, defaultView: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Día</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Inicio de semana</Label>
              <Select value={calendar.weekStart} onValueChange={(value) => setCalendar(prev => ({ ...prev, weekStart: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sunday">Domingo</SelectItem>
                  <SelectItem value="monday">Lunes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Hora inicio laboral</Label>
                <Input
                  type="time"
                  value={calendar.workingHours.start}
                  onChange={(e) => setCalendar(prev => ({ 
                    ...prev, 
                    workingHours: { ...prev.workingHours, start: e.target.value }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Hora fin laboral</Label>
                <Input
                  type="time"
                  value={calendar.workingHours.end}
                  onChange={(e) => setCalendar(prev => ({ 
                    ...prev, 
                    workingHours: { ...prev.workingHours, end: e.target.value }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="glass-card border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Seguridad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Cambiar contraseña
            </Button>
            <Button variant="outline" className="w-full">
              Configurar autenticación de dos factores
            </Button>
            <Button variant="outline" className="w-full">
              Ver sesiones activas
            </Button>
            <Separator />
            <Button variant="destructive" className="w-full">
              Cerrar todas las sesiones
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Data & Privacy */}
      <Card className="glass-card border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Datos y privacidad
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline">
              Exportar datos
            </Button>
            <Button variant="outline">
              Descargar archivo de datos
            </Button>
            <Button variant="destructive">
              Eliminar cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}