"use client"

import React from "react"

import { useState, useEffect, useCallback } from "react"
import {
  Search,
  Home,
  Target,
  AlertTriangle,
  Newspaper,
  Users,
  FileText,
  Settings,
  HelpCircle,
  ArrowRight,
  Plus,
  Download,
  Bell,
  User,
  LayoutGrid,
  TrendingUp,
  Building2,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

interface CommandPaletteProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onNavigate: (tab: string) => void
}

interface CommandItem {
  id: string
  label: string
  description?: string
  icon: React.ElementType
  category: string
  action: () => void
  shortcut?: string
}

export default function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (!open) {
      setSearch("")
      setSelectedIndex(0)
    }
  }, [open])

  // Action handlers
  const handleCreateBoard = useCallback(() => {
    onNavigate("board")
    onOpenChange(false)
    // Small delay to let navigation complete, then show toast
    setTimeout(() => {
      toast({
        title: "Create Board",
        description: "Click '+ Add Column' to start building your new board.",
      })
    }, 100)
  }, [onNavigate, onOpenChange, toast])

  const handleAddCompetitor = useCallback(() => {
    onNavigate("competitors")
    onOpenChange(false)
    setTimeout(() => {
      toast({
        title: "Track Competitor",
        description: "Click the '...' menu on any competitor to start tracking.",
      })
    }, 100)
  }, [onNavigate, onOpenChange, toast])

  const handleCreateReport = useCallback(() => {
    toast({
      title: "Report Generation",
      description: "Select items from your boards or competitors, then export to generate reports.",
    })
    onOpenChange(false)
  }, [onOpenChange, toast])

  const handleExportData = useCallback(() => {
    toast({
      title: "Export Started",
      description: "Your data export is being prepared. Check Settings > Data & Sync for options.",
    })
    onOpenChange(false)
  }, [onOpenChange, toast])

  const handleViewAlerts = useCallback(() => {
    onNavigate("alerts")
    onOpenChange(false)
  }, [onNavigate, onOpenChange])

  const commands: CommandItem[] = [
    // Recent
    { 
      id: "recent-1", 
      label: "Morgan & Morgan", 
      description: "Competitor profile viewed 2h ago", 
      icon: Users, 
      category: "Recent", 
      action: () => { onNavigate("competitors"); onOpenChange(false) } 
    },
    { 
      id: "recent-2", 
      label: "FDA Warning - Pharmaceutical", 
      description: "Event viewed yesterday", 
      icon: AlertTriangle, 
      category: "Recent", 
      action: () => { onNavigate("market-intel"); onOpenChange(false) } 
    },
    { 
      id: "recent-3", 
      label: "Litigation Pipeline Board", 
      description: "Board edited 3h ago", 
      icon: Target, 
      category: "Recent", 
      action: () => { onNavigate("board"); onOpenChange(false) } 
    },
    
    // Navigation
    { 
      id: "home", 
      label: "Go to Home", 
      description: "Dashboard overview", 
      icon: Home, 
      category: "Navigation", 
      action: () => { onNavigate("home"); onOpenChange(false) },
      shortcut: "G H"
    },
    { 
      id: "board", 
      label: "Go to Board", 
      description: "Kanban workspace", 
      icon: Target, 
      category: "Navigation", 
      action: () => { onNavigate("board"); onOpenChange(false) },
      shortcut: "G B"
    },
    { 
      id: "competitors", 
      label: "Go to Competitors", 
      description: "Track law firms", 
      icon: Building2, 
      category: "Navigation", 
      action: () => { onNavigate("competitors"); onOpenChange(false) },
      shortcut: "G C"
    },
    { 
      id: "competitors-ads", 
      label: "Go to Competitor Ads", 
      description: "View ad campaigns", 
      icon: TrendingUp, 
      category: "Navigation", 
      action: () => { onNavigate("competitors-ads"); onOpenChange(false) }
    },
    { 
      id: "market-intel", 
      label: "Go to Market Intel", 
      description: "Browse all intelligence", 
      icon: Newspaper, 
      category: "Navigation", 
      action: () => { onNavigate("market-intel"); onOpenChange(false) },
      shortcut: "G M"
    },
    { 
      id: "alerts", 
      label: "Go to Alerts", 
      description: "View all alerts", 
      icon: Bell, 
      category: "Navigation", 
      action: handleViewAlerts,
      shortcut: "G A"
    },
    { 
      id: "settings", 
      label: "Go to Settings", 
      description: "Manage preferences", 
      icon: Settings, 
      category: "Navigation", 
      action: () => { onNavigate("settings"); onOpenChange(false) },
      shortcut: "G S"
    },
    { 
      id: "profile", 
      label: "Go to Profile", 
      description: "View your profile", 
      icon: User, 
      category: "Navigation", 
      action: () => { onNavigate("profile"); onOpenChange(false) },
      shortcut: "G P"
    },
    
    // Actions
    { 
      id: "create-board", 
      label: "Create New Board", 
      description: "Start a new kanban board", 
      icon: Plus, 
      category: "Actions", 
      action: handleCreateBoard 
    },
    { 
      id: "add-competitor", 
      label: "Track New Competitor", 
      description: "Add a law firm to track", 
      icon: Users, 
      category: "Actions", 
      action: handleAddCompetitor 
    },
    { 
      id: "create-report", 
      label: "Create Report", 
      description: "Generate analysis report", 
      icon: FileText, 
      category: "Actions", 
      action: handleCreateReport 
    },
    { 
      id: "export-data", 
      label: "Export Data", 
      description: "Download your data", 
      icon: Download, 
      category: "Actions", 
      action: handleExportData 
    },
    
    // Help
    { 
      id: "keyboard-shortcuts", 
      label: "Keyboard Shortcuts", 
      description: "View all shortcuts", 
      icon: HelpCircle, 
      category: "Help", 
      action: () => { 
        toast({
          title: "Keyboard Shortcuts",
          description: "⌘K: Command palette | G+H: Home | G+B: Board | G+C: Competitors | G+M: Market Intel",
        })
        onOpenChange(false) 
      } 
    },
    { 
      id: "help-docs", 
      label: "Help & Documentation", 
      description: "View help resources", 
      icon: HelpCircle, 
      category: "Help", 
      action: () => { 
        toast({
          title: "Help Center",
          description: "Documentation coming soon. Contact support@bursor.com for assistance.",
        })
        onOpenChange(false) 
      } 
    },
  ]

  const filteredCommands = commands.filter((cmd) =>
    search === "" ||
    cmd.label.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description?.toLowerCase().includes(search.toLowerCase()) ||
    cmd.category.toLowerCase().includes(search.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = []
    }
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  // Flatten for keyboard navigation
  const flatCommands = filteredCommands

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < flatCommands.length - 1 ? prev + 1 : 0
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : flatCommands.length - 1
          )
          break
        case "Enter":
          e.preventDefault()
          if (flatCommands[selectedIndex]) {
            flatCommands[selectedIndex].action()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, flatCommands, selectedIndex])

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0)
  }, [search])

  let currentIndex = 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 max-w-xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search commands..."
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 px-3"
            autoFocus
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No commands found for "{search}"
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {category}
                </div>
                {items.map((cmd) => {
                  const itemIndex = currentIndex++
                  const isSelected = itemIndex === selectedIndex
                  const Icon = cmd.icon
                  return (
                    <button
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(itemIndex)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                        isSelected
                          ? "bg-primary/10 text-foreground"
                          : "text-foreground/80 hover:bg-secondary"
                      }`}
                    >
                      <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary/20" : "bg-secondary"
                      }`}>
                        <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{cmd.label}</div>
                        {cmd.description && (
                          <div className="text-xs text-muted-foreground truncate">{cmd.description}</div>
                        )}
                      </div>
                      {cmd.shortcut && (
                        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                          {cmd.shortcut}
                        </kbd>
                      )}
                      {isSelected && (
                        <ArrowRight className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border px-4 py-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="h-4 px-1 rounded border bg-muted font-mono text-[10px]">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="h-4 px-1 rounded border bg-muted font-mono text-[10px]">↵</kbd>
              Select
            </span>
          </div>
          <span>
            {filteredCommands.length} command{filteredCommands.length !== 1 ? 's' : ''}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
