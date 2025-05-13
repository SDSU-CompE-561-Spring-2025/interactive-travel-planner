"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface BudgetCategory {
  name: string
  amount: number
  spent: number
}

interface CategoryBreakdownProps {
  categories: BudgetCategory[]
  formatCurrency: (amount: number, currency?: string) => string
  currency: string
}

export function CategoryBreakdown({ categories, formatCurrency, currency }: CategoryBreakdownProps) {
  // Prepare data for the chart
  const chartData = categories.map((category) => ({
    name: category.name,
    budget: category.amount,
    spent: category.spent,
    remaining: category.amount - category.spent,
  }))

  // Colors for the chart
  const COLORS = {
    budget: "#e0e0e0",
    spent: "#14b8a6",
    remaining: "#94a3b8",
  }

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget vs. Actual Spending</CardTitle>
          <CardDescription>Compare your planned budget with actual spending by category</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis
                  tickFormatter={(value) => {
                    return formatCurrency(value).split(".")[0]
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="budget" name="Budget" fill={COLORS.budget} />
                <Bar dataKey="spent" name="Spent" fill={COLORS.spent} />
                <Bar dataKey="remaining" name="Remaining" fill={COLORS.remaining} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category, index) => {
          const percentage = Math.round((category.spent / category.amount) * 100)
          const remaining = category.amount - category.spent
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-medium">{category.name}</CardTitle>
                  <span
                    className={`text-sm font-medium ${
                      percentage > 90 ? "text-destructive" : percentage > 75 ? "text-amber-500" : "text-teal-500"
                    }`}
                  >
                    {percentage}%
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Spent: </span>
                    <span className="font-medium">{formatCurrency(category.spent)}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-medium">{formatCurrency(category.amount)}</span>
                  </div>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Remaining: </span>
                  <span className="font-medium">{formatCurrency(remaining)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
