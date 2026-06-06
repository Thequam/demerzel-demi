import { cn, relativeTime } from "@/lib/utils";
import type { ScheduledTask, TaskRun } from "@/types";
import { Button, Card, SectionLabel } from "@/components/ui";
import { Toggle } from "./TaskCard";
import { AlertTriangle, Play, XCircle } from "lucide-react";

function formatDuration(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return seconds === 0 ? `${minutes}m` : `${minutes}m ${seconds}s`;
}

/* ---------------- Run status glyph ---------------- */
function RunGlyph({ status }: { status: TaskRun["status"] }) {
  if (status === "warn") {
    return <AlertTriangle size={14} style={{ color: "var(--warning)" }} aria-hidden />;
  }
  if (status === "fail") {
    return <XCircle size={14} style={{ color: "var(--error)" }} aria-hidden />;
  }
  const color = status === "running" ? "var(--info)" : "var(--success)";
  return (
    <span
      className={cn("h-2.5 w-2.5 rounded-full", status === "running" && "animate-live-pulse")}
      style={{ background: color }}
      aria-hidden
    />
  );
}

const statusLabel: Record<TaskRun["status"], string> = {
  success: "Success",
  warn: "Warning",
  fail: "Failed",
  running: "Running",
};

/* ---------------- RunHistory ---------------- */
export function RunHistory({
  task,
  onToggleKeepAwake,
  onRunNow,
}: {
  task: ScheduledTask;
  onToggleKeepAwake: (next: boolean) => void;
  onRunNow: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-col gap-5">
      {/* Header */}
      <div>
        <h2 className="text-h2 text-text">{task.name}</h2>
        <div className="mt-1 font-mono tabular text-small text-text-secondary">{task.schedule}</div>
      </div>

      {/* Instructions */}
      <section>
        <SectionLabel>Instructions</SectionLabel>
        <Card className="mt-2 p-4">
          <p className="text-body text-text-secondary">{task.instructions}</p>
        </Card>
      </section>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4 rounded-md border border-border bg-bg-subtle p-3">
        <div className="flex items-center gap-2.5">
          <Toggle
            checked={task.keepAwake}
            onChange={onToggleKeepAwake}
            label="Keep awake"
          />
          <div>
            <div className="text-small font-medium text-text">Keep awake</div>
            <div className="text-caption text-text-muted">Run while the machine is awake</div>
          </div>
        </div>
        <Button variant="primary" size="md" onClick={onRunNow}>
          <Play size={15} />
          Run now
        </Button>
      </div>

      {/* History */}
      <section className="flex min-h-0 flex-1 flex-col">
        <SectionLabel>History</SectionLabel>
        <ul className="mt-2 space-y-2 overflow-y-auto">
          {task.runs.map((run) => (
            <li key={run.id}>
              <Card className="flex items-start gap-3 p-3 animate-fade-in">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center">
                  <RunGlyph status={run.status} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-small font-medium text-text">
                      {statusLabel[run.status]}
                    </span>
                    <span className="shrink-0 font-mono tabular text-caption text-text-muted">
                      {relativeTime(run.startedAt)} · {formatDuration(run.durationMs)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-small text-text-secondary">{run.summary}</p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
