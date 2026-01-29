'use client'

import { useState } from 'react'
import {
  Settings,
  GripVertical,
  Plus,
  Trash2,
  Edit3,
  Check,
  X,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

interface Column {
  id: string
  title: string
}

interface BoardSettings {
  name: string
  description: string
  columns: Column[]
  showArchived: boolean
  autoArchiveDays: number
}

interface BoardSettingsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: BoardSettings
  onSaveSettings: (settings: BoardSettings) => void
  onDeleteBoard: () => void
}

export function BoardSettingsModal({
  open,
  onOpenChange,
  settings,
  onSaveSettings,
  onDeleteBoard,
}: BoardSettingsModalProps) {
  const [localSettings, setLocalSettings] = useState<BoardSettings>(settings)
  const [editingColumnId, setEditingColumnId] = useState<string | null>(null)
  const [editingColumnName, setEditingColumnName] = useState('')
  const [newColumnName, setNewColumnName] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleNameChange = (name: string) => {
    setLocalSettings((prev) => ({ ...prev, name }))
  }

  const handleDescriptionChange = (description: string) => {
    setLocalSettings((prev) => ({ ...prev, description }))
  }

  const handleAddColumn = () => {
    if (newColumnName.trim()) {
      const newColumn: Column = {
        id: `col-${Date.now()}`,
        title: newColumnName.trim(),
      }
      setLocalSettings((prev) => ({
        ...prev,
        columns: [...prev.columns, newColumn],
      }))
      setNewColumnName('')
    }
  }

  const handleDeleteColumn = (columnId: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      columns: prev.columns.filter((c) => c.id !== columnId),
    }))
  }

  const handleStartEditColumn = (column: Column) => {
    setEditingColumnId(column.id)
    setEditingColumnName(column.title)
  }

  const handleSaveColumnEdit = () => {
    if (editingColumnName.trim() && editingColumnId) {
      setLocalSettings((prev) => ({
        ...prev,
        columns: prev.columns.map((c) =>
          c.id === editingColumnId ? { ...c, title: editingColumnName.trim() } : c
        ),
      }))
    }
    setEditingColumnId(null)
    setEditingColumnName('')
  }

  const handleCancelColumnEdit = () => {
    setEditingColumnId(null)
    setEditingColumnName('')
  }

  const handleMoveColumn = (columnId: string, direction: 'up' | 'down') => {
    const index = localSettings.columns.findIndex((c) => c.id === columnId)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === localSettings.columns.length - 1)
    ) {
      return
    }

    const newColumns = [...localSettings.columns]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    ;[newColumns[index], newColumns[newIndex]] = [newColumns[newIndex], newColumns[index]]

    setLocalSettings((prev) => ({ ...prev, columns: newColumns }))
  }

  const handleSave = () => {
    onSaveSettings(localSettings)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDeleteBoard()
      onOpenChange(false)
    } else {
      setShowDeleteConfirm(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Board Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Board Name */}
          <div className="space-y-2">
            <Label htmlFor="boardName">Board Name</Label>
            <Input
              id="boardName"
              value={localSettings.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter board name..."
            />
          </div>

          {/* Board Description */}
          <div className="space-y-2">
            <Label htmlFor="boardDesc">Description (optional)</Label>
            <Input
              id="boardDesc"
              value={localSettings.description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Describe this board..."
            />
          </div>

          <Separator />

          {/* Columns */}
          <div className="space-y-3">
            <Label>Columns</Label>
            <div className="space-y-2">
              {localSettings.columns.map((column, index) => (
                <div
                  key={column.id}
                  className="flex items-center gap-2 p-2 bg-secondary/30 rounded-md group"
                >
                  <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />

                  {editingColumnId === column.id ? (
                    <>
                      <Input
                        value={editingColumnName}
                        onChange={(e) => setEditingColumnName(e.target.value)}
                        className="flex-1 h-8"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveColumnEdit()
                          if (e.key === 'Escape') handleCancelColumnEdit()
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleSaveColumnEdit}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleCancelColumnEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">{column.title}</span>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMoveColumn(column.id, 'up')}
                          disabled={index === 0}
                        >
                          ↑
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleMoveColumn(column.id, 'down')}
                          disabled={index === localSettings.columns.length - 1}
                        >
                          ↓
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleStartEditColumn(column)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteColumn(column.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {/* Add Column */}
              <div className="flex items-center gap-2">
                <Input
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="New column name..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddColumn()
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddColumn}
                  disabled={!newColumnName.trim()}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Options */}
          <div className="space-y-4">
            <Label>Options</Label>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Archived Items</p>
                <p className="text-xs text-muted-foreground">Display archived cards in a separate column</p>
              </div>
              <Switch
                checked={localSettings.showArchived}
                onCheckedChange={(checked) =>
                  setLocalSettings((prev) => ({ ...prev, showArchived: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Auto-Archive</p>
                <p className="text-xs text-muted-foreground">
                  Automatically archive items in "Done" after
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={0}
                  max={365}
                  value={localSettings.autoArchiveDays}
                  onChange={(e) =>
                    setLocalSettings((prev) => ({
                      ...prev,
                      autoArchiveDays: parseInt(e.target.value) || 0,
                    }))
                  }
                  className="w-16 h-8"
                />
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Danger Zone */}
          <div className="space-y-3">
            <Label className="text-destructive">Danger Zone</Label>
            {showDeleteConfirm ? (
              <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-md">
                <p className="text-sm text-destructive mb-3">
                  Are you sure? This action cannot be undone.
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                  >
                    Yes, Delete Board
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Board
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
