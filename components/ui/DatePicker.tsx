"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  XCircle,
  Calendar as CalendarIcon,
} from "lucide-react";

export interface DatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (date: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  minDate?: string;
  maxDate?: string;
  className?: string;
  align?: "left" | "right";
  showRangeSuffix?: boolean; // Shows " - " like in the screenshot "22 Feb - "
  locale?: "fr" | "en";
}

const MONTHS_FR = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

const MONTHS_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAYS_FR = ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"];
const WEEKDAYS_EN = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const SHORT_MONTHS_FR = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = "Sélectionner une date",
  required = false,
  minDate,
  maxDate,
  className = "",
  align = "left",
  showRangeSuffix = false,
  locale = "fr",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse initial view date from value or fallback to today
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState<number>(
    isNaN(initialDate.getTime()) ? new Date().getFullYear() : initialDate.getFullYear()
  );
  const [viewMonth, setViewMonth] = useState<number>(
    isNaN(initialDate.getTime()) ? new Date().getMonth() : initialDate.getMonth()
  );

  // Sync view when value changes from outside
  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Format display text inside the input
  const getDisplayText = () => {
    if (!value) return "";
    const [y, m, d] = value.split("-").map(Number);
    if (!y || !m || !d) return value;
    const monthName =
      locale === "fr" ? SHORT_MONTHS_FR[m - 1] : MONTHS_EN[m - 1].slice(0, 3);
    const suffix = showRangeSuffix ? "  -  " : "";
    return `${d} ${monthName} ${y}${suffix}`;
  };

  // Navigate months
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Build Calendar Days Matrix (Sunday first, like screenshot)
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay(); // 0 = Sunday
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  // Trailing days from previous month
  const prevMonthDays: { day: number; dateStr: string }[] = [];
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevM = viewMonth === 0 ? 12 : viewMonth;
    const prevY = viewMonth === 0 ? viewYear - 1 : viewYear;
    const mStr = String(prevM).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    prevMonthDays.push({ day: d, dateStr: `${prevY}-${mStr}-${dStr}` });
  }

  // Current month days
  const currentMonthDays: { day: number; dateStr: string }[] = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const mStr = String(viewMonth + 1).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    currentMonthDays.push({ day: d, dateStr: `${viewYear}-${mStr}-${dStr}` });
  }

  // Leading days from next month to fill grid
  const totalCellsSoFar = prevMonthDays.length + currentMonthDays.length;
  const nextMonthDaysCount = totalCellsSoFar % 7 === 0 ? 0 : 7 - (totalCellsSoFar % 7);
  const nextMonthDays: { day: number; dateStr: string }[] = [];
  for (let d = 1; d <= nextMonthDaysCount; d++) {
    const nextM = viewMonth === 11 ? 1 : viewMonth + 2;
    const nextY = viewMonth === 11 ? viewYear + 1 : viewYear;
    const mStr = String(nextM).padStart(2, "0");
    const dStr = String(d).padStart(2, "0");
    nextMonthDays.push({ day: d, dateStr: `${nextY}-${mStr}-${dStr}` });
  }

  // Today string YYYY-MM-DD
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(today.getDate()).padStart(2, "0")}`;

  const handleSelectDate = (dateStr: string) => {
    onChange(dateStr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const handleSelectToday = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(todayStr);
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  };

  const monthsList = locale === "fr" ? MONTHS_FR : MONTHS_EN;
  const weekdaysList = locale === "fr" ? WEEKDAYS_FR : WEEKDAYS_EN;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      {/* Trigger Box — Flat design with soft blue/violet border matching the screenshot */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 bg-white rounded-2xl border-2 transition-all duration-200 cursor-pointer select-none shadow-sm ${
          isOpen
            ? "border-violet-500 ring-2 ring-violet-200 shadow-md"
            : "border-[#b8cbfb] hover:border-violet-400"
        }`}
      >
        {/* Left: (x) Clear Icon button or Calendar icon if empty */}
        <div className="flex items-center gap-2 min-w-0">
          {value ? (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 rounded-lg text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition-colors focus:outline-none"
              title="Effacer la date"
            >
              <XCircle className="w-4 h-4 stroke-[2]" />
            </button>
          ) : (
            <CalendarIcon className="w-4 h-4 text-slate-400 stroke-[2]" />
          )}

          {/* Center Text */}
          <span
            className={`text-xs font-bold tracking-tight truncate ${
              value ? "text-slate-900" : "text-slate-400 font-normal"
            }`}
          >
            {value ? getDisplayText() : placeholder}
          </span>
        </div>

        {/* Right: Chevron Up / Down */}
        <div className="text-slate-700 shrink-0">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 stroke-[2.5]" />
          ) : (
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          )}
        </div>
      </div>

      {/* Dropdown Calendar Popover — Exact replica of the screenshot design */}
      {isOpen && (
        <div
          className={`absolute top-[calc(100%+8px)] ${
            align === "right" ? "right-0" : "left-0"
          } z-50 w-[310px] sm:w-[325px] bg-white rounded-3xl p-5 border border-slate-200 shadow-2xl shadow-slate-300/60 animate-in fade-in zoom-in-95 duration-150 select-none`}
        >
          {/* Calendar Header: < Month Year > */}
          <div className="flex items-center justify-between mb-4">
            {/* Prev Month Button */}
            <button
              type="button"
              onClick={handlePrevMonth}
              className="w-9 h-9 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-sm"
              aria-label="Mois précédent"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Month & Year Title */}
            <div className="text-center">
              <span className="font-display font-bold text-base sm:text-lg text-slate-950 tracking-tight">
                {monthsList[viewMonth]} {viewYear}
              </span>
            </div>

            {/* Next Month Button */}
            <button
              type="button"
              onClick={handleNextMonth}
              className="w-9 h-9 rounded-2xl border border-slate-200/90 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 flex items-center justify-center transition-all active:scale-95 shadow-sm"
              aria-label="Mois suivant"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Weekday Row (Su Mo Tu We Th Fr Sa) */}
          <div className="grid grid-cols-7 mb-2 text-center">
            {weekdaysList.map((wd, index) => (
              <span
                key={`${wd}-${index}`}
                className="text-[11px] sm:text-xs font-semibold text-slate-400 py-1"
              >
                {wd}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-center">
            {/* Trailing Days of Previous Month */}
            {prevMonthDays.map(({ day, dateStr }) => {
              const isSelected = value === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleSelectDate(dateStr)}
                  className={`w-9 h-9 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#111318] text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {/* Days of Current Month */}
            {currentMonthDays.map(({ day, dateStr }) => {
              const isSelected = value === dateStr;
              const isToday = todayStr === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleSelectDate(dateStr)}
                  className={`w-9 h-9 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all active:scale-95 ${
                    isSelected
                      ? "bg-[#111318] text-white shadow-md scale-105"
                      : isToday
                      ? "text-rose-600 font-extrabold hover:bg-rose-50"
                      : "text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {day}
                </button>
              );
            })}

            {/* Leading Days of Next Month */}
            {nextMonthDays.map(({ day, dateStr }) => {
              const isSelected = value === dateStr;
              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => handleSelectDate(dateStr)}
                  className={`w-9 h-9 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-[#111318] text-white shadow-md"
                      : "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Bottom Divider & Quick Actions */}
          <div className="border-t border-slate-100 mt-4 pt-3 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleSelectToday}
              className="font-bold text-violet-600 hover:text-violet-700 hover:underline transition-colors"
            >
              Aujourd&apos;hui
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="text-slate-500 hover:text-rose-600 font-medium transition-colors"
              >
                Effacer
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-slate-500 hover:text-slate-900 font-medium transition-colors"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DatePicker;
