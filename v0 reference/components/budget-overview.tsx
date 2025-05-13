"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BudgetCategory {
  name: string
  amount: number
  spent: number
}

interface Budget {
  total: number
  currency: string
  categories: BudgetCategory[]
}

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

interface BudgetOverviewProps {
  budget: Budget
  expenses: Expense[]
  formatCurrency: (amount: number, currency?: string) => string
  currency: string
}

export function BudgetOverview({ budget, expenses, formatCurrency, currency }: BudgetOverviewProps) {
  // Calculate spending by category for pie chart
  const categoryData = budget.categories.map((category) => ({
    name: category.name,
    value: category.spent,
  }))

  // Calculate spending by payment method
  const paymentMethodData = expenses.reduce((acc: { name: string; value: number }[], expense) => {
    const existingMethod = acc.find((item) => item.name === expense.paymentMethod)
    if (existingMethod) {
      existingMethod.value += expense.amount
    } else {
      acc.push({ name: expense.paymentMethod, value: expense.amount })
    }
    return acc
  }, [])

  // Calculate spending by location
  const locationData = expenses.reduce((acc: { name: string; value: number }[], expense) => {
    const existingLocation = acc.find((item) => item.name === expense.location)
    if (existingLocation) {
      existingLocation.value += expense.amount
    } else {
      acc.push({ name: expense.location, value: expense.amount })
    }
    return acc
  }, [])

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D"]

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {budget.categories.map((category, index) => {
          const percentage = Math.round((category.spent / category.amount) * 100)
          return (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                <CardDescription>
                  {formatCurrency(category.spent)} of {formatCurrency(category.amount)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Progress value={percentage} className="h-2" />
                <div className="mt-1 text-xs text-muted-foreground text-right">{percentage}% spent</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="category">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="category">By Category</TabsTrigger>
          <TabsTrigger value="payment">By Payment Method</TabsTrigger>
          <TabsTrigger value="location">By Location</TabsTrigger>
        </TabsList>
        <TabsContent value="category" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
              <CardDescription>Breakdown of your expenses by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#f3a034" : index === 1 ? "#4ba46c" : COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="payment" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Payment Method</CardTitle>
              <CardDescription>Breakdown of your expenses by payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#f3a034" : index === 1 ? "#4ba46c" : COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="location" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Location</CardTitle>
              <CardDescription>Breakdown of your expenses by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={locationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {locationData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#f3a034" : index === 1 ? "#4ba46c" : COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
