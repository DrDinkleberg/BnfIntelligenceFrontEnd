"use client"

import React from "react"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

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
}

export default function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (!open) {
      setSearch("")
    }
  }, [open])

  const commands: CommandItem[] = [
    // Recent
    { id: "recent-1", label: "Morgan & Morgan", description: "Competitor profile viewed 2h ago", icon: Users, category: "Recent", action: () => { onNavigate("competitors"); onOpenChange(false) } },
    { id: "recent-2", label: "FDA Warning - Pharmaceutical", description: "Event viewed yesterday", icon: AlertTriangle, category: "Recent", action: () => { onNavigate("market-intel"); onOpenChange(false) } },
    // Navigation
    { id: "home", label: "Go to Home", description: "Dashboard overview", icon: Home, category: "Navigation", action: () => { onNavigate("home"); onOpenChange(false) } },
    { id: "board", label: "Go to Board", description: "Kanban workspace", icon: Target, category: "Navigation", action: () => { onNavigate("board"); onOpenChange(false) } },
    { id: "competitors", label: "Go to Competitors", description: "Track law firms", icon: Users, category: "Navigation", action: () => { onNavigate("competitors"); onOpenChange(false) } },
    { id: "market-intel", label: "Go to Market Intel", description: "Browse all intelligence", icon: Newspaper, category: "Navigation", action: () => { onNavigate("market-intel"); onOpenChange(false) } },
    // Actions
    { id: "create-board", label: "Create Board", description: "New kanban board", icon: Target, category: "Actions", action: () => { onNavigate("board"); onOpenChange(false) } },
    { id: "add-competitor", label: "Track New Competitor", description: "Add firm to track", icon: Users, category: "Actions", action: () => { onNavigate("competitors"); onOpenChange(false) } },
    { id: "generate-report", label: "Generate Report", description: "Export intelligence report", icon: FileText, category: "Actions", action: () => { onOpenChange(false) } },
    // Settings
    { id: "settings", label: "Settings", description: "Account preferences", icon: Settings, category: "Settings", action: () => { onOpenChange(false) } },
    { id: "help", label: "Help & Support", description: "Get assistance", icon: HelpCircle, category: "Settings", action: () => { onOpenChange(false) } },
  ]

  const filteredCommands = commands.filter(
    (cmd) =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.description?.toLowerCase().includes(search.toLowerCase())
  )

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = []
    acc[cmd.category].push(cmd)
    return acc
  }, {} as Record<string, CommandItem[]>)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0 bg-popover border-border overflow-hidden">
        <div className="border-b border-border">
          <div className="flex items-center px-3">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              placeholder="Search commands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12 text-sm bg-transparent"
              autoFocus
            />
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>
        </div>
        <div className="max-h-[300px] overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([category, items]) => (
            <div key={category} className="mb-3">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {category}
              </div>
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm hover:bg-secondary transition-colors text-left group"
                  >
                    <div className="h-8 w-8 rounded-md bg-secondary flex items-center justify-center group-hover:bg-primary/20">
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground">{item.label}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No commands found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
