import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Search, Clock, Users, Calendar, Check, X, MoreHorizontal } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export function MeetingRequests() {
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")

  // Mock data
  const meetingRequests = [
    {
      id: "1",
      title: "Revisión del proyecto Q4",
      organizer: "Ana García",
      organizerEmail: "ana@empresa.com",
      description: "Revisión de los avances del proyecto del cuarto trimestre",
      duration: 60,
      status: "pending",
      options: [
        { startUtc: new Date("2024-12-20T14:00:00Z"), endUtc: new Date("2024-12-20T15:00:00Z") },
        { startUtc: new Date("2024-12-20T16:00:00Z"), endUtc: new Date("2024-12-20T17:00:00Z") },
        { startUtc: new Date("2024-12-21T10:00:00Z"), endUtc: new Date("2024-12-21T11:00:00Z") }
      ],
      attendees: ["usuario@ejemplo.com", "ana@empresa.com"],
      createdAt: new Date("2024-12-18T10:00:00Z")
    },
    {
      id: "2",
      title: "Reunión con cliente potencial",
      organizer: "Carlos López",
      organizerEmail: "carlos@ventas.com",
      description: "Presentación de nuestros servicios",
      duration: 45,
      status: "accepted",
      selectedSlot: { startUtc: new Date("2024-12-19T15:00:00Z"), endUtc: new Date("2024-12-19T15:45:00Z") },
      attendees: ["usuario@ejemplo.com", "carlos@ventas.com", "cliente@empresa.com"],
      createdAt: new Date("2024-12-17T09:00:00Z")
    }
  ]

  const filteredRequests = meetingRequests.filter(request => 
    request.status === activeTab && 
    (request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
     request.organizer.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "default",
      accepted: "secondary",
      declined: "destructive"
    }
    const labels = {
      pending: "Pendiente",
      accepted: "Aceptada",
      declined: "Rechazada"
    }
    return <Badge variant={variants[status as keyof typeof variants] as any}>{labels[status as keyof typeof labels]}</Badge>
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Solicitudes de reunión</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Proponer reunión
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Proponer nueva reunión</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-muted-foreground">Funcionalidad en desarrollo...</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar reuniones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pendientes ({meetingRequests.filter(r => r.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="accepted">Aceptadas ({meetingRequests.filter(r => r.status === 'accepted').length})</TabsTrigger>
          <TabsTrigger value="declined">Rechazadas ({meetingRequests.filter(r => r.status === 'declined').length})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card className="glass-card border-0">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay solicitudes</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'pending' && "No tienes solicitudes de reunión pendientes."}
                  {activeTab === 'accepted' && "No tienes reuniones aceptadas."}
                  {activeTab === 'declined' && "No tienes reuniones rechazadas."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card key={request.id} className="glass-card border-0 hover:shadow-lg transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{request.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Organizado por {request.organizer}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {request.duration} minutos
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(request.status)}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {request.description && (
                    <p className="text-muted-foreground">{request.description}</p>
                  )}

                  {/* Time slots */}
                  {request.status === 'pending' && request.options && (
                    <div>
                      <h4 className="font-medium mb-2">Horarios propuestos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {request.options.map((option, index) => (
                          <Badge key={index} variant="outline" className="p-2">
                            {format(option.startUtc, "EEE d MMM, HH:mm", { locale: es })} - {format(option.endUtc, "HH:mm")}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {request.status === 'accepted' && request.selectedSlot && (
                    <div>
                      <h4 className="font-medium mb-2">Horario confirmado:</h4>
                      <Badge variant="secondary" className="p-2">
                        {format(request.selectedSlot.startUtc, "EEE d MMM, HH:mm", { locale: es })} - {format(request.selectedSlot.endUtc, "HH:mm")}
                      </Badge>
                    </div>
                  )}

                  {/* Attendees */}
                  <div>
                    <h4 className="font-medium mb-2">Asistentes ({request.attendees.length}):</h4>
                    <div className="flex gap-2">
                      {request.attendees.map((attendee, index) => (
                        <div key={index} className="flex items-center gap-2 bg-muted/50 rounded-full px-3 py-1 text-sm">
                          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium">
                            {attendee.charAt(0).toUpperCase()}
                          </div>
                          {attendee}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {request.status === 'pending' && (
                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1">
                        <Check className="w-4 h-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <X className="w-4 h-4 mr-2" />
                        Rechazar
                      </Button>
                      <Button variant="outline">
                        Reprogramar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}