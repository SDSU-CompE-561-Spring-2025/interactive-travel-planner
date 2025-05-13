"use client"

import { useState } from "react"
import { CreditCard, Edit, MoreHorizontal, Receipt, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

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

interface ExpenseListProps {
  expenses: Expense[]
  formatCurrency: (amount: number, currency?: string) => string
  currency: string
}

export function ExpenseList({ expenses, formatCurrency, currency }: ExpenseListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Sort expenses by date (newest first)
  const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Filter expenses based on search term
  const filteredExpenses = sortedExpenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    const categoryColors: Record<string, string> = {
      Accommodation: "bg-blue-100 text-blue-800",
      Transportation: "bg-purple-100 text-purple-800",
      "Food & Drinks": "bg-amber-100 text-amber-800",
      Activities: "bg-green-100 text-green-800",
      Shopping: "bg-pink-100 text-pink-800",
      Miscellaneous: "bg-gray-100 text-gray-800",
    }

    return categoryColors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search expenses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="icon" onClick={() => setSearchTerm("")} className="shrink-0">
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Clear search</span>
        </Button>
      </div>

      {filteredExpenses.length === 0 ? (
        <Card className="p-8 text-center">
          <Receipt className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No expenses found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            {searchTerm ? "Try a different search term" : "Add your first expense to get started"}
          </p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{formatDate(expense.date)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {expense.paymentMethod === "Credit Card" ? (
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                      )}
                      {expense.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getCategoryColor(expense.category)}>{expense.category}</Badge>
                  </TableCell>
                  <TableCell>{expense.location}</TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(expense.amount)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
