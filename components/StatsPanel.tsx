import { Card } from "@/components/ui/card";

interface CountItem {
  emoji: string;
  name: string;
  count: number;
}

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

interface StatsPanelProps {
  monthlyCounts: CountItem[];
  totalCounts: CountItem[];
  monthlyLineData: LineData;
  allTimeLineData: LineData;
}

const LINE_COLORS = ["#d27ea6", "#9c84e8", "#f29f80", "#6c4f75", "#f36da4", "#7c6bda"];

function CountList({ title, items }: { title: string; items: CountItem[] }): JSX.Element {
  return (
    <Card>
      <h3 className="mb-3 text-lg font-semibold text-plum">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-plum/60">No symbols yet. Add a few moments ✨</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.name} className="flex items-center justify-between rounded-2xl bg-white/70 px-3 py-2 text-plum">
              <span className="font-medium">
                {item.emoji} {item.name}
              </span>
              <span className="text-sm">x{item.count}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

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

function LineChartCard({ title, data }: { title: string; data: LineData }): JSX.Element {
  const hasPoints = data.points.length > 0 && data.series.length > 0;

  return (
    <Card>
      <h3 className="mb-3 text-lg font-semibold text-plum">{title}</h3>
      {!hasPoints ? (
        <p className="text-sm text-plum/60">No chart data yet.</p>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl bg-white/70 p-3">
            <svg viewBox="0 0 360 170" className="h-44 min-w-[360px] w-full" role="img" aria-label={title}>
              <line x1="0" y1="160" x2="360" y2="160" stroke="#c8b3d1" strokeWidth="1" />
              <line x1="0" y1="0" x2="0" y2="160" stroke="#c8b3d1" strokeWidth="1" />
              {data.series.map((item, index) => (
                <path
                  key={item.id}
                  d={buildPath(data.points, item.id, 360, 160)}
                  fill="none"
                  stroke={LINE_COLORS[index % LINE_COLORS.length]}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              ))}
            </svg>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.series.map((item, index) => (
              <span
                key={item.id}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2 py-1 text-xs text-plum"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: LINE_COLORS[index % LINE_COLORS.length] }}
                  aria-hidden="true"
                />
                {item.emoji} {item.label}
              </span>
            ))}
          </div>
        </>
      )}
    </Card>
  );
}

export function StatsPanel({ monthlyCounts, totalCounts, monthlyLineData, allTimeLineData }: StatsPanelProps): JSX.Element {
  return (
    <aside className="space-y-4">
      <CountList title="This Month" items={monthlyCounts} />
      <CountList title="All Time" items={totalCounts} />
      <LineChartCard title="Monthly Trend" data={monthlyLineData} />
      <LineChartCard title="All-Time Trend" data={allTimeLineData} />
    </aside>
  );
}
