"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash2 } from "lucide-react"

interface BudgetItem {
  id?: string
  itemName: string
  cost: number
  notes: string
}

interface BudgetItemFormProps {
  budgetItems: BudgetItem[]
  onChange: (budgetItems: BudgetItem[]) => void
}

export function BudgetItemForm({ budgetItems, onChange }: BudgetItemFormProps) {
  const [newItem, setNewItem] = useState<BudgetItem>({
    itemName: "",
    cost: 0,
    notes: "",
  })

  const addBudgetItem = () => {
    if (newItem.itemName && newItem.cost > 0) {
      onChange([...budgetItems, { ...newItem }])
      setNewItem({ itemName: "", cost: 0, notes: "" })
    }
  }

  const removeBudgetItem = (index: number) => {
    onChange(budgetItems.filter((_, i) => i !== index))
  }

  const updateBudgetItem = (index: number, field: keyof BudgetItem, value: string | number) => {
    const updated = budgetItems.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    onChange(updated)
  }

  const totalBudget = budgetItems.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-medium">Budget Items</Label>
        <div className="text-sm text-muted-foreground">
          Total: <span className="font-medium">${totalBudget.toLocaleString()}</span>
        </div>
      </div>

      {/* Add New Budget Item */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Add Budget Item</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                value={newItem.itemName}
                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                placeholder="e.g., Equipment, Personnel"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost ($) *</Label>
              <Input
                id="cost"
                type="number"
                value={newItem.cost}
                onChange={(e) => setNewItem({ ...newItem, cost: Number.parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newItem.notes}
                onChange={(e) => setNewItem({ ...newItem, notes: e.target.value })}
                placeholder="Additional details"
              />
            </div>
          </div>
          <div className="mt-4">
            <Button type="button" onClick={addBudgetItem} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Budget Items Table */}
      {budgetItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Budget Breakdown ({budgetItems.length} items)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.itemName}
                        onChange={(e) => updateBudgetItem(index, "itemName", e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.cost}
                        onChange={(e) => updateBudgetItem(index, "cost", Number.parseFloat(e.target.value) || 0)}
                        className="border-0 p-0 h-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.notes}
                        onChange={(e) => updateBudgetItem(index, "notes", e.target.value)}
                        className="border-0 p-0 h-auto"
                      />
                    </TableCell>
                    <TableCell>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeBudgetItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-medium">Total</TableCell>
                  <TableCell className="font-medium">${totalBudget.toLocaleString()}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
