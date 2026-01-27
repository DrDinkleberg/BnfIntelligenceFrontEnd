"use client"
import { Search, ChevronDown, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRef } from "react"

interface SavedSearchesDropdownProps {
  isOpen: boolean
  onToggle: () => void
  otherDropdownOpen: boolean
}

export default function SavedSearchesDropdown({ isOpen, onToggle, otherDropdownOpen }: SavedSearchesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const savedSearches = [
    {
      id: 1,
      name: "High Risk BigLaw Firms",
      description: "Risk score 70+, BigLaw size, Mass Tort practice",
      results: 23,
      lastRun: "2h ago",
      starred: true,
    },
    {
      id: 2,
      name: "Zantac Active Campaigns",
      description: "Law firms targeting Zantac with active campaigns",
      results: 156,
      lastRun: "1d ago",
      starred: false,
    },
    {
      id: 3,
      name: "California Personal Injury",
      description: "CA-based firms, Personal Injury, Medium+ activity",
      results: 89,
      lastRun: "3d ago",
      starred: true,
    },
  ]

  // Calculate dropdown position
  const getDropdownStyle = () => {
    if (!buttonRef.current) return {}

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const dropdownWidth = otherDropdownOpen ? 320 : 384 // w-80 vs w-96 in pixels

    return {
      position: "fixed" as const,
      top: buttonRect.bottom + 8,
      right: Math.max(16, window.innerWidth - buttonRect.right), // Ensure it doesn't go off screen
      width: dropdownWidth,
      zIndex: 1000,
    }
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        variant="ghost"
        className="flex items-center gap-1 px-2 sm:px-3 py-2 text-gray-600 hover:text-gray-800"
        onClick={onToggle}
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline text-sm">Saved Searches</span>
        <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div
          ref={dropdownRef}
          style={getDropdownStyle()}
          className="bg-white border rounded-md shadow-lg transition-all duration-200"
        >
          <div className="p-3 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Saved Searches</h3>
              <Button variant="ghost" className="text-blue-600 text-xs h-auto p-0">
                Manage
              </Button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {savedSearches.map((search) => (
              <div key={search.id} className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer">
                <div className="flex items-start gap-3">
                  <button className="mt-1">
                    <Star
                      className={`h-4 w-4 ${search.starred ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}`}
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{search.name}</h4>
                      <span className="text-xs text-gray-500 flex-shrink-0">{search.results} results</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{search.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Last run: {search.lastRun}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t">
            <Button variant="ghost" className="w-full text-blue-600 text-sm h-8">
              View all saved searches
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
