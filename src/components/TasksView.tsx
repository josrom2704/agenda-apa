import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Plus, Search, Calendar as CalendarIcon, Clock, Flag, MoreHorizontal, Filter } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function TasksView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [newTaskOpen, setNewTaskOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    notes: "",
    dueDate: undefined as Date | undefined,
    priority: 0
  })

  // Mock data
  const tasks = [
    {
      id: "1",
      title: "Preparar presentación para cliente",
      notes: "Incluir datos de Q4 y proyecciones para 2025",
      dueUtc: new Date("2024-12-20T18:00:00Z"),
      priority: 2,
      done: false,
      reminders: [1440, 60] // 24h y 1h antes
    },
    {
      id: "2",
      title: "Revisar propuesta de presupuesto",
      notes: "",
      dueUtc: new Date("2024-12-19T12:00:00Z"),
      priority: 1,
      done: true,
      reminders: [60]
    },
    {
      id: "3",
      title: "Llamar a proveedor de servicios",
      notes: "Negociar términos del contrato renovación",
      dueUtc: new Date("2024-12-21T15:00:00Z"),
      priority: 0,
      done: false,
      reminders: [1440, 60, 10]
    }
  ]

  const getPriorityLabel = (priority: number) => {
    const labels = { 0: "Baja", 1: "Media", 2: "Alta" }
    return labels[priority as keyof typeof labels] || "Baja"
  }

  const getPriorityColor = (priority: number) => {
    const colors = { 0: "text-green-600", 1: "text-yellow-600", 2: "text-red-600" }
    return colors[priority as keyof typeof colors] || "text-green-600"
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.notes.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPriority = filterPriority === "all" || task.priority.toString() === filterPriority
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "completed" && task.done) ||
                         (filterStatus === "pending" && !task.done)
    
    return matchesSearch && matchesPriority && matchesStatus
  })

  const handleCreateTask = () => {
    console.log("Creating task:", newTask)
    setNewTaskOpen(false)
    setNewTask({ title: "", notes: "", dueDate: undefined, priority: 0 })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tareas</h1>
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva tarea
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear nueva tarea</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Título</label>
                <Input
                  placeholder="Título de la tarea"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notas</label>
                <Textarea
                  placeholder="Descripción opcional..."
                  value={newTask.notes}
                  onChange={(e) => setNewTask(prev => ({ ...prev, notes: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Fecha límite</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !newTask.dueDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newTask.dueDate ? format(newTask.dueDate, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newTask.dueDate}
                      onSelect={(date) => setNewTask(prev => ({ ...prev, dueDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="text-sm font-medium">Prioridad</label>
                <Select value={newTask.priority.toString()} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Baja</SelectItem>
                    <SelectItem value="1">Media</SelectItem>
                    <SelectItem value="2">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateTask} className="flex-1">
                  Crear tarea
                </Button>
                <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Prioridad" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="2">Alta</SelectItem>
            <SelectItem value="1">Media</SelectItem>
            <SelectItem value="0">Baja</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tasks.filter(t => !t.done).length}</div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tasks.filter(t => t.done).length}</div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tasks.filter(t => t.priority === 2 && !t.done).length}</div>
            <div className="text-sm text-muted-foreground">Alta prioridad</div>
          </CardContent>
        </Card>
        <Card className="glass-card border-0">
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{tasks.filter(t => t.dueUtc && new Date(t.dueUtc) < new Date() && !t.done).length}</div>
            <div className="text-sm text-muted-foreground">Vencidas</div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card className="glass-card border-0">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No hay tareas</h3>
              <p className="text-muted-foreground text-center">
                No se encontraron tareas que coincidan con los filtros aplicados.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <Card key={task.id} className={cn(
              "glass-card border-0 hover:shadow-lg transition-all cursor-pointer",
              task.done && "opacity-60"
            )}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={task.done}
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className={cn(
                        "font-medium",
                        task.done && "line-through text-muted-foreground"
                      )}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getPriorityColor(task.priority)}>
                          <Flag className="w-3 h-3 mr-1" />
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {task.notes && (
                      <p className={cn(
                        "text-sm text-muted-foreground",
                        task.done && "line-through"
                      )}>
                        {task.notes}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {task.dueUtc && (
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="w-4 h-4" />
                          <span className={cn(
                            new Date(task.dueUtc) < new Date() && !task.done && "text-red-600 font-medium"
                          )}>
                            {format(task.dueUtc, "d MMM, HH:mm", { locale: es })}
                          </span>
                        </div>
                      )}
                      {task.reminders && task.reminders.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {task.reminders.length} recordatorio{task.reminders.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}