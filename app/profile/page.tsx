'use client'

import { useState } from 'react'
import {
  User,
  Mail,
  Building2,
  Calendar,
  Clock,
  Activity,
  Target,
  FileText,
  TrendingUp,
  Edit3,
  Camera,
  Save,
  X,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/auth-context'

// Mock activity data
const recentActivity = [
  { id: '1', action: 'Added competitor to board', target: 'Morgan & Morgan', time: '2 hours ago', type: 'board' },
  { id: '2', action: 'Tracked new entity', target: 'PFAS Water Contamination', time: '4 hours ago', type: 'entity' },
  { id: '3', action: 'Created saved search', target: 'Pharmaceutical Recalls', time: '1 day ago', type: 'search' },
  { id: '4', action: 'Exported competitor report', target: 'Q4 Analysis', time: '2 days ago', type: 'export' },
  { id: '5', action: 'Updated board settings', target: 'Litigation Pipeline', time: '3 days ago', type: 'board' },
]

const activityStats = {
  boardsCreated: 5,
  competitorsTracked: 17,
  alertsReviewed: 234,
  reportsGenerated: 12,
}

export default function ProfilePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  
  // Edit mode state
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: user?.name || 'John Doe',
    title: 'Senior Associate',
    department: 'Mass Torts',
    bio: 'Focused on pharmaceutical litigation and class action cases.',
    phone: '+1 (555) 123-4567',
  })

  // Profile picture dialog
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false)

  const handleSaveProfile = () => {
    // In production, this would save to API
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been updated successfully.',
    })
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditForm({
      name: user?.name || 'John Doe',
      title: 'Senior Associate',
      department: 'Mass Torts',
      bio: 'Focused on pharmaceutical litigation and class action cases.',
      phone: '+1 (555) 123-4567',
    })
    setIsEditing(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'board': return <Target className="h-4 w-4 text-primary" />
      case 'entity': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'search': return <FileText className="h-4 w-4 text-blue-500" />
      case 'export': return <FileText className="h-4 w-4 text-purple-500" />
      default: return <Activity className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Manage your personal information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleCancelEdit}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveProfile}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={user?.image || ''} alt={editForm.name} />
                    <AvatarFallback className="text-3xl font-semibold bg-primary/20 text-primary">
                      {editForm.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow"
                      onClick={() => setPhotoDialogOpen(true)}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5" />
                  Active
                </Badge>
              </div>

              {/* Info Section */}
              <div className="flex-1 space-y-4">
                {isEditing ? (
                  // Edit Mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editForm.title}
                          onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={editForm.department}
                          onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={editForm.phone}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div>
                      <h2 className="text-2xl font-bold">{editForm.name}</h2>
                      <p className="text-muted-foreground">{editForm.title} • {editForm.department}</p>
                    </div>

                    <p className="text-sm text-foreground">{editForm.bio}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        {user?.email || 'john.doe@bursor.com'}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building2 className="h-4 w-4" />
                        Bursor & Fisher
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Joined Jan 2024
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{activityStats.boardsCreated}</div>
                <p className="text-sm text-muted-foreground mt-1">Boards Created</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-500">{activityStats.competitorsTracked}</div>
                <p className="text-sm text-muted-foreground mt-1">Competitors Tracked</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-500">{activityStats.alertsReviewed}</div>
                <p className="text-sm text-muted-foreground mt-1">Alerts Reviewed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-500">{activityStats.reportsGenerated}</div>
                <p className="text-sm text-muted-foreground mt-1">Reports Generated</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest actions in the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id}>
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="text-foreground">{activity.action}</span>
                        {' '}
                        <span className="font-medium text-primary">{activity.target}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                  {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tracked Items Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Tracked Competitors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Most Tracked Competitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Morgan & Morgan', 'Ben Crump Law', 'Keller Postman', 'Napoli Shkolnik', 'Weitz & Luxenberg'].map((name, i) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-4">{i + 1}.</span>
                      <span className="text-sm">{name}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(Math.random() * 50) + 10} updates
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Active Boards */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="h-4 w-4" />
                Active Boards
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Litigation Pipeline', 'PFAS Research', 'Competitor Intel', 'Q1 Opportunities', 'Mass Arb Leads'].map((name, i) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm">{name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{Math.floor(Math.random() * 20) + 5} items</span>
                      <Badge variant={i === 0 ? 'default' : 'secondary'} className="text-xs">
                        {i === 0 ? 'Active' : 'Recent'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Photo Upload Dialog */}
      <Dialog open={photoDialogOpen} onOpenChange={setPhotoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile photo. Recommended size: 256x256 pixels.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop an image, or click to browse
              </p>
              <Button variant="outline" size="sm">
                Choose File
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPhotoDialogOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              toast({ title: 'Photo Updated', description: 'Your profile photo has been updated.' })
              setPhotoDialogOpen(false)
            }}>
              Upload Photo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
