'use client'

import { useState } from 'react'
import {
  User,
  Settings,
  HelpCircle,
  Mail,
  Building2,
  Bell,
  Moon,
  Sun,
  Monitor,
  Shield,
  Download,
  Trash2,
  ExternalLink,
  MessageSquare,
  FileText,
  BookOpen,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/use-auth'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface UserPreferencesModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: 'profile' | 'settings' | 'help'
}

export function UserPreferencesModal({
  open,
  onOpenChange,
  defaultTab = 'profile',
}: UserPreferencesModalProps) {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState(defaultTab)

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>Account</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)} className="w-full">
          <div className="px-6 pt-2 border-b border-border">
            <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-4">
              <TabsTrigger
                value="profile"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 pt-2"
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger
                value="settings"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 pt-2"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger
                value="help"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-1 pb-3 pt-2"
              >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help & Support
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Profile Tab */}
          <TabsContent value="profile" className="mt-0 p-6">
            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16 border-2 border-border">
                  <AvatarImage src={user?.image || ''} alt={user?.name || 'User'} />
                  <AvatarFallback className="bg-primary/20 text-primary text-lg font-medium">
                    {user?.name?.split(' ').map(n => n[0]).join('') || '?'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <h3 className="text-lg font-semibold">{user?.name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" />
                    {user?.email || 'No email'}
                  </p>
                  <Badge variant="secondary" className="mt-2">
                    <Building2 className="h-3 w-3 mr-1" />
                    Bursor & Fisher
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Editable Fields */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      defaultValue={user?.name?.split(' ')[0] || ''}
                      placeholder="First name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      defaultValue={user?.name?.split(' ').slice(1).join(' ') || ''}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="bg-secondary/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email is managed by Google SSO and cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    defaultValue="Attorney"
                    placeholder="Your role"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Save Changes</Button>
              </div>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0 p-6">
            <div className="space-y-6">
              {/* Appearance */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Appearance
                </h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Theme</p>
                    <p className="text-xs text-muted-foreground">Select your preferred theme</p>
                  </div>
                  <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                    <Button
                      variant={theme === 'light' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setTheme('light')}
                    >
                      <Sun className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={theme === 'dark' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setTheme('dark')}
                    >
                      <Moon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={theme === 'system' ? 'secondary' : 'ghost'}
                      size="sm"
                      className="h-8 px-3"
                      onClick={() => setTheme('system')}
                    >
                      <Monitor className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notifications
                </h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive alerts via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Push Notifications</p>
                      <p className="text-xs text-muted-foreground">Browser push notifications</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Weekly Digest</p>
                      <p className="text-xs text-muted-foreground">Summary of weekly activity</p>
                    </div>
                    <Switch checked={weeklyDigest} onCheckedChange={setWeeklyDigest} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Critical Alerts Only</p>
                      <p className="text-xs text-muted-foreground">Only notify for high-priority items</p>
                    </div>
                    <Switch checked={criticalAlertsOnly} onCheckedChange={setCriticalAlertsOnly} />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Data & Privacy */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Data & Privacy
                </h4>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export My Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Help Tab */}
          <TabsContent value="help" className="mt-0 p-6">
            <div className="space-y-6">
              {/* Quick Links */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Resources</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start h-auto py-3" asChild>
                    <a href="https://docs.example.com" target="_blank" rel="noopener noreferrer">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <p className="text-sm font-medium">Documentation</p>
                        <p className="text-xs text-muted-foreground">Learn how to use the platform</p>
                      </div>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start h-auto py-3" asChild>
                    <a href="https://status.example.com" target="_blank" rel="noopener noreferrer">
                      <Monitor className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <p className="text-sm font-medium">System Status</p>
                        <p className="text-xs text-muted-foreground">Check platform health</p>
                      </div>
                      <ExternalLink className="h-3 w-3 ml-auto" />
                    </a>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Contact Support */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Contact Support</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    Submit a Ticket
                  </Button>
                </div>
              </div>

              <Separator />

              {/* FAQ */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Frequently Asked Questions</h4>
                <div className="space-y-2">
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">How do I track a new competitor?</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Navigate to Competitors → Click "Add firm" → Search and select the firm you want to track.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">How often is ad data updated?</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ad data is collected based on firm tier: Tier 1 every 30 min, Tier 2 every 6 hours, Tier 3 every 48 hours.
                    </p>
                  </div>
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-sm font-medium">Can I export reports?</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Yes! Use the Board view to organize items, then export via the dropdown menu in the top right.
                    </p>
                  </div>
                </div>
              </div>

              {/* Version */}
              <div className="text-center text-xs text-muted-foreground pt-4">
                <p>B&F Intelligence Platform v1.0.0</p>
                <p>© 2025 Bursor & Fisher. All rights reserved.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
