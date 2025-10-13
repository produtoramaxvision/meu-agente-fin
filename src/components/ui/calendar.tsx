"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 sm:p-4 max-h-[320px] sm:max-h-[360px] overflow-hidden", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-3 sm:space-x-4 sm:space-y-0",
        month: "space-y-3 sm:space-y-4 w-full",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-base sm:text-lg font-medium",
        nav: "space-x-2 flex items-center",
        nav_button: cn(
          "inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-border/50 bg-transparent p-0",
          "hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex w-full",
        head_cell:
          "text-muted-foreground rounded-md flex-1 font-normal text-[0.75rem] sm:text-[0.8rem] text-center px-1",
        row: "flex w-full mt-1 sm:mt-2",
        cell: "flex-1 text-center text-sm px-1 py-0.5 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-full h-8 sm:h-9 md:h-10 px-2 py-1 font-normal aria-selected:opacity-100 hover:bg-accent/60 flex items-center justify-center rounded-md transition-colors"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "border border-primary/60 rounded-md",
        day_outside: "text-muted-foreground opacity-60",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />,
        IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }