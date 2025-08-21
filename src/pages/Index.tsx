import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AppHeader } from "@/components/AppHeader"
import { DashboardOverview } from "@/components/DashboardOverview"
import { TestSupabase } from "@/components/TestSupabase"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background via-background to-accent/5">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <AppHeader />
          <div className="flex-1 overflow-auto">
            <TestSupabase />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
