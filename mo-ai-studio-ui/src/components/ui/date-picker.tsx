"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/theme/cn"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function DatePicker({ value }) {
  const [date, setDate] = React.useState<Date>(value)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[280px] justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={date} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}

export function DateTimePicker({ dateTimeValue }) {
  const [dateTime, setDate] = React.useState<Date>(dateTimeValue)

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn("w-[280px] justify-start text-left font-normal", !dateTime && "text-muted-foreground")}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {dateTime ? format(dateTime, "PPP") : <span>Pick a dateTime</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar mode='single' selected={dateTime} onSelect={setDate} initialFocus />
      </PopoverContent>
    </Popover>
  )
}
