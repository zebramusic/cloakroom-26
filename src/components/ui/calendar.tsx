"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Calendar({
  className,
  classNames: classNamesProp,
  showOutsideDays = true,
  captionLayout = "buttons",
  buttonVariant = "ghost",
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className,
      )}
      captionLayout={captionLayout}
      classNames={{
        ...classNamesProp,
        root: cn("w-fit", classNamesProp?.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          classNamesProp?.months,
        ),
        month: cn("flex w-full flex-col gap-4", classNamesProp?.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          classNamesProp?.nav,
        ),
        nav_button: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          classNamesProp?.nav_button,
        ),
        nav_button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          classNamesProp?.nav_button_previous,
        ),
        nav_button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          classNamesProp?.nav_button_next,
        ),
        caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          classNamesProp?.caption,
        ),
        caption_dropdowns: cn(
          "flex h-[--cell-size] w-full items-center justify-center gap-1.5 text-sm font-medium",
          classNamesProp?.caption_dropdowns,
        ),
        dropdown: cn(
          "bg-popover absolute inset-0 opacity-0",
          classNamesProp?.dropdown,
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "buttons"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          classNamesProp?.caption_label,
        ),
        table: cn("w-full border-collapse", classNamesProp?.table),
        head_row: cn("flex", classNamesProp?.head_row),
        head_cell: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          classNamesProp?.head_cell,
        ),
        row: cn("mt-2 flex w-full", classNamesProp?.row),
        cell: cn("text-center text-sm", classNamesProp?.cell),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          classNamesProp?.day,
        ),
        day_range_start: cn(
          "bg-accent rounded-l-md",
          classNamesProp?.day_range_start,
        ),
        day_range_middle: cn("rounded-none", classNamesProp?.day_range_middle),
        day_range_end: cn(
          "bg-accent rounded-r-md",
          classNamesProp?.day_range_end,
        ),
        day_today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          classNamesProp?.day_today,
        ),
        day_outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          classNamesProp?.day_outside,
        ),
        day_disabled: cn(
          "text-muted-foreground opacity-50",
          classNamesProp?.day_disabled,
        ),
        day_hidden: cn("invisible", classNamesProp?.day_hidden),
      }}
      components={{
        ...components,
        IconLeft: ({ className, ...iconProps }) => (
          <ChevronLeftIcon className={cn("size-4", className)} {...iconProps} />
        ),
        IconRight: ({ className, ...iconProps }) => (
          <ChevronRightIcon
            className={cn("size-4", className)}
            {...iconProps}
          />
        ),
        WeekNumber: ({ number, ...weekNumberProps }) => (
          <td {...weekNumberProps}>
            <div className="flex size-[--cell-size] items-center justify-center text-center">
              {number}
            </div>
          </td>
        ),
      }}
      {...props}
    />
  );
}
export { Calendar };
