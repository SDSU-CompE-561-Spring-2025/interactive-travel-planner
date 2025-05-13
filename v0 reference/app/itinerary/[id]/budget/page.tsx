"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Calculator, CreditCard, DollarSign, Filter, Plus, Receipt, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BudgetOverview } from "@/components/budget-overview"
import { ExpenseForm } from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { CategoryBreakdown } from "@/components/category-breakdown"
import { SpendingTimeline } from "@/components/spending-timeline"
import { CurrencySelector } from "@/components/currency-selector"

export default function BudgetPage({ params }: { params: { id: string } }) {
  const [showExpenseForm, setShowExpenseForm] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState("USD")

  // This would normally be fetched from an API based on the ID
  const itinerary = {
    id: params.id,
    title: "European Capitals Tour",
    startDate: "2024-06-10",
    endDate: "2024-06-24",
    budget: {
      total: 5000,
      currency: "USD",
      categories: [
        { name: "Accommodation", amount: 1800, spent: 1650 },
        { name: "Transportation", amount: 1200, spent: 1100 },
        { name: "Food & Drinks", amount: 1000, spent: 850 },
        { name: "Activities", amount: 600, spent: 450 },
        { name: "Shopping", amount: 300, spent: 120 },
        { name: "Miscellaneous", amount: 100, spent: 80 },
      ],
    },
    expenses: [
      {
        id: 1,
        date: "2024-06-10",
        amount: 550,
        currency: "EUR",
        category: "Accommodation",
        description: "Hotel de Paris - First 3 nights",
        paymentMethod: "Credit Card",
        location: "Paris, France",
      },
      {
        id: 2,
        date: "2024-06-11",
        amount: 120,
        currency: "EUR",
        category: "Food & Drinks",
        description: "Dinner at Le Petit Bistro",
        paymentMethod: "Cash",
        location: "Paris, France",
      },
      {
        id: 3,
        date: "2024-06-12",
        amount: 75,
        currency: "EUR",
        category: "Activities",
        description: "Louvre Museum tickets",
        paymentMethod: "Credit Card",
        location: "Paris, France",
      },
      {
        id: 4,
        date: "2024-06-13",
        amount: 95,
        currency: "EUR",
        category: "Transportation",
        description: "Train tickets to Rome",
        paymentMethod: "Credit Card",
        location: "Paris, France",
      },
      {
        id: 5,
        date: "2024-06-15",
        amount: 600,
        currency: "EUR",
        category: "Accommodation",
        description: "Roma Luxury Suites - 4 nights",
        paymentMethod: "Credit Card",
        location: "Rome, Italy",
      },
      {
        id: 6,
        date: "2024-06-16",
        amount: 85,
        currency: "EUR",
        category: "Food & Drinks",
        description: "Dinner at Trattoria da Luigi",
        paymentMethod: "Cash",
        location: "Rome, Italy",
      },
      {
        id: 7,
        date: "2024-06-17",
        amount: 60,
        currency: "EUR",
        category: "Activities",
        description: "Vatican Museums tickets",
        paymentMethod: "Credit Card",
        location: "Rome, Italy",
      },
      {
        id: 8,
        date: "2024-06-18",
        amount: 120,
        currency: "EUR",
        category: "Activities",
        description: "Italian Cooking Class",
        paymentMethod: "Credit Card",
        location: "Rome, Italy",
      },
      {
        id: 9,
        date: "2024-06-19",
        amount: 110,
        currency: "EUR",
        category: "Transportation",
        description: "Flight to Barcelona",
        paymentMethod: "Credit Card",
        location: "Rome, Italy",
      },
      {
        id: 10,
        date: "2024-06-20",
        amount: 500,
        currency: "EUR",
        category: "Accommodation",
        description: "Barcelona Beach Resort - 4 nights",
        paymentMethod: "Credit Card",
        location: "Barcelona, Spain",
      },
    ],
  }

  // Calculate total budget and spent
  const totalBudget = itinerary.budget.total
  const totalSpent = itinerary.budget.categories.reduce((acc, category) => acc + category.spent, 0)
  const remainingBudget = totalBudget - totalSpent
  const spentPercentage = Math.round((totalSpent / totalBudget) * 100)

  // Format currency
  const formatCurrency = (amount: number, currency: string = selectedCurrency) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount)
  }

  // Add a new expense
  const handleAddExpense = (expense: any) => {
    // In a real app, this would send data to the backend
    console.log("Adding expense:", expense)
    setShowExpenseForm(false)
    // Would update the expenses list here
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <Button variant="ghost" size="icon" asChild className="mr-2">
            <Link href={`/itinerary/${params.id}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-semibold">Budget & Expenses</h1>
            <p className="text-sm text-muted-foreground">{itinerary.title}</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <CurrencySelector value={selectedCurrency} onChange={setSelectedCurrency} />
            <Button onClick={() => setShowExpenseForm(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Budget Overview</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Total Budget</div>
                    <div className="text-right font-medium">{formatCurrency(totalBudget)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Spent</div>
                    <div className="text-right font-medium">{formatCurrency(totalSpent)}</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">Remaining</div>
                    <div className="text-right font-medium">{formatCurrency(remainingBudget)}</div>
                  </div>
                </div>
                <Progress value={spentPercentage} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">{spentPercentage}% of budget spent</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Quick Add</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <CreditCard className="mb-1 h-5 w-5 text-primary" />
                  <span className="text-xs">Accommodation</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Wallet className="mb-1 h-5 w-5 text-primary" />
                  <span className="text-xs">Food & Drinks</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Calculator className="mb-1 h-5 w-5 text-primary" />
                  <span className="text-xs">Transportation</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Receipt className="mb-1 h-5 w-5 text-primary" />
                  <span className="text-xs">Activities</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Tabs defaultValue="overview">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-6">
              <BudgetOverview
                budget={itinerary.budget}
                expenses={itinerary.expenses}
                formatCurrency={formatCurrency}
                currency={selectedCurrency}
              />
            </TabsContent>
            <TabsContent value="expenses" className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">All Expenses</h2>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
              <ExpenseList expenses={itinerary.expenses} formatCurrency={formatCurrency} currency={selectedCurrency} />
            </TabsContent>
            <TabsContent value="categories" className="mt-6">
              <CategoryBreakdown
                categories={itinerary.budget.categories}
                formatCurrency={formatCurrency}
                currency={selectedCurrency}
              />
            </TabsContent>
            <TabsContent value="timeline" className="mt-6">
              <SpendingTimeline
                expenses={itinerary.expenses}
                startDate={itinerary.startDate}
                endDate={itinerary.endDate}
                formatCurrency={formatCurrency}
                currency={selectedCurrency}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {showExpenseForm && (
        <ExpenseForm
          onClose={() => setShowExpenseForm(false)}
          onSubmit={handleAddExpense}
          categories={itinerary.budget.categories.map((cat) => cat.name)}
          currency={selectedCurrency}
        />
      )}
    </div>
  )
}
