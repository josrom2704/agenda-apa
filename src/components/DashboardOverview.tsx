import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, FileText, Clock, ArrowRight, Plus } from "lucide-react"
import { MiniCalendar } from "./MiniCalendar"

export function DashboardOverview() {
  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-background border border-border/40 p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">¡Buenos días!</h1>
          <p className="text-muted-foreground mb-6">Tienes 3 eventos y 5 tareas pendientes para hoy</p>
          <div className="flex gap-3">
            <Button className="rounded-xl bg-gradient-to-r from-primary to-accent">
              Ver Agenda
            </Button>
            <Button variant="outline" className="rounded-xl border-border/40">
              Crear Tarea
            </Button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-2xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Próximo Evento</CardTitle>
                <Calendar className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">14:30</div>
                <p className="text-xs text-muted-foreground">Reunión de equipo en 2 horas</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tareas de Hoy</CardTitle>
                <CheckSquare className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">3 completadas, 2 pendientes</p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Solicitudes</CardTitle>
                <FileText className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground">Reuniones pendientes</p>
              </CardContent>
            </Card>
          </div>

          {/* Today's Events */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Eventos de Hoy
                <Button variant="ghost" size="sm" className="rounded-xl">
                  Ver todos <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/20 border border-border/40">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Reunión de equipo</h4>
                  <p className="text-sm text-muted-foreground">14:30 - 15:30 • Sala de conferencias</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/40">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">Revisión de proyecto</h4>
                  <p className="text-sm text-muted-foreground">16:00 - 17:00 • Video llamada</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Calendar Sidebar */}
        <div className="space-y-6">
          <MiniCalendar />
          
          {/* Quick Actions */}
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start rounded-xl bg-gradient-to-r from-primary to-accent">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Evento
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl border-border/40">
                <CheckSquare className="w-4 h-4 mr-2" />
                Nueva Tarea
              </Button>
              <Button variant="outline" className="w-full justify-start rounded-xl border-border/40">
                <FileText className="w-4 h-4 mr-2" />
                Solicitar Reunión
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}