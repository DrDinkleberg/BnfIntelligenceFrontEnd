"use client"

import React from "react"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SlideOverProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export default function SlideOver({ open, onClose, title, children }: SlideOverProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-out">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          {title && <h2 className="font-semibold text-foreground">{title}</h2>}
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 ml-auto">
            <X className="h-4 w-4" />
          </Button>
        </div>
        {/* Content */}
        <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  )
}
