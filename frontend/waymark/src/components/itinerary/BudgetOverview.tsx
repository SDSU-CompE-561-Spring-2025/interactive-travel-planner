// src/components/itinerary/BudgetOverview.tsx
import { Card }     from '../ui/card'
import { Progress } from '../ui/progress'
import Badge from "@/components/ui/badge"


interface Props { total: number; spent: number }

export default function BudgetOverview({ total, spent }: Props) {
  const pct       = Math.round((spent / total) * 100)
  const remaining = total - spent

  return (
    <Card className="space-y-4">
      <h2 className="text-xl font-semibold">Budget</h2>
      <div className="flex justify-between items-baseline">
        <div>
          <p className="text-sm text-gray-500">Total Budget</p>
          <p className="text-2xl font-bold">${total.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Spent</p>
          <p className="text-2xl font-bold">${spent.toLocaleString()}</p>
          <p className="text-sm">{pct}%</p>
        </div>
      </div>
      <Progress value={pct} className="h-2" />
      <p className="text-sm text-gray-500">${remaining.toLocaleString()} remaining</p>
    </Card>
  )
}
