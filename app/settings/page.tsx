'use client'

import { useState } from 'react'
import {
  Bell,
  Moon,
  Sun,
  Monitor,
  Shield,
  Database,
  Download,
  Trash2,
  Key,
  Globe,
  Clock,
  Mail,
  Smartphone,
  AlertTriangle,
  Check,
  ChevronRight,
  Save,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(true)
  const [criticalAlertsOnly, setCriticalAlertsOnly] = useState(false)
  const [alertSound, setAlertSound] = useState(true)

  // Alert preferences
  const [alertCategories, setAlertCategories] = useState({
    regulatory: true,
    competitors: true,
    filings: true,
    social: true,
    news: false,
  })

  // Data settings
  const [dataRetention, setDataRetention] = useState('90')
  const [autoSync, setAutoSync] = useState(true)
  const [syncFrequency, setSyncFrequency] = useState('hourly')

  // Display settings
  const [compactMode, setCompactMode] = useState(false)
  const [showPreviews, setShowPreviews] = useState(true)
  const [defaultView, setDefaultView] = useState('grid')
  const [timezone, setTimezone] = useState('America/New_York')

  // Dialogs
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false)

  // Unsaved changes tracking
  const [hasChanges, setHasChanges] = useState(false)

  const handleSaveSettings = () => {
    // In production, this would save to API
    toast({
      title: 'Settings Saved',
      description: 'Your preferences have been updated successfully.',
    })
    setHasChanges(false)
  }

  const handleExportData = () => {
    toast({
      title: 'Export Started',
      description: 'Your data export is being prepared. You will receive an email when ready.',
    })
    setExportDialogOpen(false)
  }

  const handleDeleteAccount = () => {
    toast({
      title: 'Account Deletion Requested',
      description: 'Your account deletion request has been submitted. You will receive a confirmation email.',
      variant: 'destructive',
    })
    setDeleteDialogOpen(false)
  }

  const handleRegenerateApiKey = () => {
    toast({
      title: 'API Key Regenerated',
      description: 'Your new API key has been generated. Make sure to update your integrations.',
    })
    setApiKeyDialogOpen(false)
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences and configurations</p>
          </div>
          {hasChanges && (
            <Button onClick={handleSaveSettings}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          )}
        </div>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Select your preferred color theme</p>
              </div>
              <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
                <Button
                  variant={theme === 'light' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => { setTheme('light'); setHasChanges(true) }}
                >
                  <Sun className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'dark' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => { setTheme('dark'); setHasChanges(true) }}
                >
                  <Moon className="h-4 w-4" />
                </Button>
                <Button
                  variant={theme === 'system' ? 'secondary' : 'ghost'}
                  size="sm"
                  className="h-8 px-3"
                  onClick={() => { setTheme('system'); setHasChanges(true) }}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Separator />

            {/* Compact Mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Compact Mode</p>
                <p className="text-sm text-muted-foreground">Use smaller spacing and font sizes</p>
              </div>
              <Switch 
                checked={compactMode} 
                onCheckedChange={(v) => { setCompactMode(v); setHasChanges(true) }}
              />
            </div>

            {/* Show Previews */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Show Previews</p>
                <p className="text-sm text-muted-foreground">Display content previews in lists</p>
              </div>
              <Switch 
                checked={showPreviews} 
                onCheckedChange={(v) => { setShowPreviews(v); setHasChanges(true) }}
              />
            </div>

            {/* Default View */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Default View</p>
                <p className="text-sm text-muted-foreground">Preferred layout for lists</p>
              </div>
              <Select value={defaultView} onValueChange={(v) => { setDefaultView(v); setHasChanges(true) }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">Grid</SelectItem>
                  <SelectItem value="list">List</SelectItem>
                  <SelectItem value="compact">Compact</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Timezone */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Timezone</p>
                <p className="text-sm text-muted-foreground">Set your local timezone for dates</p>
              </div>
              <Select value={timezone} onValueChange={(v) => { setTimezone(v); setHasChanges(true) }}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="America/New_York">Eastern Time</SelectItem>
                  <SelectItem value="America/Chicago">Central Time</SelectItem>
                  <SelectItem value="America/Denver">Mountain Time</SelectItem>
                  <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                  <SelectItem value="UTC">UTC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={(v) => { setEmailNotifications(v); setHasChanges(true) }}
              />
            </div>

            {/* Push Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Smartphone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
              </div>
              <Switch 
                checked={pushNotifications} 
                onCheckedChange={(v) => { setPushNotifications(v); setHasChanges(true) }}
              />
            </div>

            {/* Weekly Digest */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Weekly Digest</p>
                  <p className="text-sm text-muted-foreground">Summary email every Monday</p>
                </div>
              </div>
              <Switch 
                checked={weeklyDigest} 
                onCheckedChange={(v) => { setWeeklyDigest(v); setHasChanges(true) }}
              />
            </div>

            {/* Critical Alerts Only */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="font-medium">Critical Alerts Only</p>
                  <p className="text-sm text-muted-foreground">Only notify for high-priority items</p>
                </div>
              </div>
              <Switch 
                checked={criticalAlertsOnly} 
                onCheckedChange={(v) => { setCriticalAlertsOnly(v); setHasChanges(true) }}
              />
            </div>

            {/* Alert Sound */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alert Sound</p>
                <p className="text-sm text-muted-foreground">Play sound for new alerts</p>
              </div>
              <Switch 
                checked={alertSound} 
                onCheckedChange={(v) => { setAlertSound(v); setHasChanges(true) }}
              />
            </div>

            <Separator />

            {/* Alert Categories */}
            <div>
              <p className="font-medium mb-3">Alert Categories</p>
              <div className="space-y-3">
                {Object.entries(alertCategories).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <p className="text-sm capitalize">{key}</p>
                    <Switch 
                      checked={value} 
                      onCheckedChange={(v) => { 
                        setAlertCategories(prev => ({ ...prev, [key]: v }))
                        setHasChanges(true) 
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data & Sync */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data & Sync
            </CardTitle>
            <CardDescription>Manage data synchronization and storage</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Auto Sync */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Auto Sync</p>
                <p className="text-sm text-muted-foreground">Automatically sync data in background</p>
              </div>
              <Switch 
                checked={autoSync} 
                onCheckedChange={(v) => { setAutoSync(v); setHasChanges(true) }}
              />
            </div>

            {/* Sync Frequency */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Sync Frequency</p>
                <p className="text-sm text-muted-foreground">How often to refresh data</p>
              </div>
              <Select value={syncFrequency} onValueChange={(v) => { setSyncFrequency(v); setHasChanges(true) }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Data Retention */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Data Retention</p>
                <p className="text-sm text-muted-foreground">How long to keep historical data</p>
              </div>
              <Select value={dataRetention} onValueChange={(v) => { setDataRetention(v); setHasChanges(true) }}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Export Data */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Data</p>
                <p className="text-sm text-muted-foreground">Download all your data</p>
              </div>
              <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
            <CardDescription>Manage security and API access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Key */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Key</p>
                <p className="text-sm text-muted-foreground">Manage your API access key</p>
              </div>
              <Button variant="outline" onClick={() => setApiKeyDialogOpen(true)}>
                <Key className="h-4 w-4 mr-2" />
                Manage
              </Button>
            </div>

            {/* Active Sessions */}
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Active Sessions</p>
                <p className="text-sm text-muted-foreground">View and manage logged in devices</p>
              </div>
              <Button variant="outline">
                <Globe className="h-4 w-4 mr-2" />
                View Sessions
              </Button>
            </div>

            {/* Two-Factor Auth */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className="font-medium">Two-Factor Authentication</p>
                <Badge variant="secondary" className="text-xs">
                  <Check className="h-3 w-3 mr-1" />
                  Enabled
                </Badge>
              </div>
              <Button variant="outline">Configure</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>Irreversible actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Your Data</DialogTitle>
            <DialogDescription>
              Download a copy of all your data including boards, tracked entities, and settings.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Board data and configurations</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Tracked competitors and entities</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Notes and saved searches</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="h-4 w-4 text-green-500" />
              <span className="text-sm">Account settings and preferences</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Start Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive">Delete Account</DialogTitle>
            <DialogDescription>
              This action cannot be undone. All your data will be permanently deleted.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="confirm-delete">Type "DELETE" to confirm</Label>
            <Input id="confirm-delete" placeholder="DELETE" className="mt-2" />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Key Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key Management</DialogTitle>
            <DialogDescription>
              Your API key provides programmatic access to your data.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div>
              <Label>Current API Key</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input value="sk-bnf-****-****-****-****" readOnly className="font-mono" />
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Regenerating your API key will invalidate the current key immediately.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApiKeyDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleRegenerateApiKey}>
              <Key className="h-4 w-4 mr-2" />
              Regenerate Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
