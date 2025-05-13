"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"

interface Expense {
  id: number
  date: string
  amount: number
  currency: string
  category: string
  description: string
  paymentMethod: string
  location: string
}

interface SpendingTimelineProps {
  expenses: Expense[]
  startDate: string
  endDate: string
  formatCurrency: (amount: number, currency?: string) => string
  currency: string
}

export function SpendingTimeline({ expenses, startDate, endDate, formatCurrency, currency }: SpendingTimelineProps) {
  // Generate all dates between start and end
  const generateDateRange = (start: string, end: string) => {
    const dates = []
    const currentDate = new Date(start)
    const lastDate = new Date(end)

    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate).toISOString().split("T")[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return dates
  }

  const dateRange = generateDateRange(startDate, endDate)

  // Prepare data for daily spending chart
  const dailySpending = dateRange.map((date) => {
    const dayExpenses = expenses.filter((expense) => expense.date === date)
    const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    return {
      date,
      amount: total,
      formattedDate: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }
  })

  // Prepare data for cumulative spending chart
  const cumulativeSpending = dailySpending.reduce((acc: any[], day, index) => {
    const previousTotal = index > 0 ? acc[index - 1].total : 0
    acc.push({
      date: day.date,
      formattedDate: day.formattedDate,
      daily: day.amount,
      total: previousTotal + day.amount,
    })
    return acc
  }, [])

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border bg-background p-2 shadow-sm">
          <p className="font-medium">{payload[0].payload.formattedDate}</p>
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
          <CardTitle>Daily Spending</CardTitle>
          <CardDescription>Track your expenses day by day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={dailySpending}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  interval={Math.ceil(dailySpending.length / 10)}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tickFormatter={(value) => {
                    return formatCurrency(value).split(".")[0]
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="amount" name="Daily Spending" fill="#f3a034" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cumulative Spending</CardTitle>
          <CardDescription>See how your expenses add up over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={cumulativeSpending}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="formattedDate"
                  interval={Math.ceil(cumulativeSpending.length / 10)}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  tickFormatter={(value) => {
                    return formatCurrency(value).split(".")[0]
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area type="monotone" dataKey="total" name="Total Spent" fill="#f3a034" stroke="#e18620" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
