import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Plus, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AppHeader() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/40 bg-card/30 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar eventos, tareas..." 
            className="pl-10 bg-background/50 border-border/40 rounded-xl"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-xl">
          <Bell className="w-4 h-4" />
        </Button>
        <Button className="rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </Button>
      </div>
    </header>
  )
}