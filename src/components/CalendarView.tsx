import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, ChevronRight, Plus, Filter, MoreHorizontal } from "lucide-react"
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay } from "date-fns"
import { es } from "date-fns/locale"

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"day" | "week">("week")

  const goToPrevious = () => {
    if (view === "day") {
      setCurrentDate(prev => addDays(prev, -1))
    } else {
      setCurrentDate(prev => subWeeks(prev, 1))
    }
  }

  const goToNext = () => {
    if (view === "day") {
      setCurrentDate(prev => addDays(prev, 1))
    } else {
      setCurrentDate(prev => addWeeks(prev, 1))
    }
  }

  const getWeekDays = () => {
    const start = startOfWeek(currentDate, { weekStartsOn: 1 })
    return Array.from({ length: 7 }, (_, i) => addDays(start, i))
  }

  const timeSlots = Array.from({ length: 15 }, (_, i) => i + 6) // 6 AM to 8 PM

  // Mock events data
  const events = [
    {
      id: "1",
      title: "Reunión de equipo",
      start: "09:00",
      end: "10:30",
      date: new Date(),
      type: "work",
      attendees: ["usuario@ejemplo.com", "colega@ejemplo.com"]
    },
    {
      id: "2",
      title: "Almuerzo con cliente",
      start: "13:00",
      end: "14:00",
      date: new Date(),
      type: "business",
      attendees: ["cliente@empresa.com"]
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold">Agenda</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={goToPrevious}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={goToNext}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-lg font-medium text-muted-foreground">
            {view === "day" 
              ? format(currentDate, "EEEE, d 'de' MMMM", { locale: es })
              : `Semana del ${format(getWeekDays()[0], "d 'de' MMMM", { locale: es })}`
            }
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={(value) => setView(value as "day" | "week")}>
            <TabsList>
              <TabsTrigger value="day">Día</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo evento
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="glass-card border-0">
        <CardContent className="p-0">
          <div className="grid grid-cols-8 border-b border-border/40">
            <div className="p-4 border-r border-border/40"></div>
            {view === "week" ? (
              getWeekDays().map((day, index) => (
                <div key={index} className="p-4 text-center border-r border-border/40 last:border-r-0">
                  <div className="text-sm text-muted-foreground">
                    {format(day, "EEE", { locale: es })}
                  </div>
                  <div className={`text-lg font-medium ${isSameDay(day, new Date()) ? 'text-primary' : ''}`}>
                    {format(day, "d")}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-7 p-4 text-center">
                <div className="text-sm text-muted-foreground">
                  {format(currentDate, "EEEE", { locale: es })}
                </div>
                <div className="text-lg font-medium text-primary">
                  {format(currentDate, "d 'de' MMMM", { locale: es })}
                </div>
              </div>
            )}
          </div>

          {/* Time slots */}
          <div className="max-h-[600px] overflow-y-auto">
            {timeSlots.map((hour) => (
              <div key={hour} className="grid grid-cols-8 border-b border-border/20 last:border-b-0">
                <div className="p-3 border-r border-border/40 text-sm text-muted-foreground text-right">
                  {hour.toString().padStart(2, '0')}:00
                </div>
                {view === "week" ? (
                  getWeekDays().map((day, dayIndex) => (
                    <div key={dayIndex} className="min-h-[60px] p-2 border-r border-border/20 last:border-r-0 relative">
                      {events
                        .filter(event => isSameDay(event.date, day) && parseInt(event.start.split(':')[0]) === hour)
                        .map((event) => (
                          <div
                            key={event.id}
                            className="absolute inset-x-1 bg-gradient-to-r from-primary/90 to-primary text-primary-foreground rounded-lg p-2 text-xs shadow-md hover:shadow-lg transition-all cursor-pointer z-10"
                            style={{ 
                              top: `${(parseInt(event.start.split(':')[1]) / 60) * 100}%`,
                              height: `${((parseInt(event.end.split(':')[0]) - parseInt(event.start.split(':')[0])) * 60 + (parseInt(event.end.split(':')[1]) - parseInt(event.start.split(':')[1]))) / 60 * 60}px`
                            }}
                          >
                            <div className="font-medium truncate">{event.title}</div>
                            <div className="text-xs opacity-90">{event.start} - {event.end}</div>
                            <div className="flex gap-1 mt-1">
                              {event.attendees.slice(0, 2).map((attendee, i) => (
                                <div key={i} className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                  {attendee.charAt(0).toUpperCase()}
                                </div>
                              ))}
                              {event.attendees.length > 2 && (
                                <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                  +{event.attendees.length - 2}
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  ))
                ) : (
                  <div className="col-span-7 min-h-[60px] p-2 relative">
                    {events
                      .filter(event => isSameDay(event.date, currentDate) && parseInt(event.start.split(':')[0]) === hour)
                      .map((event) => (
                        <div
                          key={event.id}
                          className="bg-gradient-to-r from-primary/90 to-primary text-primary-foreground rounded-lg p-3 mb-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm opacity-90">{event.start} - {event.end}</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {event.attendees.slice(0, 3).map((attendee, i) => (
                                  <div key={i} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                    {attendee.charAt(0).toUpperCase()}
                                  </div>
                                ))}
                                {event.attendees.length > 3 && (
                                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs">
                                    +{event.attendees.length - 3}
                                  </div>
                                )}
                              </div>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}