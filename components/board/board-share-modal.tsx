'use client'

import { useState } from 'react'
import {
  Share2,
  Search,
  UserPlus,
  X,
  Check,
  Copy,
  Link,
  Mail,
  Crown,
  Edit3,
  Eye,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface TeamMember {
  id: string
  initials: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
  avatar?: string
}

interface AvailableUser {
  id: string
  name: string
  email: string
  initials: string
  avatar?: string
}

interface BoardShareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  boardName: string
  members: TeamMember[]
  onUpdateMembers: (members: TeamMember[]) => void
}

// Mock available users to invite
const mockAvailableUsers: AvailableUser[] = [
  { id: 'u1', name: 'Alice Chen', email: 'alice@bnf.com', initials: 'AC' },
  { id: 'u2', name: 'Bob Williams', email: 'bob@bnf.com', initials: 'BW' },
  { id: 'u3', name: 'Carol Davis', email: 'carol@bnf.com', initials: 'CD' },
  { id: 'u4', name: 'David Lee', email: 'david@bnf.com', initials: 'DL' },
  { id: 'u5', name: 'Emma Garcia', email: 'emma@bnf.com', initials: 'EG' },
]

const roleIcons = {
  owner: Crown,
  editor: Edit3,
  viewer: Eye,
}

const roleLabels = {
  owner: 'Owner',
  editor: 'Can edit',
  viewer: 'Can view',
}

export function BoardShareModal({
  open,
  onOpenChange,
  boardName,
  members,
  onUpdateMembers,
}: BoardShareModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('editor')

  // Filter available users not already members
  const memberIds = members.map((m) => m.id)
  const availableUsers = mockAvailableUsers.filter(
    (u) =>
      !memberIds.includes(u.id) &&
      (searchQuery === '' ||
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleAddMember = (user: AvailableUser) => {
    const newMember: TeamMember = {
      id: user.id,
      initials: user.initials,
      name: user.name,
      email: user.email,
      role: inviteRole,
      avatar: user.avatar,
    }
    onUpdateMembers([...members, newMember])
    setSearchQuery('')
  }

  const handleRemoveMember = (memberId: string) => {
    onUpdateMembers(members.filter((m) => m.id !== memberId))
  }

  const handleUpdateRole = (memberId: string, newRole: 'editor' | 'viewer') => {
    onUpdateMembers(
      members.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    )
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/board/shared/abc123`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleInviteByEmail = () => {
    if (inviteEmail && inviteEmail.includes('@')) {
      // In production, send invite email via API
      console.log(`Inviting ${inviteEmail} as ${inviteRole}`)
      setInviteEmail('')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share "{boardName}"
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add People */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Add people</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as 'editor' | 'viewer')}>
                <SelectTrigger className="w-28">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="editor">Can edit</SelectItem>
                  <SelectItem value="viewer">Can view</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Results */}
            {searchQuery && availableUsers.length > 0 && (
              <div className="border border-border rounded-md divide-y divide-border max-h-40 overflow-y-auto">
                {availableUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-secondary/50 cursor-pointer"
                    onClick={() => handleAddMember(user)}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar className="h-7 w-7">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-[10px]">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <UserPlus className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}

            {searchQuery && availableUsers.length === 0 && (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No users found. Invite by email instead.
              </div>
            )}
          </div>

          {/* Invite by Email */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Or invite by email</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter email address..."
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleInviteByEmail} disabled={!inviteEmail.includes('@')}>
                <Mail className="h-4 w-4 mr-1" />
                Invite
              </Button>
            </div>
          </div>

          <Separator />

          {/* Current Members */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              People with access ({members.length})
            </Label>
            <div className="space-y-2">
              {members.map((member) => {
                const RoleIcon = roleIcons[member.role]
                const isOwner = member.role === 'owner'

                return (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-secondary/30"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback className="bg-primary/20 text-primary text-xs">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium">{member.name}</p>
                          {isOwner && (
                            <Badge variant="secondary" className="text-[10px] h-5">
                              <Crown className="h-3 w-3 mr-1" />
                              Owner
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{member.email}</p>
                      </div>
                    </div>

                    {isOwner ? (
                      <span className="text-xs text-muted-foreground">Owner</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">
                              <RoleIcon className="h-3 w-3 mr-1" />
                              {roleLabels[member.role]}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'editor')}>
                              <Edit3 className="h-3 w-3 mr-2" />
                              Can edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateRole(member.id, 'viewer')}>
                              <Eye className="h-3 w-3 mr-2" />
                              Can view
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleRemoveMember(member.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Copy Link */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Share link</Label>
            <div className="flex gap-2">
              <Input
                readOnly
                value={`${typeof window !== 'undefined' ? window.location.origin : ''}/board/shared/abc123`}
                className="flex-1 bg-secondary/50"
              />
              <Button variant="outline" onClick={handleCopyLink}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link and access to your organization can view this board.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-border">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
