"use client";

import { useEffect, useMemo, useState } from "react";

import { CalendarComponent } from "@/components/CalendarComponent";
import { DateModal } from "@/components/DateModal";
import { Header } from "@/components/Header";
import { StatsPanel } from "@/components/StatsPanel";
import { SymbolManagerModal } from "@/components/SymbolManagerModal";
import { DateEntries, StorageData, SymbolItem } from "@/types";

const STORAGE_KEY = "cute-calendar-tracker";


function buildCounts(dateEntries: DateEntries, symbols: SymbolItem[], filterMonth?: { year: number; month: number }) {
  const countById = new Map<string, number>();

  Object.entries(dateEntries).forEach(([dateKey, symbolIds]) => {
    if (filterMonth) {
      const date = new Date(`${dateKey}T00:00:00`);
      if (date.getFullYear() !== filterMonth.year || date.getMonth() !== filterMonth.month) return;
    }

    symbolIds.forEach((symbolId) => {
      countById.set(symbolId, (countById.get(symbolId) ?? 0) + 1);
    });
  });

  return symbols
    .map((symbol) => ({
      emoji: symbol.emoji,
      name: symbol.name,
      count: countById.get(symbol.id) ?? 0,
    }))
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count);
}

export default function Home(): JSX.Element {
  const [symbols, setSymbols] = useState<SymbolItem[]>([]);
  const [dateEntries, setDateEntries] = useState<DateEntries>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isDateModalOpen, setDateModalOpen] = useState(false);
  const [isSymbolModalOpen, setSymbolModalOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState<{ year: number; month: number }>({
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  useEffect(() => {
    const savedRaw = localStorage.getItem(STORAGE_KEY);
    if (!savedRaw) return;

    try {
      const parsed = JSON.parse(savedRaw) as StorageData;
      setSymbols(parsed.symbols ?? []);
      setDateEntries(parsed.dateEntries ?? {});
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload: StorageData = { symbols, dateEntries };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [symbols, dateEntries]);

  const selectedSymbolIds = selectedDate ? dateEntries[selectedDate] ?? [] : [];

  const monthlyCounts = useMemo(
    () => buildCounts(dateEntries, symbols, visibleMonth),
    [dateEntries, symbols, visibleMonth],
  );
  const totalCounts = useMemo(() => buildCounts(dateEntries, symbols), [dateEntries, symbols]);

  const toggleSymbolOnDate = (symbolId: string): void => {
    if (!selectedDate) return;

    setDateEntries((prev) => {
      const currentSymbols = prev[selectedDate] ?? [];
      const nextSymbols = currentSymbols.includes(symbolId)
        ? currentSymbols.filter((id) => id !== symbolId)
        : [...currentSymbols, symbolId];

      const nextEntries = { ...prev };
      if (nextSymbols.length === 0) {
        delete nextEntries[selectedDate];
      } else {
        nextEntries[selectedDate] = nextSymbols;
      }
      return nextEntries;
    });
  };

  const clearSelectedDate = (): void => {
    if (!selectedDate) return;
    setDateEntries((prev) => {
      const next = { ...prev };
      delete next[selectedDate];
      return next;
    });
  };

  const addSymbol = (emoji: string, name: string): void => {
    const item: SymbolItem = {
      id: crypto.randomUUID(),
      emoji,
      name,
    };
    setSymbols((prev) => [...prev, item]);
  };

  const deleteSymbol = (id: string): void => {
    setSymbols((prev) => prev.filter((symbol) => symbol.id !== id));
    setDateEntries((prev) => {
      const next: DateEntries = {};
      Object.entries(prev).forEach(([date, symbolIds]) => {
        const filtered = symbolIds.filter((symbolId) => symbolId !== id);
        if (filtered.length > 0) next[date] = filtered;
      });
      return next;
    });
  };

  return (
    <main className="mx-auto max-w-7xl p-4 md:p-8">
      <Header onManageSymbols={() => setSymbolModalOpen(true)} />
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <CalendarComponent
          symbols={symbols}
          dateEntries={dateEntries}
          onDateClick={(dateKey) => {
            setSelectedDate(dateKey);
            setDateModalOpen(true);
          }}
          onVisibleRangeChange={(year, month) => {
            setVisibleMonth((prev) => {
              if (prev.year === year && prev.month === month) return prev;
              return { year, month };
            });
          }}
        />
        <StatsPanel monthlyCounts={monthlyCounts} totalCounts={totalCounts} />
      </section>

      <DateModal
        open={isDateModalOpen}
        dateKey={selectedDate}
        symbols={symbols}
        selectedSymbolIds={selectedSymbolIds}
        onOpenChange={setDateModalOpen}
        onToggleSymbol={toggleSymbolOnDate}
        onClear={clearSelectedDate}
      />

      <SymbolManagerModal
        open={isSymbolModalOpen}
        symbols={symbols}
        onOpenChange={setSymbolModalOpen}
        onAddSymbol={addSymbol}
        onDeleteSymbol={deleteSymbol}
      />
    </main>
  );
}
