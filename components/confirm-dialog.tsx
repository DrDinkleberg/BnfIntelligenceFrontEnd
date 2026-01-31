'use client'

import React, { useState, useCallback, createContext, useContext } from 'react'
import { AlertTriangle, Trash2, LogOut, XCircle, AlertCircle, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

// ============================================
// Confirm Dialog Component
// ============================================

type ConfirmVariant = 'danger' | 'warning' | 'info'

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  confirmText?: string // If provided, user must type this to confirm
  isLoading?: boolean
}

const variantConfig = {
  danger: {
    icon: Trash2,
    iconClass: 'text-destructive',
    iconBgClass: 'bg-destructive/10',
    buttonVariant: 'destructive' as const,
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    iconBgClass: 'bg-amber-500/10',
    buttonVariant: 'default' as const,
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500',
    iconBgClass: 'bg-blue-500/10',
    buttonVariant: 'default' as const,
  },
}

export function ConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  confirmText,
  isLoading = false,
}: ConfirmDialogProps) {
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)

  const config = variantConfig[variant]
  const Icon = config.icon

  const isConfirmEnabled = confirmText ? inputValue === confirmText : true
  const isProcessing = isLoading || loading

  const handleConfirm = async () => {
    if (!isConfirmEnabled) return
    
    setLoading(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (error) {
      console.error('Confirm action failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setInputValue('')
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className={cn('h-10 w-10 rounded-full flex items-center justify-center shrink-0', config.iconBgClass)}>
              <Icon className={cn('h-5 w-5', config.iconClass)} />
            </div>
            <div className="flex-1">
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        {confirmText && (
          <div className="py-4">
            <Label htmlFor="confirm-input" className="text-sm font-medium">
              Type <span className="font-mono font-bold text-foreground">{confirmText}</span> to confirm
            </Label>
            <Input
              id="confirm-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={confirmText}
              className="mt-2"
              autoComplete="off"
            />
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isProcessing}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            onClick={handleConfirm}
            disabled={!isConfirmEnabled || isProcessing}
          >
            {isProcessing ? 'Processing...' : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// Preset Confirm Dialogs
// ============================================

interface PresetConfirmProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void | Promise<void>
  itemName?: string
  isLoading?: boolean
}

// Delete Confirmation
export function ConfirmDelete({
  open,
  onOpenChange,
  onConfirm,
  itemName = 'this item',
  isLoading,
}: PresetConfirmProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={`Delete ${itemName}?`}
      description={`This action cannot be undone. ${itemName.charAt(0).toUpperCase() + itemName.slice(1)} will be permanently removed.`}
      confirmLabel="Delete"
      variant="danger"
      isLoading={isLoading}
    />
  )
}

// Delete with Confirmation Text
export function ConfirmDeleteWithText({
  open,
  onOpenChange,
  onConfirm,
  itemName = 'this item',
  isLoading,
}: PresetConfirmProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={`Delete ${itemName}?`}
      description={`This action cannot be undone. All data associated with ${itemName} will be permanently deleted.`}
      confirmLabel="Delete"
      confirmText="DELETE"
      variant="danger"
      isLoading={isLoading}
    />
  )
}

// Remove from List/Board
export function ConfirmRemove({
  open,
  onOpenChange,
  onConfirm,
  itemName = 'this item',
  isLoading,
}: PresetConfirmProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={`Remove ${itemName}?`}
      description={`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} will be removed. You can add it back later.`}
      confirmLabel="Remove"
      variant="warning"
      isLoading={isLoading}
    />
  )
}

// Logout Confirmation
export function ConfirmLogout({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: Omit<PresetConfirmProps, 'itemName'>) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Sign out?"
      description="You will need to sign in again to access your account."
      confirmLabel="Sign Out"
      variant="warning"
      isLoading={isLoading}
    />
  )
}

// Discard Changes
export function ConfirmDiscard({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
}: Omit<PresetConfirmProps, 'itemName'>) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title="Discard changes?"
      description="You have unsaved changes. Are you sure you want to discard them?"
      confirmLabel="Discard"
      variant="warning"
      isLoading={isLoading}
    />
  )
}

// Archive Item
export function ConfirmArchive({
  open,
  onOpenChange,
  onConfirm,
  itemName = 'this item',
  isLoading,
}: PresetConfirmProps) {
  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      onConfirm={onConfirm}
      title={`Archive ${itemName}?`}
      description={`${itemName.charAt(0).toUpperCase() + itemName.slice(1)} will be moved to archive. You can restore it later.`}
      confirmLabel="Archive"
      variant="info"
      isLoading={isLoading}
    />
  )
}

// ============================================
// Confirm Dialog Context (for imperative usage)
// ============================================

interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: ConfirmVariant
  confirmText?: string
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null)

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{
    open: boolean
    options: ConfirmOptions | null
    resolve: ((value: boolean) => void) | null
  }>({
    open: false,
    options: null,
    resolve: null,
  })

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, options, resolve })
    })
  }, [])

  const handleConfirm = useCallback(() => {
    state.resolve?.(true)
    setState({ open: false, options: null, resolve: null })
  }, [state.resolve])

  const handleCancel = useCallback(() => {
    state.resolve?.(false)
    setState({ open: false, options: null, resolve: null })
  }, [state.resolve])

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {state.options && (
        <ConfirmDialog
          open={state.open}
          onOpenChange={(open) => !open && handleCancel()}
          onConfirm={handleConfirm}
          {...state.options}
        />
      )}
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmContext)
  if (!context) {
    throw new Error('useConfirm must be used within a ConfirmProvider')
  }
  return context.confirm
}

// ============================================
// Loading Button Component
// ============================================

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children: React.ReactNode
}

export function LoadingButton({
  isLoading = false,
  loadingText,
  children,
  disabled,
  variant = 'default',
  size = 'default',
  className,
  ...props
}: LoadingButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          {loadingText || 'Loading...'}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
