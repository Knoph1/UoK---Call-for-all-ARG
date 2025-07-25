"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface ResearchDesignItem {
  id?: string
  title: string
  description: string
}

interface ResearchDesignFormProps {
  items: ResearchDesignItem[]
  onChange: (items: ResearchDesignItem[]) => void
}

export function ResearchDesignForm({ items, onChange }: ResearchDesignFormProps) {
  const [newItem, setNewItem] = useState<ResearchDesignItem>({
    title: "",
    description: "",
  })

  const addItem = () => {
    if (newItem.title && newItem.description) {
      onChange([...items, { ...newItem }])
      setNewItem({ title: "", description: "" })
    }
  }

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof ResearchDesignItem, value: string) => {
    const updated = items.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Research Design Components</Label>
        <Button type="button" variant="outline" size="sm" onClick={addItem}>
          <Plus className="mr-2 h-4 w-4" />
          Add Component
        </Button>
      </div>

      {/* Add New Item Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add Research Design Component</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="designTitle">Title *</Label>
              <Input
                id="designTitle"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="e.g., Data Collection Method"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designDescription">Description *</Label>
              <Textarea
                id="designDescription"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Describe this component of your research design"
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Existing Items */}
      {items.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Research Design Components ({items.length})</Label>
          {items.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={item.title}
                      onChange={(e) => updateItem(index, "title", e.target.value)}
                      placeholder="Component title"
                    />
                  </div>
                  <div className="space-y-2 flex items-end">
                    <div className="flex-1">
                      <Label>Description</Label>
                      <Textarea
                        value={item.description}
                        onChange={(e) => updateItem(index, "description", e.target.value)}
                        placeholder="Component description"
                        rows={3}
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeItem(index)}
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
