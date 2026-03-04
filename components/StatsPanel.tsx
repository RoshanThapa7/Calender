import { Card } from "@/components/ui/card";

interface CountItem {
  emoji: string;
  name: string;
  count: number;
}

interface StatsPanelProps {
  monthlyCounts: CountItem[];
  totalCounts: CountItem[];
}

function CountList({ title, items }: { title: string; items: CountItem[] }): JSX.Element {
  return (
    <Card className="bg-white/75 backdrop-blur-sm">
      <h3 className="mb-3 text-lg font-semibold text-plum">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-plum/60">No symbols yet. Add a few moments ✨</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.name} className="flex items-center justify-between rounded-2xl bg-white/80 px-3 py-2 text-plum">
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

export function StatsPanel({ monthlyCounts, totalCounts }: StatsPanelProps): JSX.Element {
  return (
    <aside className="space-y-4">
      <CountList title="This Month" items={monthlyCounts} />
      <CountList title="All Time" items={totalCounts} />
    </aside>
  );
}
