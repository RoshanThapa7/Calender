"use client";

import { useEffect, useMemo, useState } from "react";

import { CalendarComponent } from "@/components/CalendarComponent";
import { DateModal } from "@/components/DateModal";
import { Header } from "@/components/Header";
import { StatsPanel } from "@/components/StatsPanel";
import { TrendPanel } from "@/components/TrendPanel";
import { SymbolManagerModal } from "@/components/SymbolManagerModal";
import { DateEntries, StorageData, SymbolItem } from "@/types";

const STORAGE_KEY = "cute-calendar-tracker";

interface LinePoint {
  label: string;
  values: Record<string, number>;
}

interface LineSeries {
  id: string;
  label: string;
  emoji: string;
}


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

function createSeries(symbols: SymbolItem[]): LineSeries[] {
  return symbols.map((symbol) => ({ id: symbol.id, label: symbol.name, emoji: symbol.emoji }));
}

function buildYearMonthlyData(dateEntries: DateEntries, symbols: SymbolItem[], year: number): { points: LinePoint[]; series: LineSeries[] } {
  const series = createSeries(symbols);
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const points: LinePoint[] = monthLabels.map((label) => ({
    label,
    values: Object.fromEntries(series.map((item) => [item.id, 0])),
  }));

  Object.entries(dateEntries).forEach(([dateKey, symbolIds]) => {
    const [yearPart, monthPart] = dateKey.split("-");
    if (Number(yearPart) !== year) return;
    const monthIndex = Number(monthPart) - 1;
    if (monthIndex < 0 || monthIndex > 11) return;

    symbolIds.forEach((symbolId) => {
      if (points[monthIndex].values[symbolId] !== undefined) {
        points[monthIndex].values[symbolId] += 1;
      }
    });
  });

  return { points, series };
}

function buildYearlyData(dateEntries: DateEntries, symbols: SymbolItem[]): { points: LinePoint[]; series: LineSeries[]; years: number[] } {
  const series = createSeries(symbols);
  const yearMap = new Map<number, LinePoint>();

  Object.entries(dateEntries).forEach(([dateKey, symbolIds]) => {
    const [yearPart] = dateKey.split("-");
    const year = Number(yearPart);
    if (!yearMap.has(year)) {
      yearMap.set(year, {
        label: String(year),
        values: Object.fromEntries(series.map((item) => [item.id, 0])),
      });
    }

    const point = yearMap.get(year);
    if (!point) return;

    symbolIds.forEach((symbolId) => {
      if (point.values[symbolId] !== undefined) {
        point.values[symbolId] += 1;
      }
    });
  });

  const years = Array.from(yearMap.keys()).sort((a, b) => a - b);
  const points = years.map((year) => yearMap.get(year)).filter((point): point is LinePoint => Boolean(point));

  return { points, series, years };
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
  const [isStorageLoaded, setIsStorageLoaded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const savedRaw = localStorage.getItem(STORAGE_KEY);
    if (savedRaw) {
      try {
        const parsed = JSON.parse(savedRaw) as StorageData;
        setSymbols(parsed.symbols ?? []);
        setDateEntries(parsed.dateEntries ?? {});
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    setIsStorageLoaded(true);
  }, []);

  useEffect(() => {
    if (!isStorageLoaded) return;
    const payload: StorageData = { symbols, dateEntries };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [symbols, dateEntries, isStorageLoaded]);

  const selectedSymbolIds = selectedDate ? dateEntries[selectedDate] ?? [] : [];

  useEffect(() => {
    setSelectedYear((prev) => (prev === visibleMonth.year ? prev : visibleMonth.year));
  }, [visibleMonth.year]);

  const monthlyCounts = useMemo(
    () => buildCounts(dateEntries, symbols, visibleMonth),
    [dateEntries, symbols, visibleMonth],
  );
  const totalCounts = useMemo(() => buildCounts(dateEntries, symbols), [dateEntries, symbols]);
  const monthlyLineData = useMemo(
    () => buildYearMonthlyData(dateEntries, symbols, visibleMonth.year),
    [dateEntries, symbols, visibleMonth.year],
  );
  const yearlyLineData = useMemo(() => buildYearlyData(dateEntries, symbols), [dateEntries, symbols]);
  const drilldownLineData = useMemo(
    () => buildYearMonthlyData(dateEntries, symbols, selectedYear),
    [dateEntries, symbols, selectedYear],
  );

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
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
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

      <section className="mt-6">
        <TrendPanel
          monthlyByYearData={monthlyLineData}
          yearlyData={{ points: yearlyLineData.points, series: yearlyLineData.series }}
          selectedYear={selectedYear}
          availableYears={yearlyLineData.years.length > 0 ? yearlyLineData.years : [selectedYear]}
          drilldownYearData={drilldownLineData}
          onSelectYear={setSelectedYear}
        />
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
