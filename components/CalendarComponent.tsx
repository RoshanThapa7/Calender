"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg, DatesSetArg } from "@fullcalendar/core";
import { SymbolItem, DateEntries } from "@/types";

interface CalendarComponentProps {
  symbols: SymbolItem[];
  dateEntries: DateEntries;
  onDateClick: (dateKey: string) => void;
  onVisibleRangeChange: (year: number, month: number) => void;
}

export function CalendarComponent({
  symbols,
  dateEntries,
  onDateClick,
  onVisibleRangeChange,
}: CalendarComponentProps): JSX.Element {
  const symbolById = new Map(symbols.map((symbol) => [symbol.id, symbol]));

  const handleDateClick = (arg: DateClickArg): void => {
    onDateClick(arg.dateStr);
  };

  const handleDatesSet = (arg: DatesSetArg): void => {
    const date = arg.view.currentStart;
    onVisibleRangeChange(date.getFullYear(), date.getMonth());
  };

  const dayCellContent = (arg: { date: Date; dayNumberText: string }): JSX.Element => {
    const year = arg.date.getFullYear();
    const month = String(arg.date.getMonth() + 1).padStart(2, "0");
    const day = String(arg.date.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;
    const emojis = (dateEntries[key] ?? [])
      .map((symbolId) => symbolById.get(symbolId)?.emoji)
      .filter((emoji): emoji is string => Boolean(emoji));

    return (
      <div className="min-h-[80px] p-1">
        <p className="text-sm font-medium text-plum">{arg.dayNumberText}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {emojis.map((emoji, index) => (
            <span key={`${key}-${emoji}-${index}`} className="rounded-full bg-white/70 px-1.5 py-0.5 text-xs">
              {emoji}
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/65 p-3 shadow-soft">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        fixedWeekCount={false}
        height="auto"
        validRange={{ start: "2020-01-01", end: "2121-01-01" }}
        dateClick={handleDateClick}
        datesSet={handleDatesSet}
        dayCellContent={dayCellContent}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
      />
    </div>
  );
}
