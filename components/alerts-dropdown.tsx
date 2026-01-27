"use client"
import { Bell, ChevronDown, AlertTriangle, FileText, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRef } from "react"

interface AlertsDropdownProps {
  isOpen: boolean
  onToggle: () => void
  otherDropdownOpen: boolean
}

export default function AlertsDropdown({ isOpen, onToggle, otherDropdownOpen }: AlertsDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Sample alerts based on your database schema
  const alerts = [
    {
      id: 1,
      title: "Critical Risk Threshold Exceeded",
      description: "Zantac risk score increased to 92 (Critical level)",
      time: "2h ago",
      type: "risk_threshold",
      alert_level: "critical",
      entity_name: "Zantac",
      unread: true,
    },
    {
      id: 2,
      title: "New FDA Warning Letter",
      description: "FDA issued warning letter affecting monitored pharmaceutical entity",
      time: "4h ago",
      type: "new_event",
      alert_level: "warning",
      entity_name: "Generic Ranitidine",
      unread: true,
    },
    {
      id: 3,
      title: "Law Firm Activity Spike",
      description: "Morgan & Associates launched 5 new campaigns targeting Roundup",
      time: "6h ago",
      type: "firm_activity",
      alert_level: "info",
      entity_name: "Roundup",
      unread: false,
    },
    {
      id: 4,
      title: "Vehicle Recall Alert",
      description: "NHTSA issued recall for Ford Explorer affecting 50K+ vehicles",
      time: "1d ago",
      type: "new_event",
      alert_level: "warning",
      entity_name: "Ford Explorer",
      unread: false,
    },
  ]

  const unreadCount = alerts.filter((alert) => alert.unread).length

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "risk_threshold":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "new_event":
        return <FileText className="h-4 w-4 text-orange-500" />
      case "firm_activity":
        return <Users className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertLevelColor = (level: string) => {
    switch (level) {
      case "critical":
        return "text-red-600 bg-red-50"
      case "warning":
        return "text-orange-600 bg-orange-50"
      case "info":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  // Calculate dropdown position
  const getDropdownStyle = () => {
    if (!buttonRef.current) return {}

    const buttonRect = buttonRef.current.getBoundingClientRect()
    const dropdownWidth = otherDropdownOpen ? 320 : 384

    return {
      position: "fixed" as const,
      top: buttonRect.bottom + 8,
      right: Math.max(16, window.innerWidth - buttonRect.right),
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
        <div className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
        <span className="hidden sm:inline text-sm">Recent Alerts</span>
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
              <h3 className="font-medium text-sm">Recent Alerts</h3>
              <Button variant="ghost" className="text-blue-600 text-xs h-auto p-0">
                Mark all read
              </Button>
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                  alert.unread ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm ${alert.unread ? "font-medium" : "font-normal"}`}>{alert.title}</h4>
                      <span className="text-xs text-gray-500 flex-shrink-0">{alert.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {alert.entity_name}
                      </Badge>
                      <Badge className={`text-xs px-2 py-0.5 ${getAlertLevelColor(alert.alert_level)}`}>
                        {alert.alert_level}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t">
            <Button variant="ghost" className="w-full text-blue-600 text-sm h-8">
              View all alerts
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
