"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, ArrowRight, Plus, Trash2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface BudgetItem {
  item: string
  quantity: string
  unitPrice: string
  total: string
}

interface BudgetFormProps {
  formData: any
  updateFormData: (data: any) => void
  onNext: () => void
  onPrevious: () => void
}

export function BudgetForm({ formData, updateFormData, onNext, onPrevious }: BudgetFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [budgetSummary, setBudgetSummary] = useState({
    totalEquipment: 0,
    totalConsumables: 0,
    totalTravel: 0,
    totalPersonnel: 0,
    totalBudget: 0,
    equipmentPercentage: 0,
    otherExpensesPercentage: 0,
  })

  useEffect(() => {
    calculateBudgetSummary()
  }, [formData.equipment, formData.consumables, formData.travel, formData.personnel])

  const calculateBudgetSummary = () => {
    const totalEquipment = formData.equipment.reduce((sum: number, item: BudgetItem) => {
      return sum + (Number(item.total) || 0)
    }, 0)

    const totalConsumables = formData.consumables.reduce((sum: number, item: BudgetItem) => {
      return sum + (Number(item.total) || 0)
    }, 0)

    const totalTravel = Number(formData.travel) || 0
    const totalPersonnel = Number(formData.personnel) || 0

    const totalBudget = totalEquipment + totalConsumables + totalTravel + totalPersonnel

    const equipmentPercentage = totalBudget > 0 ? (totalEquipment / totalBudget) * 100 : 0
    const otherExpensesPercentage = 100 - equipmentPercentage

    setBudgetSummary({
      totalEquipment,
      totalConsumables,
      totalTravel,
      totalPersonnel,
      totalBudget,
      equipmentPercentage,
      otherExpensesPercentage,
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Check if at least one equipment item has values
    const hasEquipmentItem = formData.equipment.some(
      (item: BudgetItem) => item.item.trim() !== "" && item.quantity.trim() !== "" && item.unitPrice.trim() !== "",
    )

    if (!hasEquipmentItem) {
      newErrors.equipment = "At least one equipment item is required"
    }

    // Check if at least one consumables item has values
    const hasConsumablesItem = formData.consumables.some(
      (item: BudgetItem) => item.item.trim() !== "" && item.quantity.trim() !== "" && item.unitPrice.trim() !== "",
    )

    if (!hasConsumablesItem) {
      newErrors.consumables = "At least one consumable item is required"
    }

    // Check budget allocation percentages
    if (budgetSummary.equipmentPercentage < 60) {
      newErrors.budgetAllocation = "Equipment and Facilities must be at least 60% of the total budget"
    }

    if (budgetSummary.otherExpensesPercentage > 40) {
      newErrors.budgetAllocation = "Other expenses must not exceed 40% of the total budget"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateForm()) {
      onNext()
    }
  }

  // Equipment functions
  const addEquipmentItem = () => {
    updateFormData({
      equipment: [...formData.equipment, { item: "", quantity: "", unitPrice: "", total: "" }],
    })

    // Clear equipment error if it exists
    if (errors.equipment) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.equipment
        return newErrors
      })
    }
  }

  const removeEquipmentItem = (index: number) => {
    const updatedEquipment = [...formData.equipment]
    updatedEquipment.splice(index, 1)
    updateFormData({ equipment: updatedEquipment })
  }

  const updateEquipmentItem = (index: number, field: keyof BudgetItem, value: string) => {
    const updatedEquipment = [...formData.equipment]
    updatedEquipment[index] = {
      ...updatedEquipment[index],
      [field]: value,
    }

    // Auto-calculate total if quantity and unit price are provided
    if (
      (field === "quantity" || field === "unitPrice") &&
      updatedEquipment[index].quantity &&
      updatedEquipment[index].unitPrice
    ) {
      const quantity = Number(updatedEquipment[index].quantity) || 0
      const unitPrice = Number(updatedEquipment[index].unitPrice) || 0
      updatedEquipment[index].total = (quantity * unitPrice).toString()
    }

    updateFormData({ equipment: updatedEquipment })

    // Clear equipment error if it exists
    if (errors.equipment) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.equipment
        return newErrors
      })
    }
  }

  // Consumables functions
  const addConsumablesItem = () => {
    updateFormData({
      consumables: [...formData.consumables, { item: "", quantity: "", unitPrice: "", total: "" }],
    })

    // Clear consumables error if it exists
    if (errors.consumables) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.consumables
        return newErrors
      })
    }
  }

  const removeConsumablesItem = (index: number) => {
    const updatedConsumables = [...formData.consumables]
    updatedConsumables.splice(index, 1)
    updateFormData({ consumables: updatedConsumables })
  }

  const updateConsumablesItem = (index: number, field: keyof BudgetItem, value: string) => {
    const updatedConsumables = [...formData.consumables]
    updatedConsumables[index] = {
      ...updatedConsumables[index],
      [field]: value,
    }

    // Auto-calculate total if quantity and unit price are provided
    if (
      (field === "quantity" || field === "unitPrice") &&
      updatedConsumables[index].quantity &&
      updatedConsumables[index].unitPrice
    ) {
      const quantity = Number(updatedConsumables[index].quantity) || 0
      const unitPrice = Number(updatedConsumables[index].unitPrice) || 0
      updatedConsumables[index].total = (quantity * unitPrice).toString()
    }

    updateFormData({ consumables: updatedConsumables })

    // Clear consumables error if it exists
    if (errors.consumables) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.consumables
        return newErrors
      })
    }
  }

  // Other expenses functions
  const handleOtherExpensesChange = (field: string, value: string) => {
    updateFormData({ [field]: value })
  }

  return (
    <div className="space-y-6 py-4">
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <InfoIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertTitle>Budget Allocation Requirements</AlertTitle>
        <AlertDescription>
          Your budget must allocate at least 60% to Equipment and Facilities and no more than 40% to Other expenses
          (Consumables, Travel & Subsistence, Personnel).
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Budget Summary */}
        <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
          <h3 className="font-medium mb-2">Budget Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Equipment & Facilities:</p>
              <p className="font-medium">
                KShs. {budgetSummary.totalEquipment.toLocaleString()} ({budgetSummary.equipmentPercentage.toFixed(1)}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Other Expenses:</p>
              <p className="font-medium">
                KShs.{" "}
                {(
                  budgetSummary.totalConsumables +
                  budgetSummary.totalTravel +
                  budgetSummary.totalPersonnel
                ).toLocaleString()}{" "}
                ({budgetSummary.otherExpensesPercentage.toFixed(1)}%)
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Budget:</p>
              <p className="font-medium">KShs. {budgetSummary.totalBudget.toLocaleString()}</p>
            </div>
          </div>

          {errors.budgetAllocation && <p className="text-sm text-red-500 mt-2">{errors.budgetAllocation}</p>}
        </div>

        {/* Equipment and Facilities */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label className="text-base">
              11i. Equipment and Facilities <span className="text-red-500">*</span>
            </Label>
            <Button type="button" onClick={addEquipmentItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {errors.equipment && <p className="text-sm text-red-500 mb-2">{errors.equipment}</p>}

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price (KShs.)</TableHead>
                  <TableHead>Total (KShs.)</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.equipment.map((item: BudgetItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.item}
                        onChange={(e) => updateEquipmentItem(index, "item", e.target.value)}
                        placeholder="Item name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.quantity}
                        onChange={(e) => updateEquipmentItem(index, "quantity", e.target.value)}
                        placeholder="Quantity"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.unitPrice}
                        onChange={(e) => updateEquipmentItem(index, "unitPrice", e.target.value)}
                        placeholder="Unit price"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input value={item.total} readOnly placeholder="0.00" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEquipmentItem(index)}
                        disabled={formData.equipment.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total:
                  </TableCell>
                  <TableCell colSpan={2} className="font-medium">
                    KShs. {budgetSummary.totalEquipment.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Consumables */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Label className="text-base">
              11ii. Consumables <span className="text-red-500">*</span>
            </Label>
            <Button type="button" onClick={addConsumablesItem} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>

          {errors.consumables && <p className="text-sm text-red-500 mb-2">{errors.consumables}</p>}

          <div className="border rounded-md overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit Price (KShs.)</TableHead>
                  <TableHead>Total (KShs.)</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formData.consumables.map((item: BudgetItem, index: number) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={item.item}
                        onChange={(e) => updateConsumablesItem(index, "item", e.target.value)}
                        placeholder="Item name"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.quantity}
                        onChange={(e) => updateConsumablesItem(index, "quantity", e.target.value)}
                        placeholder="Quantity"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={item.unitPrice}
                        onChange={(e) => updateConsumablesItem(index, "unitPrice", e.target.value)}
                        placeholder="Unit price"
                        type="number"
                      />
                    </TableCell>
                    <TableCell>
                      <Input value={item.total} readOnly placeholder="0.00" />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeConsumablesItem(index)}
                        disabled={formData.consumables.length === 1}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Total:
                  </TableCell>
                  <TableCell colSpan={2} className="font-medium">
                    KShs. {budgetSummary.totalConsumables.toLocaleString()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Other Expenses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="travel" className="text-base">
              Travel & Subsistence (KShs.)
            </Label>
            <Input
              id="travel"
              value={formData.travel}
              onChange={(e) => handleOtherExpensesChange("travel", e.target.value)}
              placeholder="Enter amount"
              type="number"
            />
          </div>
          <div>
            <Label htmlFor="personnel" className="text-base">
              Personnel and Other Costs (KShs.)
            </Label>
            <Input
              id="personnel"
              value={formData.personnel}
              onChange={(e) => handleOtherExpensesChange("personnel", e.target.value)}
              placeholder="Enter amount"
              type="number"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button onClick={onPrevious} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button onClick={handleNext} className="bg-sky-600 hover:bg-sky-700">
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
