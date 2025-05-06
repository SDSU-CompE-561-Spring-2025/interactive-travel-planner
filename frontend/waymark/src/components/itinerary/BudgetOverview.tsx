// src/components/itinerary/BudgetOverview.tsx
'use client'

import { Card } from '../ui/card'
import { Progress } from '../ui/progress'
import { BadgeCheck, AlertCircle } from 'lucide-react'

interface Props { total: number; spent: number }

export default function BudgetOverview({ total, spent }: Props) {
  const pct = Math.round((spent / total) * 100)
  const remaining = total - spent
  
  // Determine budget status
  const getBudgetStatus = () => {
    if (pct <= 50) return 'good'
    if (pct <= 80) return 'warning'
    return 'critical'
  }
  
  const status = getBudgetStatus()
  
  return (
    <Card className="space-y-4 p-6 overflow-hidden relative shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Budget</h2>
        {status === 'good' && (
          <span className="inline-flex items-center text-green-600 text-sm">
            <BadgeCheck className="w-4 h-4 mr-1" /> Under budget
          </span>
        )}
        {status === 'critical' && (
          <span className="inline-flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" /> Near limit
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Total Budget</p>
          <p className="text-3xl font-bold">${total.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-500 mb-1">Spent</p>
          <p className="text-3xl font-bold">${spent.toLocaleString()}</p>
          <p className="text-sm font-medium">{pct}% of total</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">Budget Progress</span>
          <span className="text-gray-500">${spent.toLocaleString()} of ${total.toLocaleString()}</span>
        </div>
        <Progress 
          value={pct} 
          className="h-2" 
          style={{
            backgroundColor: 
              status === 'good' 
                ? 'green' 
                : status === 'warning' 
                  ? 'yellow' 
                  : 'red'
          }}
        />
        
        <p className={`text-sm font-medium ${
          remaining > 0 
            ? 'text-green-600' 
            : 'text-red-600'
        }`}>
          {remaining > 0 
            ? `$${remaining.toLocaleString()} remaining` 
            : `$${Math.abs(remaining).toLocaleString()} over budget`}
        </p>
      </div>
      
      {/* Decorative element */}
      <div className="absolute -right-12 -top-12 w-40 h-40 bg-teal-50 rounded-full opacity-20 z-0"></div>
    </Card>
  )
}