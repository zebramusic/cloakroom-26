"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateRange {
  from?: Date;
  to?: Date;
}

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
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const parseDate = (dateString: string) => {
    if (!dateString) return undefined;
    return new Date(dateString + "T00:00:00");
  };

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = parseDate(e.target.value);
    onChange?.({ from: newFrom, to: value?.to });
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = parseDate(e.target.value);
    onChange?.({ from: value?.from, to: newTo });
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground",
            )}
            disabled={disabled}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {value.from.toLocaleDateString(locale)} -{" "}
                  {value.to.toLocaleDateString(locale)}
                </>
              ) : (
                value.from.toLocaleDateString(locale)
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4" align="start">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Start Date
              </label>
              <Input
                type="date"
                value={formatDate(value?.from)}
                onChange={handleFromChange}
                min={formatDate(minDate)}
                disabled={disabled}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">End Date</label>
              <Input
                type="date"
                value={formatDate(value?.to)}
                onChange={handleToChange}
                min={formatDate(value?.from || minDate)}
                disabled={disabled}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
