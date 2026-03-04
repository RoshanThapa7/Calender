"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LinePoint {
  label: string;
  values: Record<string, number>;
}

interface LineSeries {
  id: string;
  label: string;
  emoji: string;
}

interface LineData {
  points: LinePoint[];
  series: LineSeries[];
}

interface TrendPanelProps {
  monthlyByYearData: LineData;
  yearlyData: LineData;
  selectedYear: number;
  availableYears: number[];
  drilldownYearData: LineData;
  onSelectYear: (year: number) => void;
}

const LINE_COLORS = ["#d27ea6", "#9c84e8", "#f29f80", "#6c4f75", "#f36da4", "#7c6bda"];

function buildPath(points: LinePoint[], symbolId: string, width: number, height: number): string {
  if (points.length === 0) return "";

  const values = points.map((point) => point.values[symbolId] ?? 0);
  const maxValue = Math.max(...values, 1);
  const stepX = points.length === 1 ? 0 : width / (points.length - 1);

  return values
    .map((value, index) => {
      const x = index * stepX;
      const y = height - (value / maxValue) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(" ");
}

function LineChart({ title, data }: { title: string; data: LineData }): JSX.Element {
  const hasData = data.points.length > 0 && data.series.length > 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <h3 className="mb-3 text-lg font-semibold text-plum">{title}</h3>
      {!hasData ? (
        <p className="text-sm text-plum/60">No chart data yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl bg-white/85 p-3">
            <svg viewBox="0 0 900 220" className="h-56 min-w-[900px] w-full" role="img" aria-label={title}>
              <line x1="0" y1="200" x2="900" y2="200" stroke="#c8b3d1" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="200" stroke="#c8b3d1" strokeWidth="1" />
              {data.series.map((item, index) => (
                <path
                  key={item.id}
                  d={buildPath(data.points, item.id, 900, 200)}
                  fill="none"
                  stroke={LINE_COLORS[index % LINE_COLORS.length]}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
              {data.points.map((point, index) => {
                const stepX = data.points.length === 1 ? 0 : 900 / (data.points.length - 1);
                return (
                  <text key={point.label} x={index * stepX} y={218} textAnchor="middle" fontSize="11" fill="#6c4f75">
                    {point.label}
                  </text>
                );
              })}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.series.map((item, index) => (
              <span key={item.id} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs text-plum">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LINE_COLORS[index % LINE_COLORS.length] }} />
                {item.emoji} {item.label}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export function TrendPanel({
  monthlyByYearData,
  yearlyData,
  selectedYear,
  availableYears,
  drilldownYearData,
  onSelectYear,
}: TrendPanelProps): JSX.Element {
  return (
    <section className="space-y-4">
      <LineChart title="Monthly Symbol Count (Jan → Dec)" data={monthlyByYearData} />
      <LineChart title="All-Time Yearly Symbol Count" data={yearlyData} />

      <Card className="bg-white/80 backdrop-blur-sm">
        <h3 className="mb-3 text-lg font-semibold text-plum">Year Drilldown</h3>
        <div className="mb-4 flex flex-wrap gap-2">
          {availableYears.map((year) => (
            <Button
              key={year}
              size="sm"
              variant={year === selectedYear ? "default" : "ghost"}
              onClick={() => onSelectYear(year)}
            >
              {year}
            </Button>
          ))}
        </div>
        <LineChart title={`Monthly Symbol Count in ${selectedYear}`} data={drilldownYearData} />
      </Card>
    </section>
  );
}
