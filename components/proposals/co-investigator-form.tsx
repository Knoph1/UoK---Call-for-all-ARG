"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface CoInvestigator {
  id?: string
  name: string
  email: string
  phone: string
  role: string
}

interface CoInvestigatorFormProps {
  coInvestigators: CoInvestigator[]
  onChange: (coInvestigators: CoInvestigator[]) => void
}

export function CoInvestigatorForm({ coInvestigators, onChange }: CoInvestigatorFormProps) {
  const [newCoInvestigator, setNewCoInvestigator] = useState<CoInvestigator>({
    name: "",
    email: "",
    phone: "",
    role: "",
  })

  const addCoInvestigator = () => {
    if (newCoInvestigator.name && newCoInvestigator.email) {
      onChange([...coInvestigators, { ...newCoInvestigator }])
      setNewCoInvestigator({ name: "", email: "", phone: "", role: "" })
    }
  }

  const removeCoInvestigator = (index: number) => {
    onChange(coInvestigators.filter((_, i) => i !== index))
  }

  const updateCoInvestigator = (index: number, field: keyof CoInvestigator, value: string) => {
    const updated = coInvestigators.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Co-Investigators</Label>
        <Button type="button" variant="outline" size="sm" onClick={addCoInvestigator}>
          <Plus className="mr-2 h-4 w-4" />
          Add Co-Investigator
        </Button>
      </div>

      {/* Add New Co-Investigator Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add New Co-Investigator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="coInvName">Name *</Label>
              <Input
                id="coInvName"
                value={newCoInvestigator.name}
                onChange={(e) => setNewCoInvestigator({ ...newCoInvestigator, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coInvEmail">Email *</Label>
              <Input
                id="coInvEmail"
                type="email"
                value={newCoInvestigator.email}
                onChange={(e) => setNewCoInvestigator({ ...newCoInvestigator, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coInvPhone">Phone</Label>
              <Input
                id="coInvPhone"
                value={newCoInvestigator.phone}
                onChange={(e) => setNewCoInvestigator({ ...newCoInvestigator, phone: e.target.value })}
                placeholder="Phone number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="coInvRole">Role</Label>
              <Input
                id="coInvRole"
                value={newCoInvestigator.role}
                onChange={(e) => setNewCoInvestigator({ ...newCoInvestigator, role: e.target.value })}
                placeholder="e.g., Co-Principal Investigator"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Co-Investigators */}
      {coInvestigators.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Co-Investigators ({coInvestigators.length})</Label>
          {coInvestigators.map((coInv, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      value={coInv.name}
                      onChange={(e) => updateCoInvestigator(index, "name", e.target.value)}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={coInv.email}
                      onChange={(e) => updateCoInvestigator(index, "email", e.target.value)}
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={coInv.phone}
                      onChange={(e) => updateCoInvestigator(index, "phone", e.target.value)}
                      placeholder="Phone number"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <div className="flex-1">
                      <Label>Role</Label>
                      <Input
                        value={coInv.role}
                        onChange={(e) => updateCoInvestigator(index, "role", e.target.value)}
                        placeholder="Role"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeCoInvestigator(index)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
