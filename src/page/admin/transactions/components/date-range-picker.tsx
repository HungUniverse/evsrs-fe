import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartDateChange: (value: string) => void
  onEndDateChange: (value: string) => void
  className?: string
}

export function DateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Convert string dates to Date objects
  const dateRange: DateRange | undefined = React.useMemo(() => {
    const from = startDate ? new Date(startDate) : undefined
    const to = endDate ? new Date(endDate) : undefined
    
    if (!from && !to) return undefined
    
    return {
      from: from || undefined,
      to: to || undefined,
    }
  }, [startDate, endDate])

  // Format date to YYYY-MM-DD for input
  const formatDateString = (date: Date | undefined): string => {
    if (!date) return ""
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleSelect = (range: DateRange | undefined) => {
    if (!range) {
      onStartDateChange("")
      onEndDateChange("")
      return
    }

    // Update start date if from is selected
    if (range.from) {
      onStartDateChange(formatDateString(range.from))
    } else {
      onStartDateChange("")
    }

    // Update end date if to is selected
    if (range.to) {
      onEndDateChange(formatDateString(range.to))
      // Only close popover when both dates are selected
      if (range.from) {
        setOpen(false)
      }
    } else {
      // If only start date is selected, keep popover open
      // Don't clear end date if it was previously set and we're just selecting a new start date
      if (!range.from) {
        onEndDateChange("")
      }
    }
  }

  // Display text
  const displayText = React.useMemo(() => {
    if (!startDate && !endDate) {
      return "Chọn khoảng ngày"
    }
    
    if (startDate && endDate) {
      const from = new Date(startDate)
      const to = new Date(endDate)
      return `${format(from, "dd/MM/yyyy", { locale: vi })} - ${format(to, "dd/MM/yyyy", { locale: vi })}`
    }
    
    if (startDate) {
      const from = new Date(startDate)
      return `Từ ${format(from, "dd/MM/yyyy", { locale: vi })}`
    }
    
    return "Chọn khoảng ngày"
  }, [startDate, endDate])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "h-9 bg-background text-sm justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-[70]" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

