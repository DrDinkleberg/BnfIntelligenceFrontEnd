"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronDown,
  Home,
  LayoutGrid,
  Building2,
  Globe,
  User,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
  Command,
  Check,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import HomeDashboard from "@/components/home-dashboard"
import BoardView from "@/components/board-view"
import CompetitorsView from "@/components/competitors-view"
import MarketIntel from "@/components/market-intel"
import CommandPalette from "@/components/command-palette"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/hooks/use-auth"

export default function IntelligenceDashboard() {
  const [searchCategory, setSearchCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("home")
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [alertCount] = useState(5)
  const { user, logout } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleNavigate = (tab: string) => {
    setActiveTab(tab)
  }

  const renderMainContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeDashboard onNavigate={handleNavigate} />
      case "board":
        return <BoardView />
      case "competitors":
        return <CompetitorsView />
      case "market-intel":
        return <MarketIntel />
      default:
        return <HomeDashboard onNavigate={handleNavigate} />
    }
  }

  const searchCategories = ["All", "Firms", "Events", "Filings", "News"]

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "board", label: "Board", icon: LayoutGrid },
    { id: "competitors", label: "Competitors", icon: Building2 },
    { id: "market-intel", label: "Market Intel", icon: Globe },
  ]

  const notifications = [
    {
      id: 1,
      type: "critical",
      title: "FDA warning: Acme Pharmaceuticals",
      description: "Quality control violations at Newark facility",
      time: "2m",
      read: false,
    },
    {
      id: 2,
      type: "warning",
      title: "M&M expands PFAS campaign",
      description: "$2.3M spend increase across 12 new markets",
      time: "15m",
      read: false,
    },
    {
      id: 3,
      type: "info",
      title: "DataCorp class action filed",
      description: "SDNY securities fraud, seeking $450M",
      time: "1h",
      read: false,
    },
    {
      id: 4,
      type: "info",
      title: "Camp Lejeune trending on Reddit",
      description: "500+ users in r/LegalAdvice settlement thread",
      time: "2h",
      read: true,
    },
    {
      id: 5,
      type: "warning",
      title: "SEC opens CryptoLend probe",
      description: "Unregistered securities investigation",
      time: "3h",
      read: true,
    },
  ]

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "critical":
        return "bg-red-500"
      case "warning":
        return "bg-orange-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Command Palette */}
        <CommandPalette
          open={commandPaletteOpen}
          onOpenChange={setCommandPaletteOpen}
          onNavigate={handleNavigate}
        />

        {/* HEADER - 56px */}
        <header className="h-14 border-b border-border bg-background sticky top-0 z-50">
          <div className="flex h-full items-center justify-between px-4">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-primary">B&F</span>
                <span className="font-normal text-lg text-foreground">Intelligence</span>
              </div>

              {/* Tab Navigation */}
              <nav className="hidden md:flex items-center">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Center: Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-8">
              <div className="flex items-center w-full h-9 rounded-md border border-border bg-card hover:bg-secondary/50 transition-colors">
                <Search className="h-4 w-4 text-muted-foreground ml-3" />
                <Input
                  className="border-0 bg-transparent h-full text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 px-2"
                  placeholder="Search firms, events, filings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onClick={() => setCommandPaletteOpen(true)}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="h-full px-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border-l border-border transition-colors">
                      <span>{searchCategory}</span>
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-32">
                    {searchCategories.map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() => setSearchCategory(category)}
                        className="text-sm"
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Right: Actions + Profile */}
            <div className="flex items-center gap-2">
              {/* Command Palette Trigger */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 gap-1.5 text-muted-foreground hover:text-foreground hidden sm:flex"
                    onClick={() => setCommandPaletteOpen(true)}
                  >
                    <Command className="h-4 w-4" />
                    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                      <span className="text-xs">&#8984;</span>K
                    </kbd>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Command palette</TooltipContent>
              </Tooltip>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 relative text-muted-foreground hover:text-foreground">
                    <Bell className="h-4 w-4" />
                    {alertCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground flex items-center justify-center">
                        {alertCount}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-96" align="end">
                  <DropdownMenuLabel className="flex items-center justify-between py-3">
                    <span className="text-base font-semibold">Notifications</span>
                    <button className="text-xs text-primary hover:underline">Mark all read</button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Today */}
                  <div className="px-2 py-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Today</span>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.slice(0, 3).map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${getNotificationColor(notification.type)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium truncate">{notification.title}</span>
                            {!notification.read && <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{notification.description}</p>
                          <span className="text-[10px] text-muted-foreground mt-1 block">{notification.time}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  
                  {/* Earlier */}
                  <div className="px-2 py-1.5 border-t border-border">
                    <span className="text-xs font-medium text-muted-foreground">Earlier</span>
                  </div>
                  <div className="max-h-[200px] overflow-y-auto">
                    {notifications.slice(3).map((notification) => (
                      <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer opacity-70">
                        <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${getNotificationColor(notification.type)}`} />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium truncate block">{notification.title}</span>
                          <span className="text-[10px] text-muted-foreground mt-1 block">{notification.time}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="justify-center text-sm text-primary py-3">
                    View all notifications
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
                      <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                        {user?.name?.split(" ").map(n => n[0]).join("") || "?"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Mobile Navigation */}
        <nav className="md:hidden border-b border-border overflow-x-auto bg-background">
          <div className="flex px-2 py-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                    isActive
                      ? "text-foreground border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="min-h-[calc(100vh-3.5rem)]">{renderMainContent()}</main>
      </div>
    </TooltipProvider>
  )
}
