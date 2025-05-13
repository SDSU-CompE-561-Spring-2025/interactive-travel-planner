"use client"

import { useState } from "react"
import { DollarSign, Euro, PoundSterling } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Budget {
  min: number
  max: number
  currency: string
}

interface BudgetRangeSelectorProps {
  budget: Budget
  onUpdate: (budget: Budget) => void
}

export function BudgetRangeSelector({ budget, onUpdate }: BudgetRangeSelectorProps) {
  const [range, setRange] = useState<[number, number]>([budget.min, budget.max])

  const handleRangeChange = (values: number[]) => {
    const [min, max] = values as [number, number]
    setRange([min, max])
    onUpdate({ ...budget, min, max })
  }

  const handleCurrencyChange = (currency: string) => {
    onUpdate({ ...budget, currency })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: budget.currency,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const getCurrencyIcon = () => {
    switch (budget.currency) {
      case "USD":
        return <DollarSign className="h-4 w-4" />
      case "EUR":
        return <Euro className="h-4 w-4" />
      case "GBP":
        return <PoundSterling className="h-4 w-4" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  // Predefined budget ranges
  const budgetPresets = [
    { label: "Budget", min: 500, max: 2000 },
    { label: "Moderate", min: 2000, max: 5000 },
    { label: "Luxury", min: 5000, max: 10000 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Select value={budget.currency} onValueChange={handleCurrencyChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="USD">USD ($)</SelectItem>
            <SelectItem value="EUR">EUR (€)</SelectItem>
            <SelectItem value="GBP">GBP (£)</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex-1 text-center">
          <div className="text-2xl font-bold">
            {formatCurrency(range[0])} - {formatCurrency(range[1])}
          </div>
          <p className="text-sm text-muted-foreground">Estimated total budget</p>
        </div>
      </div>

      <div className="px-2">
        <Slider
          defaultValue={[range[0], range[1]]}
          min={0}
          max={15000}
          step={100}
          value={[range[0], range[1]]}
          onValueChange={handleRangeChange}
          className="py-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatCurrency(0)}</span>
          <span>{formatCurrency(5000)}</span>
          <span>{formatCurrency(10000)}</span>
          <span>{formatCurrency(15000)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Quick Select</label>
        <div className="flex flex-wrap gap-2">
          {budgetPresets.map((preset) => (
            <Button
              key={preset.label}
              variant="outline"
              size="sm"
              onClick={() => handleRangeChange([preset.min, preset.max])}
            >
              {getCurrencyIcon()}
              <span className="ml-1">{preset.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md bg-muted p-4">
        <h4 className="font-medium">Budget Tips</h4>
        <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
          <li>• Consider accommodation, food, activities, and transportation costs</li>
          <li>• Add a buffer of 10-15% for unexpected expenses</li>
          <li>• Research local costs at your destinations</li>
        </ul>
      </div>
    </div>
  )
}
