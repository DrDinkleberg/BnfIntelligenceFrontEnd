'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Search,
  Command,
  User,
  Settings,
  LogOut,
  HelpCircle,
  ChevronDown,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { mainNavItems, isRouteActive } from '@/lib/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { NotificationsDropdown } from '@/components/notifications-dropdown'
import { UserPreferencesModal } from '@/components/user-preferences-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import CommandPalette from '@/components/command-palette'

interface HeaderProps {
  alertCount?: number
}

export function Header({ alertCount = 0 }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchCategory, setSearchCategory] = useState('All')
  
  // User preferences modal state
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [preferencesTab, setPreferencesTab] = useState<'profile' | 'settings' | 'help'>('profile')

  const searchCategories = ['All', 'Firms', 'Events', 'Filings', 'News']

  // Keyboard shortcut for command palette (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Navigation handler for command palette
  const handleNavigate = (tab: string) => {
    const routeMap: Record<string, string> = {
      'home': '/',
      'board': '/board',
      'competitors': '/competitors',
      'market-intel': '/market-intel',
      'alerts': '/alerts',
    }
    
    const route = routeMap[tab]
    if (route) {
      router.push(route)
    }
    setCommandPaletteOpen(false)
  }

  // Open preferences modal with specific tab
  const openPreferences = (tab: 'profile' | 'settings' | 'help') => {
    setPreferencesTab(tab)
    setPreferencesOpen(true)
  }

  return (
    <>
      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        onNavigate={handleNavigate}
      />

      <UserPreferencesModal
        open={preferencesOpen}
        onOpenChange={setPreferencesOpen}
        defaultTab={preferencesTab}
      />

      <header className="h-14 border-b border-border bg-background sticky top-0 z-50">
        <div className="flex h-full items-center justify-between px-4">
          {/* Left: Logo + Navigation */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-primary">B&F</span>
              <span className="font-normal text-lg text-foreground">Intelligence</span>
            </Link>

            {/* Tab Navigation */}
            <nav className="hidden md:flex items-center">
              {mainNavItems.map((item) => {
                const Icon = item.icon
                const isActive = isRouteActive(pathname, item.href)
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <div className="relative">
              <div className="flex items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search firms, events, filings..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 h-9 bg-secondary/50 border-border focus-visible:bg-background"
                  />
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => setCommandPaletteOpen(true)}
                      className="ml-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-secondary text-muted-foreground text-xs hover:text-foreground transition-colors"
                    >
                      <Command className="h-3 w-3" />
                      <span>K</span>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Command palette (⌘K)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Right: Actions + Profile */}
          <div className="flex items-center gap-2">
            {/* Notifications Dropdown */}
            <NotificationsDropdown />

            <ThemeToggle />

            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                      {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
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
                <DropdownMenuItem onClick={() => openPreferences('profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openPreferences('settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => openPreferences('help')}>
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
          {mainNavItems.map((item) => {
            const Icon = item.icon
            const isActive = isRouteActive(pathname, item.href)
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
