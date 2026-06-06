import { usageStats, heatmap } from "@/data/mock";
import { cn, formatNumber } from "@/lib/utils";
import { Card, Pill, ProgressBar, SectionLabel } from "@/components/ui";
import { Activity, MessageSquare, Coins, CalendarDays, Flame, Clock } from "lucide-react";

// teal -> cyan intensity ramp (index 1..4); 0 uses bg-bg-subtle
const HEAT_RAMP: Record<number, string> = {
  1: "#075C5C", // teal-700
  2: "#008B8B", // teal-500
  3: "#1AC2E6", // cyan-400
  4: "#43D8F7", // cyan-300
};

function StatTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Card className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 text-text-muted">
        {icon}
        <span className="text-caption font-medium uppercase tracking-wide">{label}</span>
      </div>
      <div className="tabular text-h1 font-bold text-text">{value}</div>
    </Card>
  );
}

const totalTokensM = (usageStats.totalTokens / 1_000_000).toFixed(2);
const localPct = Math.round(
  (usageStats.localTokens / (usageStats.localTokens + usageStats.cloudTokens)) * 100
);
const cloudPct = 100 - localPct;

export function UsageDashboard() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <div>
        <h2 className="text-h2 text-text">Usage</h2>
        <p className="text-small text-text-secondary">
          Your coding-agent activity across local and cloud models.
        </p>
      </div>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatTile
          icon={<Activity size={15} />}
          label="Sessions"
          value={formatNumber(usageStats.sessions)}
        />
        <StatTile
          icon={<MessageSquare size={15} />}
          label="Messages"
          value={formatNumber(usageStats.messages)}
        />
        <StatTile
          icon={<Coins size={15} />}
          label="Total tokens"
          value={`${totalTokensM}M`}
        />
        <StatTile
          icon={<CalendarDays size={15} />}
          label="Active days"
          value={formatNumber(usageStats.activeDays)}
        />
      </div>

      {/* Activity heatmap */}
      <Card className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <SectionLabel>Activity (last 18 weeks)</SectionLabel>
          <div className="flex items-center gap-1.5 text-caption text-text-muted">
            <span>Less</span>
            <span className="h-2.5 w-2.5 rounded-sm bg-bg-subtle" />
            {[1, 2, 3, 4].map((lvl) => (
              <span
                key={lvl}
                className="h-2.5 w-2.5 rounded-sm"
                style={{ backgroundColor: HEAT_RAMP[lvl] }}
              />
            ))}
            <span>More</span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          {heatmap.map((row, r) => (
            <div key={r} className="flex gap-1">
              {row.map((intensity, c) => (
                <div
                  key={c}
                  title={`Intensity ${intensity}`}
                  className={cn(
                    "h-3.5 w-3.5 rounded-sm",
                    intensity === 0 && "bg-bg-subtle"
                  )}
                  style={
                    intensity > 0
                      ? { backgroundColor: HEAT_RAMP[intensity] }
                      : undefined
                  }
                />
              ))}
            </div>
          ))}
        </div>

        {/* Streak + peak chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Pill className="bg-bg-subtle text-text-secondary">
            <Flame size={12} className="text-warning" />
            Current streak{" "}
            <span className="tabular font-mono text-text">{usageStats.currentStreak}d</span>
          </Pill>
          <Pill className="bg-bg-subtle text-text-secondary">
            <Flame size={12} className="text-accent" />
            Longest streak{" "}
            <span className="tabular font-mono text-text">{usageStats.longestStreak}d</span>
          </Pill>
          <Pill className="bg-bg-subtle text-text-secondary">
            <Clock size={12} className="text-text-muted" />
            Peak hour <span className="font-mono text-text">{usageStats.peakHour}</span>
          </Pill>
        </div>
      </Card>

      {/* Models + token split */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card className="flex flex-col gap-3 p-5">
          <SectionLabel>Favorite models</SectionLabel>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--success)" }}
                />
                <span className="text-small text-text-secondary">Local</span>
              </span>
              <span className="font-mono text-small text-text">{usageStats.favoriteLocal}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: "var(--info)" }}
                />
                <span className="text-small text-text-secondary">Cloud</span>
              </span>
              <span className="font-mono text-small text-text">{usageStats.favoriteCloud}</span>
            </div>
          </div>
        </Card>

        <Card className="flex flex-col gap-3 p-5">
          <SectionLabel>Local vs cloud tokens</SectionLabel>
          <ProgressBar value={localPct} color="var(--success)" />
          <div className="flex items-center justify-between text-small">
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--success)" }} />
              Local{" "}
              <span className="tabular font-mono text-text">
                {(usageStats.localTokens / 1_000_000).toFixed(1)}M
              </span>
              <span className="tabular text-text-muted">({localPct}%)</span>
            </span>
            <span className="flex items-center gap-1.5 text-text-secondary">
              <span className="h-2 w-2 rounded-full" style={{ background: "var(--info)" }} />
              Cloud{" "}
              <span className="tabular font-mono text-text">
                {(usageStats.cloudTokens / 1_000_000).toFixed(1)}M
              </span>
              <span className="tabular text-text-muted">({cloudPct}%)</span>
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
