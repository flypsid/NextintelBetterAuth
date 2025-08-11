import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ServerProtectedRoute } from "@/components/auth/ServerProtectedRoute";

export default async function Page({ params }: { params: { locale: string } }) {
  const { locale } = await params;
  return (
    <ServerProtectedRoute locale={locale}>
      <ProtectedRoute>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <AppSidebar variant="inset" />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {/* Contenu supprimé */}
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </ProtectedRoute>
    </ServerProtectedRoute>
  );
}
