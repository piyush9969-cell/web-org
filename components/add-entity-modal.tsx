"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { EntityType } from "@/app/page"

interface AddEntityModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (type: EntityType, data: any) => void
  data: any
}

export default function AddEntityModal({ isOpen, onClose, onAdd, data }: AddEntityModalProps) {
  const [entityType, setEntityType] = useState<EntityType>("organization")
  const [formData, setFormData] = useState<any>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd(entityType, formData)
    setFormData({})
    onClose()
  }

  const renderForm = () => {
    switch (entityType) {
      case "organization":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., DU1 - Digital Innovation"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Brief description of the organization"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ""}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder="e.g., San Francisco, CA"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="established">Established</Label>
              <Input
                id="established"
                value={formData.established || ""}
                onChange={(e) =>
                  setFormData({ ...formData, established: e.target.value })
                }
                placeholder="e.g., 2020"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees</Label>
              <Input
                id="employees"
                type="number"
                value={formData.employees || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employees: Number.parseInt(e.target.value) || 0,
                  })
                }
                placeholder="e.g., 150"
              />
            </div>
          </>
        );

      case "team":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="organizationId">Organization</Label>
              <Select
                value={formData.organizationId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, organizationId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select organization" />
                </SelectTrigger>
                <SelectContent>
                  {data.organizations.map((org: any) => (
                    <SelectItem key={org.id} value={org.id}>
                      {org.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Team Alpha"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="What does this team do?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead">Team Lead</Label>
              <Input
                id="lead"
                value={formData.lead || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lead: e.target.value })
                }
                placeholder="e.g., Sarah Johnson"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="focus">Focus Area</Label>
              <Input
                id="focus"
                value={formData.focus || ""}
                onChange={(e) =>
                  setFormData({ ...formData, focus: e.target.value })
                }
                placeholder="e.g., User Interface"
              />
            </div>
          </>
        );

      case "circle":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="teamId">Team</Label>
              <Select
                value={formData.teamId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, teamId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  {data.teams.map((team: any) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Circle Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., UI/UX Circle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea
                id="purpose"
                value={formData.purpose || ""}
                onChange={(e) =>
                  setFormData({ ...formData, purpose: e.target.value })
                }
                placeholder="What is the purpose of this circle?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="responsibilities">
                Responsibilities (comma-separated)
              </Label>
              <Textarea
                id="responsibilities"
                value={formData.responsibilities?.join(", ") || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    responsibilities: e.target.value
                      .split(",")
                      .map((r) => r.trim())
                      .filter((r) => r),
                  })
                }
                placeholder="e.g., User Research, Interface Design, Prototyping"
              />
            </div>
          </>
        );

      case "person":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role || ""}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department || ""}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="circleId">Circle</Label>
              <Select
                value={formData.circleId || ""}
                onValueChange={(value) =>
                  setFormData({ ...formData, circleId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select circle" />
                </SelectTrigger>
                <SelectContent>
                  {data.circles.map((circle: any) => (
                    <SelectItem key={circle.id} value={circle.id}>
                      {circle.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Entity</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="entityType">Entity Type</Label>
            <Select
              value={entityType}
              onValueChange={(value: EntityType) => {
                setEntityType(value)
                setFormData({})
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="team">Team</SelectItem>
                <SelectItem value="circle">Circle</SelectItem>
                <SelectItem value="person">Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {renderForm()}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add {entityType}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
