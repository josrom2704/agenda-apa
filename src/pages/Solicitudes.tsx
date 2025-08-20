import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AppHeader } from "@/components/AppHeader"
import { MeetingRequests } from "@/components/MeetingRequests"

const Solicitudes = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-accent/5">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1 overflow-auto">
            <MeetingRequests />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Solicitudes;