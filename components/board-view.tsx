"use client"

import { useState } from "react"
import {
  Plus,
  MoreHorizontal,
  ChevronDown,
  Filter,
  Users,
  GripVertical,
  MessageSquare,
  AlertTriangle,
  FileText,
  Newspaper,
  Radio,
  Target,
  X,
  Clock,
  Share2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SlideOver from "@/components/slide-over"

interface BoardItem {
  id: string
  title: string
  description: string
  type: "ad" | "regulatory" | "filing" | "social" | "news"
  source: string
  severity?: "critical" | "high" | "medium" | "low"
  timestamp: string
  assignee?: string
  comments: number
}

interface Column {
  id: string
  title: string
  items: BoardItem[]
}

const mockBoards = [
  { id: "1", name: "PFAS Litigation", icon: "target" },
  { id: "2", name: "Camp Lejeune", icon: "alert" },
  { id: "3", name: "Class Actions Q1", icon: "file" },
]

const mockColumns: Column[] = [
  {
    id: "new",
    title: "Inbox",
    items: [
      {
        id: "1",
        title: "FDA warning: Acme Pharmaceuticals",
        description: "Contamination protocol violations at Newark facility",
        type: "regulatory",
        source: "FDA",
        severity: "critical",
        timestamp: "2h",
        comments: 3,
      },
      {
        id: "2",
        title: "M&M expands PFAS to 12 new markets",
        description: "Detected $2.3M spend increase across Google and Meta",
        type: "ad",
        source: "Google Ads",
        timestamp: "4h",
        assignee: "JD",
        comments: 1,
      },
      {
        id: "3",
        title: "r/LegalAdvice Camp Lejeune thread",
        description: "500+ users sharing settlement experiences",
        type: "social",
        source: "Reddit",
        severity: "high",
        timestamp: "6h",
        comments: 0,
      },
    ],
  },
  {
    id: "reviewing",
    title: "Reviewing",
    items: [
      {
        id: "4",
        title: "SEC investigation: CryptoLend",
        description: "Formal probe into unregistered securities offerings",
        type: "regulatory",
        source: "SEC",
        severity: "high",
        timestamp: "1d",
        assignee: "SM",
        comments: 5,
      },
      {
        id: "5",
        title: "DataCorp securities class action",
        description: "SDNY filing seeks $450M for investor losses",
        type: "filing",
        source: "SDNY",
        timestamp: "1d",
        assignee: "JD",
        comments: 2,
      },
    ],
  },
  {
    id: "to-share",
    title: "To share",
    items: [
      {
        id: "6",
        title: "Q4 competitor spend analysis",
        description: "Top 10 firms by ad spend with platform breakdown",
        type: "ad",
        source: "Internal",
        timestamp: "2d",
        assignee: "SM",
        comments: 8,
      },
    ],
  },
  {
    id: "actioned",
    title: "Done",
    items: [
      {
        id: "7",
        title: "DOJ settles with PharmaCorp for $2.3B",
        description: "Off-label marketing and kickback allegations resolved",
        type: "regulatory",
        source: "DOJ",
        severity: "medium",
        timestamp: "3d",
        comments: 12,
      },
    ],
  },
  {
    id: "archived",
    title: "Archive",
    items: [],
  },
]

const typeConfig = {
  ad: { color: "border-l-primary", icon: Target, label: "Ad Intel" },
  regulatory: { color: "border-l-red-500", icon: AlertTriangle, label: "Regulatory" },
  filing: { color: "border-l-blue-500", icon: FileText, label: "Filing" },
  social: { color: "border-l-green-500", icon: Radio, label: "Social" },
  news: { color: "border-l-zinc-500", icon: Newspaper, label: "News" },
}

const severityConfig = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
}

export default function BoardView() {
  const [currentBoard, setCurrentBoard] = useState(mockBoards[0])
  const [columns, setColumns] = useState(mockColumns)
  const [selectedItem, setSelectedItem] = useState<BoardItem | null>(null)
  const [filterCount] = useState(0)

  const teamMembers = [
    { initials: "JD", name: "John Doe" },
    { initials: "SM", name: "Sarah Miller" },
    { initials: "RJ", name: "Robert Johnson" },
  ]

  return (
    <div className="h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Board Header */}
      <div className="h-14 border-b border-border px-4 flex items-center justify-between shrink-0 bg-background">
        <div className="flex items-center gap-4">
          {/* Board Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-secondary transition-colors">
                <Target className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{currentBoard.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {mockBoards.map((board) => (
                <DropdownMenuItem
                  key={board.id}
                  onClick={() => setCurrentBoard(board)}
                  className="gap-2"
                >
                  <Target className="h-4 w-4 text-primary" />
                  {board.name}
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-primary">
                <Plus className="h-4 w-4" />
                Create New Board
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Button */}
          <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
            <Filter className="h-3.5 w-3.5" />
            Filter
            {filterCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                {filterCount}
              </Badge>
            )}
          </Button>

          {/* Share Button */}
          <Button variant="outline" size="sm" className="h-8 gap-2 bg-transparent">
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>

          {/* Team Members */}
          <div className="flex -space-x-2">
            {teamMembers.map((member) => (
              <Avatar key={member.initials} className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Board Settings</DropdownMenuItem>
              <DropdownMenuItem>Export Board</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete Board</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full">
          {columns.map((column) => (
            <div key={column.id} className="w-72 shrink-0 flex flex-col">
              {/* Column Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{column.title}</span>
                  <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                    {column.items.length}
                  </Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                      <MoreHorizontal className="h-3.5 w-3.5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Rename Column</DropdownMenuItem>
                    <DropdownMenuItem>Add Automation</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">Delete Column</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Column Content */}
              <div className="flex-1 bg-secondary/30 rounded-lg p-2 overflow-y-auto">
                <div className="space-y-2">
                  {column.items.map((item) => {
                    const config = typeConfig[item.type]
                    const Icon = config.icon
                    return (
                      <Card
                        key={item.id}
                        className={`bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group border-l-2 ${config.color}`}
                        onClick={() => setSelectedItem(item)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                                {item.title}
                              </h4>
                            </div>
                            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 cursor-grab" />
                          </div>

                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-[10px] h-5 gap-1">
                              <Icon className="h-3 w-3" />
                              {item.source}
                            </Badge>
                            {item.severity && (
                              <Badge className={`text-[10px] h-5 ${severityConfig[item.severity]}`}>
                                {item.severity}
                              </Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.timestamp}
                            </div>
                            <div className="flex items-center gap-2">
                              {item.comments > 0 && (
                                <div className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {item.comments}
                                </div>
                              )}
                              {item.assignee && (
                                <Avatar className="h-5 w-5">
                                  <AvatarFallback className="bg-primary/20 text-primary text-[8px]">
                                    {item.assignee}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}

                  {column.items.length === 0 && (
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      <p className="text-xs text-muted-foreground">Drop items here</p>
                    </div>
                  )}
                </div>

                {/* Add Card Button */}
                <button className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                  Add card
                </button>
              </div>
            </div>
          ))}

          {/* Add Column */}
          <div className="w-72 shrink-0">
            <button className="w-full h-10 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary rounded-lg transition-colors">
              <Plus className="h-4 w-4" />
              Add Column
            </button>
          </div>
        </div>
      </div>

      {/* Item Detail Slide-Over */}
      <SlideOver
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="gap-1">
                  {(() => {
                    const config = typeConfig[selectedItem.type]
                    const Icon = config.icon
                    return (
                      <>
                        <Icon className="h-3 w-3" />
                        {config.label}
                      </>
                    )
                  })()}
                </Badge>
                <Badge variant="outline">{selectedItem.source}</Badge>
                {selectedItem.severity && (
                  <Badge className={severityConfig[selectedItem.severity]}>
                    {selectedItem.severity}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Added {selectedItem.timestamp}
              </div>
            </div>

            {/* Related Entities */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Related Entities</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">Morgan & Morgan</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">FDA</Badge>
                <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">PFAS Contamination</Badge>
              </div>
            </div>

            {/* Activity */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Activity</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px]">SM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-medium">Sarah Miller</span> moved this to Reviewing</p>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="bg-primary/20 text-primary text-[10px]">JD</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm"><span className="font-medium">John Doe</span> added a comment</p>
                    <p className="text-sm text-muted-foreground mt-1 bg-secondary/50 p-2 rounded">
                      This looks important - we should flag this for the litigation team.
                    </p>
                    <span className="text-xs text-muted-foreground">4 hours ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <div className="space-y-2">
              <textarea
                placeholder="Add a comment... Use @ to mention"
                className="w-full h-20 px-3 py-2 text-sm bg-secondary/50 border border-border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <div className="flex justify-end">
                <Button size="sm">Post Comment</Button>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Move to...
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {columns.map((col) => (
                    <DropdownMenuItem key={col.id}>{col.title}</DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Assign to...
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {teamMembers.map((member) => (
                    <DropdownMenuItem key={member.initials} className="gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="bg-primary/20 text-primary text-[8px]">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      {member.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive ml-auto">
                Delete
              </Button>
            </div>
          </div>
        )}
      </SlideOver>
    </div>
  )
}
