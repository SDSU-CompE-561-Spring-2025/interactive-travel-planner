"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  initialDateRange?: DateRange
  onUpdate?: (range: DateRange) => void
  className?: string
}

export function DateRangePicker({ initialDateRange, onUpdate, className }: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(initialDateRange)

  const handleSelect = (range: DateRange | undefined) => {
    setDate(range)
    if (range && onUpdate) {
      onUpdate(range)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
          onClick={() => {
            const today = new Date()
            const nextWeek = new Date(today)
            nextWeek.setDate(today.getDate() + 7)

            const range = { from: today, to: nextWeek }
            setDate(range)
            if (onUpdate) onUpdate(range)
          }}
        >
          Next Week
        </Button>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
          onClick={() => {
            const today = new Date()
            const nextMonth = new Date(today)
            nextMonth.setMonth(today.getMonth() + 1)

            const range = { from: today, to: nextMonth }
            setDate(range)
            if (onUpdate) onUpdate(range)
          }}
        >
          Next Month
        </Button>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
          onClick={() => {
            const today = new Date()
            const weekend = new Date(today)

            // Find the next Friday
            const dayOfWeek = today.getDay()
            const daysUntilFriday = (5 - dayOfWeek + 7) % 7
            weekend.setDate(today.getDate() + daysUntilFriday)

            // Sunday is 2 days after Friday
            const sunday = new Date(weekend)
            sunday.setDate(weekend.getDate() + 2)

            const range = { from: weekend, to: sunday }
            setDate(range)
            if (onUpdate) onUpdate(range)
          }}
        >
          Weekend Trip
        </Button>
        <Button
          variant="outline"
          className="justify-start text-left font-normal"
          onClick={() => {
            const today = new Date()
            const summerStart = new Date(today.getFullYear(), 5, 15) // June 15
            const summerEnd = new Date(today.getFullYear(), 7, 15) // August 15

            // If we're past summer, use next year
            if (today > summerEnd) {
              summerStart.setFullYear(today.getFullYear() + 1)
              summerEnd.setFullYear(today.getFullYear() + 1)
            }

            const range = { from: summerStart, to: summerEnd }
            setDate(range)
            if (onUpdate) onUpdate(range)
          }}
        >
          Summer
        </Button>
      </div>
    </div>
  )
}
