"use client"

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"

// ============================================
// Types
// ============================================

export interface BoardItem {
  id: string
  title: string
  description: string
  type: "ad" | "regulatory" | "filing" | "social" | "news" | "competitor"
  source: string
  severity?: "critical" | "high" | "medium" | "low"
  timestamp: string
  assignee?: string
  comments: number
  // Additional metadata
  metadata?: {
    // Market intel metadata
    entities?: string[]
    sentiment?: "positive" | "neutral" | "negative"
    engagement?: { likes: number; comments: number; shares: number }
    date?: string
    // Competitor metadata
    competitorId?: string
    website?: string
    location?: string
    practiceAreas?: string[]
    isTracked?: boolean
  }
}

export interface Column {
  id: string
  title: string
  items: BoardItem[]
}

export interface Board {
  id: string
  name: string
  icon: string
  columns: Column[]
}

interface BoardStore {
  boards: Board[]
  currentBoardId: string
  setCurrentBoard: (boardId: string) => void
  addItemToBoard: (boardId: string, columnId: string, item: Omit<BoardItem, "id">) => void
  moveItem: (boardId: string, itemId: string, fromColumnId: string, toColumnId: string) => void
  removeItem: (boardId: string, columnId: string, itemId: string) => void
  updateItem: (boardId: string, columnId: string, itemId: string, updates: Partial<BoardItem>) => void
  addColumn: (boardId: string, column: Omit<Column, "items">) => void
  removeColumn: (boardId: string, columnId: string) => void
  createBoard: (board: Omit<Board, "columns"> & { columns?: Column[] }) => void
  getBoardById: (boardId: string) => Board | undefined
  getColumnsByBoardId: (boardId: string) => Column[]
}

// ============================================
// Initial Data
// ============================================

const initialBoards: Board[] = [
  {
    id: "1",
    name: "PFAS Litigation",
    icon: "target",
    columns: [
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
    ],
  },
  {
    id: "2",
    name: "Camp Lejeune",
    icon: "alert",
    columns: [
      { id: "new", title: "Inbox", items: [] },
      { id: "reviewing", title: "Reviewing", items: [] },
      { id: "actioned", title: "Done", items: [] },
    ],
  },
  {
    id: "3",
    name: "Class Actions Q1",
    icon: "file",
    columns: [
      { id: "leads", title: "Leads", items: [] },
      { id: "qualified", title: "Qualified", items: [] },
      { id: "pursuing", title: "Pursuing", items: [] },
      { id: "closed", title: "Closed", items: [] },
    ],
  },
  {
    id: "4",
    name: "Competitor Analysis",
    icon: "users",
    columns: [
      { id: "monitoring", title: "Monitoring", items: [] },
      { id: "analyzing", title: "Analyzing", items: [] },
      { id: "reported", title: "Reported", items: [] },
    ],
  },
]

// ============================================
// Context
// ============================================

const BoardContext = createContext<BoardStore | null>(null)

// ============================================
// Provider
// ============================================

interface BoardProviderProps {
  children: ReactNode
}

export function BoardProvider({ children }: BoardProviderProps) {
  const [boards, setBoards] = useState<Board[]>(initialBoards)
  const [currentBoardId, setCurrentBoardId] = useState<string>(initialBoards[0].id)

  // Generate unique ID
  const generateId = useCallback(() => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }, [])

  // Set current board
  const setCurrentBoard = useCallback((boardId: string) => {
    setCurrentBoardId(boardId)
  }, [])

  // Add item to a board column
  const addItemToBoard = useCallback((boardId: string, columnId: string, item: Omit<BoardItem, "id">) => {
    const newItem: BoardItem = {
      ...item,
      id: generateId(),
    }

    setBoards(prevBoards =>
      prevBoards.map(board => {
        if (board.id !== boardId) return board
        return {
          ...board,
          columns: board.columns.map(column => {
            if (column.id !== columnId) return column
            return {
              ...column,
              items: [newItem, ...column.items], // Add to top of column
            }
          }),
        }
      })
    )

    return newItem.id
  }, [generateId])

  // Move item between columns
  const moveItem = useCallback((boardId: string, itemId: string, fromColumnId: string, toColumnId: string) => {
    setBoards(prevBoards =>
      prevBoards.map(board => {
        if (board.id !== boardId) return board

        let itemToMove: BoardItem | undefined

        // Find and remove item from source column
        const updatedColumns = board.columns.map(column => {
          if (column.id === fromColumnId) {
            const item = column.items.find(i => i.id === itemId)
            if (item) itemToMove = item
            return {
              ...column,
              items: column.items.filter(i => i.id !== itemId),
            }
          }
          return column
        })

        // Add item to target column
        if (itemToMove) {
          return {
            ...board,
            columns: updatedColumns.map(column => {
              if (column.id === toColumnId) {
                return {
                  ...column,
                  items: [itemToMove!, ...column.items],
                }
              }
              return column
            }),
          }
        }

        return board
      })
    )
  }, [])

  // Remove item from board
  const removeItem = useCallback((boardId: string, columnId: string, itemId: string) => {
    setBoards(prevBoards =>
      prevBoards.map(board => {
        if (board.id !== boardId) return board
        return {
          ...board,
          columns: board.columns.map(column => {
            if (column.id !== columnId) return column
            return {
              ...column,
              items: column.items.filter(item => item.id !== itemId),
            }
          }),
        }
      })
    )
  }, [])

  // Update item
  const updateItem = useCallback((boardId: string, columnId: string, itemId: string, updates: Partial<BoardItem>) => {
    setBoards(prevBoards =>
      prevBoards.map(board => {
        if (board.id !== boardId) return board
        return {
          ...board,
          columns: board.columns.map(column => {
            if (column.id !== columnId) return column
            return {
              ...column,
              items: column.items.map(item => {
                if (item.id !== itemId) return item
                return { ...item, ...updates }
              }),
            }
          }),
        }
      })
    )
  }, [])

  // Add column to board
  const addColumn = useCallback((boardId: string, column: Omit<Column, "items">) => {
    setBoards(prevBoards =>
      prevBoards.map(board => {
        if (board.id !== boardId) return board
        return {
          ...board,
          columns: [...board.columns, { ...column, items: [] }],
        }
      })
    )
  }, [])

  // Remove column from board
  const removeColumn = useCallback((boardId: string, columnId: string) => {
    setBoards(prevBoards =>
      prevBoards.map(board => {
        if (board.id !== boardId) return board
        return {
          ...board,
          columns: board.columns.filter(column => column.id !== columnId),
        }
      })
    )
  }, [])

  // Create new board
  const createBoard = useCallback((board: Omit<Board, "columns"> & { columns?: Column[] }) => {
    const newBoard: Board = {
      ...board,
      id: generateId(),
      columns: board.columns || [
        { id: "new", title: "Inbox", items: [] },
        { id: "in-progress", title: "In Progress", items: [] },
        { id: "done", title: "Done", items: [] },
      ],
    }

    setBoards(prevBoards => [...prevBoards, newBoard])
    return newBoard.id
  }, [generateId])

  // Get board by ID
  const getBoardById = useCallback((boardId: string) => {
    return boards.find(board => board.id === boardId)
  }, [boards])

  // Get columns by board ID
  const getColumnsByBoardId = useCallback((boardId: string) => {
    const board = boards.find(b => b.id === boardId)
    return board?.columns || []
  }, [boards])

  const value: BoardStore = {
    boards,
    currentBoardId,
    setCurrentBoard,
    addItemToBoard,
    moveItem,
    removeItem,
    updateItem,
    addColumn,
    removeColumn,
    createBoard,
    getBoardById,
    getColumnsByBoardId,
  }

  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>
}

// ============================================
// Hook
// ============================================

export function useBoardStore() {
  const context = useContext(BoardContext)
  if (!context) {
    throw new Error("useBoardStore must be used within a BoardProvider")
  }
  return context
}

// ============================================
// Helper to create competitor board item
// ============================================

export function createCompetitorBoardItem(competitor: {
  id: string
  name: string
  location: string
  website: string
  practiceAreas: string[]
  isTracked: boolean
  totalAdSpend?: number
  activeCampaigns?: number
}): Omit<BoardItem, "id"> {
  return {
    title: competitor.name,
    description: `${competitor.location} • ${competitor.practiceAreas.slice(0, 2).join(", ")}`,
    type: "competitor",
    source: "Competitors",
    timestamp: "Just now",
    comments: 0,
    metadata: {
      competitorId: competitor.id,
      website: competitor.website,
      location: competitor.location,
      practiceAreas: competitor.practiceAreas,
      isTracked: competitor.isTracked,
    },
  }
}
