"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
  value?: DateRange;
  onChange?: (date: DateRange | undefined) => void;
  disabled?: boolean;
  minDate?: Date;
  locale?: string;
}

export function DateRangePicker({
  value,
  onChange,
  disabled = false,
  minDate = new Date(),
  locale = "ro",
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(value);

  React.useEffect(() => {
    if (date && onChange) {
      onChange(date);
    }
  }, [date, onChange]);

  const formatDate = (dateValue: Date) => {
    const day = dateValue.getDate().toString().padStart(2, "0");
    const month = (dateValue.getMonth() + 1).toString().padStart(2, "0");
    const year = dateValue.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {formatDate(date.from)} - {formatDate(date.to)}
              </>
            ) : (
              formatDate(date.from)
            )
          ) : (
            <span>
              {locale === "ro" ? "Selectează perioada" : "Select date range"}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.from}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
          disabled={{ before: minDate }}
        />
      </PopoverContent>
    </Popover>
  );
}
