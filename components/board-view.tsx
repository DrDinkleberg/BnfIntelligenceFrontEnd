"use client"

import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
  useDroppable,
  rectIntersection,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import {
  Plus,
  MoreHorizontal,
  ChevronDown,
  Filter,
  GripVertical,
  MessageSquare,
  AlertTriangle,
  FileText,
  Newspaper,
  Radio,
  Target,
  Clock,
  Share2,
  Download,
  Send,
  Building2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import SlideOver from "@/components/slide-over"
import { AddCardModal } from "@/components/board/add-card-modal"
import { BoardFilterModal } from "@/components/board/board-filter-modal"
import { BoardShareModal } from "@/components/board/board-share-modal"
import { BoardSettingsModal } from "@/components/board/board-settings-modal"
import { useBoardStore, BoardItem, Column } from "@/lib/stores/board-store"

interface BoardComment {
  id: string
  author: string
  authorInitials: string
  text: string
  timestamp: string
}

// Extended BoardItem with full comments for local use
interface BoardItemWithComments extends Omit<BoardItem, 'comments'> {
  comments: BoardComment[]
}

interface ColumnWithComments extends Omit<Column, 'items'> {
  items: BoardItemWithComments[]
}

interface TeamMember {
  id: string
  initials: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
}

const initialTeamMembers: TeamMember[] = [
  { id: 'tm1', initials: 'JD', name: 'John Doe', email: 'john@bnf.com', role: 'owner' },
  { id: 'tm2', initials: 'SM', name: 'Sarah Miller', email: 'sarah@bnf.com', role: 'editor' },
  { id: 'tm3', initials: 'RJ', name: 'Robert Johnson', email: 'robert@bnf.com', role: 'viewer' },
]

const typeConfig: Record<string, { color: string; icon: any; label: string }> = {
  ad: { color: "border-l-primary", icon: Target, label: "Ad Intel" },
  regulatory: { color: "border-l-red-500", icon: AlertTriangle, label: "Regulatory" },
  filing: { color: "border-l-blue-500", icon: FileText, label: "Filing" },
  social: { color: "border-l-green-500", icon: Radio, label: "Social" },
  news: { color: "border-l-zinc-500", icon: Newspaper, label: "News" },
  competitor: { color: "border-l-purple-500", icon: Building2, label: "Competitor" },
}

const severityConfig: Record<string, string> = {
  critical: "bg-red-500/20 text-red-400",
  high: "bg-orange-500/20 text-orange-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-green-500/20 text-green-400",
}

// Sortable Card Component
function SortableCard({ item, onClick }: { item: BoardItemWithComments; onClick: () => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: item.id,
    data: {
      type: 'item',
      item,
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const config = typeConfig[item.type] || typeConfig.news
  const Icon = config.icon

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group border-l-2 ${config.color}`}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h4>
          </div>
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
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

        {/* Show metadata for competitors */}
        {item.type === "competitor" && item.metadata && (
          <div className="mb-2">
            <p className="text-xs text-muted-foreground line-clamp-1">
              {item.description}
            </p>
            {item.metadata.practiceAreas && (
              <div className="flex flex-wrap gap-1 mt-1">
                {item.metadata.practiceAreas.slice(0, 2).map((area) => (
                  <Badge key={area} variant="secondary" className="text-[9px] h-4">
                    {area}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {item.timestamp}
          </div>
          <div className="flex items-center gap-2">
            {item.comments && item.comments.length > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                {item.comments.length}
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
}

// Droppable Column Component
function DroppableColumn({ 
  column, 
  children, 
  onAddCard,
  itemCount,
}: { 
  column: ColumnWithComments
  children: React.ReactNode
  onAddCard: () => void
  itemCount: number
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'column',
      column,
    }
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 rounded-lg p-2 overflow-y-auto min-h-[200px] transition-all duration-200 ${
        isOver 
          ? 'bg-primary/20 ring-2 ring-primary ring-offset-2 ring-offset-background' 
          : 'bg-secondary/30'
      }`}
    >
      <div className="space-y-2">
        {children}
      </div>

      {itemCount === 0 && !isOver && (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center mt-2">
          <p className="text-xs text-muted-foreground">Drop items here</p>
        </div>
      )}

      {isOver && itemCount === 0 && (
        <div className="border-2 border-dashed border-primary rounded-lg p-6 text-center mt-2 bg-primary/10">
          <p className="text-xs text-primary font-medium">Release to drop here</p>
        </div>
      )}

      {/* Add Card Button */}
      <button
        className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-colors"
        onClick={onAddCard}
      >
        <Plus className="h-3.5 w-3.5" />
        Add card
      </button>
    </div>
  )
}

// Card overlay for drag preview
function CardOverlay({ item }: { item: BoardItemWithComments }) {
  const config = typeConfig[item.type] || typeConfig.news
  const Icon = config.icon

  return (
    <Card className={`bg-card border-border border-l-2 ${config.color} shadow-xl w-[272px] rotate-3`}>
      <CardContent className="p-3">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-foreground line-clamp-2">
              {item.title}
            </h4>
          </div>
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
        </div>
        <div className="flex items-center gap-2">
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
      </CardContent>
    </Card>
  )
}

export default function BoardView() {
  // Get data from the shared board store
  const {
    boards,
    currentBoardId,
    setCurrentBoard,
    getColumnsByBoardId,
    getBoardById,
  } = useBoardStore()

  const currentBoard = getBoardById(currentBoardId)
  const storeColumns = getColumnsByBoardId(currentBoardId)

  // Local state for columns (initialized from store, allows local DnD mutations)
  // This syncs with store on mount and when currentBoardId changes
  const [columns, setColumns] = useState<ColumnWithComments[]>(() => 
    storeColumns.map(col => ({
      ...col,
      items: col.items.map(item => ({
        ...item,
        comments: (item as any).comments || [],
      }))
    }))
  )

  // Sync columns when store changes (e.g., when competitor is added from another view)
  // Using a ref to track if we need to sync
  const [lastSyncedBoardId, setLastSyncedBoardId] = useState(currentBoardId)
  
  if (currentBoardId !== lastSyncedBoardId || storeColumns.length !== columns.length) {
    const newColumns = storeColumns.map(col => ({
      ...col,
      items: col.items.map(item => {
        // Preserve existing comments if the item already exists locally
        const existingItem = columns.flatMap(c => c.items).find(i => i.id === item.id)
        return {
          ...item,
          comments: existingItem?.comments || (item as any).comments || [],
        }
      })
    }))
    setColumns(newColumns)
    setLastSyncedBoardId(currentBoardId)
  }

  const [selectedItem, setSelectedItem] = useState<BoardItemWithComments | null>(null)
  const [activeItem, setActiveItem] = useState<BoardItemWithComments | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers)
  const [newComment, setNewComment] = useState('')

  // Modal states
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [addCardColumnId, setAddCardColumnId] = useState<string>('')
  const [addCardColumnName, setAddCardColumnName] = useState<string>('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [addColumnOpen, setAddColumnOpen] = useState(false)
  const [newColumnName, setNewColumnName] = useState('')

  // Filter state
  const [filters, setFilters] = useState({
    types: [] as string[],
    severities: [] as string[],
    assignees: [] as string[],
  })

  const filterCount = filters.types.length + filters.severities.length + filters.assignees.length

  // DnD sensors - lower distance for easier dragging
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  // Find which column contains an item
  const findColumnByItemId = (itemId: string): ColumnWithComments | undefined => {
    return columns.find(col => col.items.some(item => item.id === itemId))
  }

  // Find item by ID
  const findItemById = (itemId: string): BoardItemWithComments | undefined => {
    for (const col of columns) {
      const item = col.items.find(i => i.id === itemId)
      if (item) return item
    }
    return undefined
  }

  // Handle drag start
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const item = findItemById(active.id as string)
    setActiveItem(item || null)
  }

  // Handle drag over - move between columns
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Get the source column
    const sourceColumn = findColumnByItemId(activeId)
    if (!sourceColumn) return

    // Determine target column
    let targetColumnId: string | null = null

    // Check if over a column directly (column-{id} format)
    if (overId.startsWith('column-')) {
      targetColumnId = overId.replace('column-', '')
    } else {
      // Over an item - find its column
      const overColumn = findColumnByItemId(overId)
      if (overColumn) {
        targetColumnId = overColumn.id
      }
    }

    // If no valid target or same column, skip
    if (!targetColumnId || sourceColumn.id === targetColumnId) return

    // Move the item to the new column
    setColumns(prev => {
      const newColumns = prev.map(col => ({
        ...col,
        items: [...col.items]
      }))

      const sourceColIndex = newColumns.findIndex(c => c.id === sourceColumn.id)
      const targetColIndex = newColumns.findIndex(c => c.id === targetColumnId)

      if (sourceColIndex === -1 || targetColIndex === -1) return prev

      // Find and remove item from source
      const itemIndex = newColumns[sourceColIndex].items.findIndex(i => i.id === activeId)
      if (itemIndex === -1) return prev

      const [movedItem] = newColumns[sourceColIndex].items.splice(itemIndex, 1)

      // If over an item, insert at that position, otherwise add to end
      if (!overId.startsWith('column-')) {
        const overItemIndex = newColumns[targetColIndex].items.findIndex(i => i.id === overId)
        if (overItemIndex !== -1) {
          newColumns[targetColIndex].items.splice(overItemIndex, 0, movedItem)
        } else {
          newColumns[targetColIndex].items.push(movedItem)
        }
      } else {
        // Dropped on column itself - add to end
        newColumns[targetColIndex].items.push(movedItem)
      }

      return newColumns
    })
  }

  // Handle drag end - reorder within same column
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    // Skip if dropped on a column
    if (overId.startsWith('column-')) return

    // Skip if same item
    if (activeId === overId) return

    // Check if in same column (reordering)
    const activeColumn = findColumnByItemId(activeId)
    const overColumn = findColumnByItemId(overId)

    if (!activeColumn || !overColumn) return
    if (activeColumn.id !== overColumn.id) return // Different columns handled in dragOver

    // Reorder within same column
    setColumns(prev => {
      const newColumns = prev.map(col => ({
        ...col,
        items: [...col.items]
      }))

      const colIndex = newColumns.findIndex(c => c.id === activeColumn.id)
      if (colIndex === -1) return prev

      const activeIndex = newColumns[colIndex].items.findIndex(i => i.id === activeId)
      const overIndex = newColumns[colIndex].items.findIndex(i => i.id === overId)

      if (activeIndex === -1 || overIndex === -1) return prev

      newColumns[colIndex].items = arrayMove(newColumns[colIndex].items, activeIndex, overIndex)

      return newColumns
    })
  }

  // Move card to a different column (from slide-over dropdown)
  const handleMoveCard = (itemId: string, targetColumnId: string) => {
    setColumns(prev => {
      const newColumns = prev.map(col => ({
        ...col,
        items: [...col.items]
      }))

      // Find and remove from current column
      let movedItem: BoardItemWithComments | null = null
      for (const col of newColumns) {
        const itemIndex = col.items.findIndex(i => i.id === itemId)
        if (itemIndex !== -1) {
          [movedItem] = col.items.splice(itemIndex, 1)
          break
        }
      }

      // Add to target column
      if (movedItem) {
        const targetCol = newColumns.find(c => c.id === targetColumnId)
        if (targetCol) {
          targetCol.items.unshift(movedItem)
        }
      }

      return newColumns
    })

    setSelectedItem(null)
  }

  // Handle add card modal
  const handleOpenAddCard = (columnId: string, columnName: string) => {
    setAddCardColumnId(columnId)
    setAddCardColumnName(columnName)
    setAddCardOpen(true)
  }

  const handleAddItems = (items: any[]) => {
    setColumns(prev =>
      prev.map(col =>
        col.id === addCardColumnId
          ? {
              ...col,
              items: [
                ...items.map(item => ({
                  ...item,
                  id: `${item.id}-${Date.now()}`,
                  comments: [],
                })),
                ...col.items,
              ],
            }
          : col
      )
    )
  }

  // Handle add column
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return

    const newColumn: ColumnWithComments = {
      id: `column-${Date.now()}`,
      title: newColumnName.trim(),
      items: [],
    }

    setColumns(prev => [...prev, newColumn])
    setNewColumnName('')
    setAddColumnOpen(false)
  }

  // Handle post comment
  const handlePostComment = () => {
    if (!selectedItem || !newComment.trim()) return

    const comment: BoardComment = {
      id: `comment-${Date.now()}`,
      author: 'You',
      authorInitials: 'ME',
      text: newComment.trim(),
      timestamp: 'Just now',
    }

    setColumns(prev =>
      prev.map(col => ({
        ...col,
        items: col.items.map(item =>
          item.id === selectedItem.id
            ? { ...item, comments: [...item.comments, comment] }
            : item
        ),
      }))
    )

    setSelectedItem(prev =>
      prev ? { ...prev, comments: [...prev.comments, comment] } : null
    )

    setNewComment('')
  }

  // Handle delete card
  const handleDeleteCard = (itemId: string) => {
    setColumns(prev =>
      prev.map(col => ({
        ...col,
        items: col.items.filter(item => item.id !== itemId),
      }))
    )
    setSelectedItem(null)
  }

  // Handle export
  const handleExport = (format: 'csv' | 'json') => {
    const data = columns.flatMap(col =>
      col.items.map(item => ({
        column: col.title,
        title: item.title,
        description: item.description,
        type: item.type,
        source: item.source,
        severity: item.severity || '',
        timestamp: item.timestamp,
        assignee: item.assignee || '',
        commentCount: item.comments.length,
      }))
    )

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentBoard?.name.replace(/\s+/g, '-').toLowerCase() || 'board'}-export.json`
      a.click()
    } else {
      const headers = ['Column', 'Title', 'Description', 'Type', 'Source', 'Severity', 'Timestamp', 'Assignee', 'Comments']
      const csv = [
        headers.join(','),
        ...data.map(item =>
          [
            `"${item.column}"`,
            `"${item.title.replace(/"/g, '""')}"`,
            `"${item.description.replace(/"/g, '""')}"`,
            item.type,
            item.source,
            item.severity,
            item.timestamp,
            item.assignee,
            item.commentCount,
          ].join(',')
        ),
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${currentBoard?.name.replace(/\s+/g, '-').toLowerCase() || 'board'}-export.csv`
      a.click()
    }
  }

  // Filter items
  const getFilteredItems = (items: BoardItemWithComments[]) => {
    if (filterCount === 0) return items

    return items.filter(item => {
      const typeMatch = filters.types.length === 0 || filters.types.includes(item.type)
      const severityMatch =
        filters.severities.length === 0 ||
        (item.severity && filters.severities.includes(item.severity))
      const assigneeMatch =
        filters.assignees.length === 0 ||
        (item.assignee && filters.assignees.includes(item.assignee)) ||
        (!item.assignee && filters.assignees.includes('unassigned'))

      return typeMatch && severityMatch && assigneeMatch
    })
  }

  // Get current column for selected item
  const getSelectedItemColumn = () => {
    if (!selectedItem) return null
    return findColumnByItemId(selectedItem.id)
  }

  if (!currentBoard) {
    return (
      <div className="h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <p className="text-muted-foreground">No board selected</p>
      </div>
    )
  }

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
              {boards.map(board => (
                <DropdownMenuItem
                  key={board.id}
                  onClick={() => setCurrentBoard(board.id)}
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
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 bg-transparent"
            onClick={() => setFilterOpen(true)}
          >
            <Filter className="h-3.5 w-3.5" />
            Filter
            {filterCount > 0 && (
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                {filterCount}
              </Badge>
            )}
          </Button>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 bg-transparent"
            onClick={() => setShareOpen(true)}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </Button>

          {/* Team Members */}
          <div className="flex -space-x-2">
            {teamMembers.slice(0, 4).map(member => (
              <Avatar key={member.initials} className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {teamMembers.length > 4 && (
              <Avatar className="h-7 w-7 border-2 border-background">
                <AvatarFallback className="bg-secondary text-muted-foreground text-[10px]">
                  +{teamMembers.length - 4}
                </AvatarFallback>
              </Avatar>
            )}
          </div>

          {/* More Options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                Board Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('csv')}>
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExport('json')}>
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Delete Board</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Kanban Columns with DnD */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4 h-full">
            {columns.map(column => {
              const filteredItems = getFilteredItems(column.items)

              return (
                <div key={column.id} className="w-72 shrink-0 flex flex-col">
                  {/* Column Header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-foreground">{column.title}</span>
                      <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                        {filteredItems.length}
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

                  {/* Column Content - Droppable */}
                  <SortableContext
                    items={filteredItems.map(i => i.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <DroppableColumn
                      column={column}
                      onAddCard={() => handleOpenAddCard(column.id, column.title)}
                      itemCount={filteredItems.length}
                    >
                      {filteredItems.map(item => (
                        <SortableCard
                          key={item.id}
                          item={item}
                          onClick={() => setSelectedItem(item)}
                        />
                      ))}
                    </DroppableColumn>
                  </SortableContext>
                </div>
              )
            })}

            {/* Add Column */}
            <div className="w-72 shrink-0">
              <button 
                onClick={() => setAddColumnOpen(true)}
                className="w-full h-10 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground bg-secondary/30 hover:bg-secondary rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" />
                Add Column
              </button>
            </div>
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay dropAnimation={null}>
          {activeItem ? <CardOverlay item={activeItem} /> : null}
        </DragOverlay>
      </DndContext>

      {/* Item Detail Slide-Over */}
      <SlideOver
        open={!!selectedItem}
        onClose={() => {
          setSelectedItem(null)
          setNewComment('')
        }}
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="p-6 space-y-6">
            {/* Type and Source badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                {(() => {
                  const config = typeConfig[selectedItem.type] || typeConfig.news
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

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Description
              </h4>
              <p className="text-sm text-foreground">{selectedItem.description}</p>
            </div>

            {/* Competitor Metadata */}
            {selectedItem.type === "competitor" && selectedItem.metadata && (
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Competitor Details
                </h4>
                {selectedItem.metadata.website && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Website:</span>
                    <a
                      href={`https://${selectedItem.metadata.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline"
                    >
                      {selectedItem.metadata.website}
                    </a>
                  </div>
                )}
                {selectedItem.metadata.location && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Location:</span>
                    <span className="text-xs">{selectedItem.metadata.location}</span>
                  </div>
                )}
                {selectedItem.metadata.practiceAreas && selectedItem.metadata.practiceAreas.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground block mb-1">Practice Areas:</span>
                    <div className="flex flex-wrap gap-1">
                      {selectedItem.metadata.practiceAreas.map((area) => (
                        <Badge key={area} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Added {selectedItem.timestamp} ago
            </div>

            {/* Comments */}
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Comments ({selectedItem.comments?.length || 0})
              </h4>
              
              {selectedItem.comments && selectedItem.comments.length > 0 && (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {selectedItem.comments.map(comment => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-7 w-7 shrink-0">
                        <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                          {comment.authorInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{comment.author}</span>
                          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">{comment.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <textarea
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 h-20 px-3 py-2 text-sm bg-secondary/50 border border-border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handlePostComment()
                    }
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Ctrl+Enter to post</span>
                <Button size="sm" onClick={handlePostComment} disabled={!newComment.trim()}>
                  <Send className="h-3 w-3 mr-1" />
                  Post Comment
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-4 border-t border-border">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-transparent">
                    Move to...
                    <ChevronDown className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {columns.map(col => {
                    const isCurrent = getSelectedItemColumn()?.id === col.id
                    return (
                      <DropdownMenuItem 
                        key={col.id}
                        onClick={() => !isCurrent && handleMoveCard(selectedItem.id, col.id)}
                        disabled={isCurrent}
                        className={isCurrent ? 'opacity-50' : ''}
                      >
                        {col.title}
                        {isCurrent && (
                          <span className="ml-2 text-xs text-muted-foreground">(current)</span>
                        )}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-destructive hover:text-destructive ml-auto"
                onClick={() => handleDeleteCard(selectedItem.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </SlideOver>

      {/* Modals */}
      <AddCardModal
        open={addCardOpen}
        onOpenChange={setAddCardOpen}
        onAddItems={handleAddItems}
        columnId={addCardColumnId}
        columnName={addCardColumnName}
      />

      <BoardFilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        filters={filters}
        onApplyFilters={setFilters}
        teamMembers={teamMembers.map(m => ({ initials: m.initials, name: m.name }))}
      />

      <BoardShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        boardName={currentBoard.name}
        members={teamMembers}
        onUpdateMembers={setTeamMembers}
      />

      <BoardSettingsModal
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={{
          name: currentBoard.name,
          description: '',
          columns: columns.map(c => ({ id: c.id, title: c.title })),
          showArchived: true,
          autoArchiveDays: 30,
        }}
        onSaveSettings={(settings) => {
          // Board name update would go to store in future
          console.log('Save settings:', settings)
        }}
        onDeleteBoard={() => {
          console.log('Delete board')
        }}
      />

      {/* Add Column Dialog */}
      <Dialog open={addColumnOpen} onOpenChange={setAddColumnOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Column</DialogTitle>
            <DialogDescription>
              Create a new column for organizing your board items.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Column name..."
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddColumn()
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddColumnOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddColumn} disabled={!newColumnName.trim()}>
              Add Column
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}