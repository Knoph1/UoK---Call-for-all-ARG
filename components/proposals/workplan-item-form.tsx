"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

interface WorkplanItem {
  id?: string
  activity: string
  startDate: string
  endDate: string
  notes: string
}

interface WorkplanItemFormProps {
  workplanItems: WorkplanItem[]
  onChange: (workplanItems: WorkplanItem[]) => void
}

export function WorkplanItemForm({ workplanItems, onChange }: WorkplanItemFormProps) {
  const [newItem, setNewItem] = useState<WorkplanItem>({
    activity: "",
    startDate: "",
    endDate: "",
    notes: "",
  })

  const addWorkplanItem = () => {
    if (newItem.activity && newItem.startDate && newItem.endDate) {
      onChange([...workplanItems, { ...newItem }])
      setNewItem({ activity: "", startDate: "", endDate: "", notes: "" })
    }
  }

  const removeWorkplanItem = (index: number) => {
    onChange(workplanItems.filter((_, i) => i !== index))
  }

  const updateWorkplanItem = (index: number, field: keyof WorkplanItem, value: string) => {
    const updated = workplanItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Work Plan Activities</Label>
      </div>

      {/* Add New Workplan Item */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="activity">Activity Description *</Label>
              <Input
                id="activity"
                value={newItem.activity}
                onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                placeholder="Describe the activity"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={newItem.startDate}
                  onChange={(e) => setNewItem({ ...newItem, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={newItem.endDate}
                  onChange={(e) => setNewItem({ ...newItem, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                placeholder="Additional notes or deliverables"
                rows={2}
              />
            </div>
            <Button type="button" onClick={addWorkplanItem} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Activity
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workplan Items Table */}
      {workplanItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Work Plan ({workplanItems.length} activities)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Activity</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workplanItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.activity}
                        onChange={(e) => updateWorkplanItem(index, "activity", e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={item.startDate}
                        onChange={(e) => updateWorkplanItem(index, "startDate", e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={item.endDate}
                        onChange={(e) => updateWorkplanItem(index, "endDate", e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={item.notes}
                        onChange={(e) => updateWorkplanItem(index, "notes", e.target.value)}
                        className="border-0 p-0 h-auto min-h-0"
                        rows={1}
                      />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeWorkplanItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
