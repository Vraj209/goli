"use client";

import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import { CalendarDays, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";

type SharedFieldProps = {
  label: string;
  description?: string;
};

type ThemedSelectProps = SharedFieldProps & {
  value: string;
  options: readonly string[];
  getLabel: (value: string) => string;
  onChange: (value: string) => void;
};

type ThemedDatePickerProps = SharedFieldProps & {
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
};

function useDismissableLayer<T extends HTMLElement>(
  open: boolean,
  onClose: () => void,
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, open]);

  return ref;
}

export function ThemedSelect({
  label,
  description,
  value,
  options,
  getLabel,
  onChange,
}: ThemedSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useDismissableLayer<HTMLDivElement>(open, () => setOpen(false));

  return (
    <div className="relative flex flex-col gap-2" ref={ref}>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex h-11 items-center justify-between border border-white/10 bg-black px-3 text-sm text-zinc-100 outline-none transition-colors hover:border-white/20 focus:border-cyan-400/50"
      >
        <span className="truncate">{getLabel(value)}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-zinc-500 transition-transform", open && "rotate-180")}
        />
      </button>
      {description ? <p className="text-xs text-zinc-500">{description}</p> : null}

      {open ? (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 border border-white/10 bg-[#09090b] p-1 shadow-2xl">
          <div className="max-h-64 overflow-y-auto">
            {options.map((option) => {
              const active = value === option;

              return (
                <button
                  key={option || "empty"}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors",
                    active
                      ? "bg-cyan-400/8 text-cyan-100"
                      : "text-zinc-300 hover:bg-white/4 hover:text-zinc-100",
                  )}
                >
                  <span>{getLabel(option)}</span>
                  {active ? <Check className="h-4 w-4" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ThemedDatePicker({
  label,
  description,
  value,
  placeholder = "Select date",
  onChange,
}: ThemedDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = value ? new Date(value) : null;
  const [cursor, setCursor] = useState<Date>(selectedDate ?? new Date());
  const ref = useDismissableLayer<HTMLDivElement>(open, () => setOpen(false));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  return (
    <div className="relative flex flex-col gap-2" ref={ref}>
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">
        {label}
      </span>

      <button
        type="button"
        onClick={() => {
          setCursor(selectedDate ?? new Date());
          setOpen((current) => !current);
        }}
        className="flex h-11 items-center justify-between border border-white/10 bg-black px-3 text-sm text-zinc-100 outline-none transition-colors hover:border-white/20 focus:border-cyan-400/50"
      >
        <span className={cn(!value && "text-zinc-600")}>
          {value ? format(new Date(value), "MMM d, yyyy") : placeholder}
        </span>
        <CalendarDays className="h-4 w-4 text-zinc-500" />
      </button>
      {description ? <p className="text-xs text-zinc-500">{description}</p> : null}

      {open ? (
        <div className="absolute left-0 top-full z-50 mt-2 w-76 border border-white/10 bg-[#09090b] p-3 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCursor((current) => subMonths(current, 1))}
              className="border border-white/10 p-2 text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-300">
              {format(cursor, "MMMM yyyy")}
            </p>
            <button
              type="button"
              onClick={() => setCursor((current) => addMonths(current, 1))}
              className="border border-white/10 p-2 text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
              <div
                key={day}
                className="py-1 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-zinc-600"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((day) => {
              const active = selectedDate ? isSameDay(day, selectedDate) : false;
              const inMonth = isSameMonth(day, cursor);

              return (
                <button
                  key={day.toISOString()}
                  type="button"
                  onClick={() => {
                    onChange(format(day, "yyyy-MM-dd"));
                    setOpen(false);
                  }}
                  className={cn(
                    "flex aspect-square items-center justify-center border text-sm transition-colors",
                    active
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
                      : "border-white/10 hover:border-white/20 hover:bg-white/4",
                    inMonth ? "text-zinc-100" : "text-zinc-600",
                  )}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between gap-3">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className="border border-white/10 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-100"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onChange(format(today, "yyyy-MM-dd"));
                setCursor(today);
                setOpen(false);
              }}
              className="border border-cyan-400/40 bg-cyan-400/6 px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-cyan-100 transition-colors hover:border-cyan-300/60"
            >
              Today
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
