"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardOverview } from "@/components/dashboard-overview"
import { ProblemManagement } from "@/components/problem-management"
import { MapView } from "@/components/map-view"
import { LayoutDashboard, Map, AlertTriangle, Settings, LogOut, Menu, X, Building2, Users } from "lucide-react"
import { Settings as SettingsComponent } from "@/components/settings"
import { t } from "@/utils/translation" // Import the t function

export function DashboardLayout() {
  const { user, logout } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentView, setCurrentView] = useState("dashboard")
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navigation = [
    { name: t("nav.dashboard"), href: "dashboard", icon: LayoutDashboard, current: currentView === "dashboard" },
    { name: t("nav.mapView"), href: "map", icon: Map, current: currentView === "map" },
    { name: t("nav.problems"), href: "problems", icon: AlertTriangle, current: currentView === "problems" },
    { name: t("nav.settings"), href: "settings", icon: Settings, current: currentView === "settings" },
  ]

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview />
      case "problems":
        return <ProblemManagement />
      case "map":
        return <MapView />
      case "settings":
        return <SettingsComponent />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background: `radial-gradient(circle at ${50 + scrollY * 0.1}% ${50 + scrollY * 0.05}%, rgba(42, 123, 155, 1) 0%, rgba(255, 255, 255, 1) 100%)`,
        transition: "background 0.1s ease-out",
      }}
    >
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black/20" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border">
          <div className="flex h-16 items-center justify-between px-4">
            <h1 className="text-lg font-semibold text-sidebar-foreground dark:text-blue-400">Civic Connect</h1>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <SidebarContent
            navigation={navigation}
            user={user}
            logout={logout}
            currentView={currentView}
            setCurrentView={setCurrentView}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-sidebar border-r border-sidebar-border px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-lg font-semibold text-sidebar-foreground dark:text-blue-400">Civic Connect</h1>
          </div>
          <SidebarContent
            navigation={navigation}
            user={user}
            logout={logout}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-border bg-background/80 backdrop-blur-sm px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1" />
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <Badge variant="secondary" className="flex items-center gap-1">
                {user?.role === "municipal" ? <Building2 className="h-3 w-3" /> : <Users className="h-3 w-3" />}
                {user?.role === "municipal" ? t("role.municipal") : t("role.ngo")}
              </Badge>
              <span className="text-sm text-muted-foreground">{user?.name}</span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{renderContent()}</div>
        </main>
      </div>
    </div>
  )
}

function SidebarContent({
  navigation,
  user,
  logout,
  currentView,
  setCurrentView,
  setSidebarOpen,
}: {
  navigation: any[]
  user: any
  logout: () => void
  currentView: string
  setCurrentView: (view: string) => void
  setSidebarOpen?: (open: boolean) => void
}) {
  const handleNavClick = (href: string) => {
    setCurrentView(href)
    if (setSidebarOpen) {
      setSidebarOpen(false)
    }
  }

  return (
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" className="-mx-2 space-y-1">
            {navigation.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavClick(item.href)}
                  className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium w-full text-left ${item.current
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            {t("nav.signOut")}
          </Button>
        </li>
      </ul>
    </nav>
  )
}
