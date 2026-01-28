'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Bell,
  AlertTriangle,
  FileText,
  TrendingUp,
  Building2,
  CheckCheck,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Notification {
  id: string
  title: string
  description: string
  time: string
  type: 'alert' | 'competitor' | 'filing' | 'ad'
  severity?: 'critical' | 'warning' | 'info'
  read: boolean
  link?: string
}

// Mock notifications - replace with API data later
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'FDA Warning Letter: Acme Pharma',
    description: 'Quality control violations cited at Newark facility',
    time: '2h ago',
    type: 'alert',
    severity: 'critical',
    read: false,
    link: '/alerts',
  },
  {
    id: '2',
    title: 'Morgan & Morgan: New Campaign',
    description: 'Detected $2.3M ad spend increase on PFAS',
    time: '4h ago',
    type: 'ad',
    severity: 'warning',
    read: false,
    link: '/competitors?view=ads',
  },
  {
    id: '3',
    title: 'New Class Action Filed',
    description: 'DataCorp securities fraud - SDNY',
    time: '6h ago',
    type: 'filing',
    severity: 'info',
    read: false,
    link: '/market-intel',
  },
  {
    id: '4',
    title: 'Competitor Activity Spike',
    description: 'Keller Postman increased Meta spend by 45%',
    time: '8h ago',
    type: 'competitor',
    read: true,
    link: '/competitors',
  },
  {
    id: '5',
    title: 'SEC Investigation: CryptoLend',
    description: 'Formal investigation into lending platform',
    time: '1d ago',
    type: 'alert',
    severity: 'critical',
    read: true,
    link: '/alerts',
  },
]

const typeIcons = {
  alert: AlertTriangle,
  competitor: Building2,
  filing: FileText,
  ad: TrendingUp,
}

const severityColors = {
  critical: 'bg-red-500',
  warning: 'bg-amber-500',
  info: 'bg-blue-500',
}

export function NotificationsDropdown() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [open, setOpen] = useState(false)

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.link) {
      router.push(notification.link)
      setOpen(false)
    }
  }

  const handleViewAll = () => {
    router.push('/alerts')
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[10px] font-bold"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-5">
                {unreadCount} new
              </Badge>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[320px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification) => {
                const Icon = typeIcons[notification.type]
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 cursor-pointer transition-colors hover:bg-secondary/50 ${
                      !notification.read ? 'bg-primary/5' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Icon with severity indicator */}
                    <div className="relative shrink-0 mt-0.5">
                      <div className="h-8 w-8 rounded-md bg-secondary/80 flex items-center justify-center">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      {notification.severity && (
                        <div
                          className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-background ${
                            severityColors[notification.severity]
                          }`}
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-sm leading-tight ${!notification.read ? 'font-medium' : ''}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {notification.description}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5" />
                        {notification.time}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="p-2 border-t border-border">
          <Button
            variant="ghost"
            className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
            onClick={handleViewAll}
          >
            View all notifications
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
