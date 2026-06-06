import { cn } from "@/lib/utils";
import type { ScheduledTask } from "@/types";
import { Card, Pill, StatusDot, Toggle } from "@/components/ui";
import { useAppStore } from "@/store/useAppStore";
import { CalendarClock } from "lucide-react";

/* ---------------- TaskCard ---------------- */
export function TaskCard({
  task,
  selected,
  onSelect,
}: {
  task: ScheduledTask;
  selected: boolean;
  onSelect: () => void;
}) {
  const toggleTaskActive = useAppStore((s) => s.toggleTaskActive);
  const runCount = task.runs.length;

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "cursor-pointer p-3.5 transition-colors duration-200 ease-enter animate-fade-in",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
        selected
          ? "border-border-strong bg-bg-subtle ring-1 ring-primary"
          : "hover:border-border-strong hover:bg-bg-subtle"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-body font-medium text-text">{task.name}</div>
          <div className="mt-2">
            <Pill className="bg-turq-50 text-turq-700 dark:bg-turq-900/40 dark:text-turq-300">
              <CalendarClock size={12} />
              <span className="font-mono tabular">{task.schedule}</span>
            </Pill>
          </div>
        </div>
        {/* Stop propagation so toggling Active does not also select the card */}
        <span
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <Toggle
            checked={task.active}
            onChange={() => toggleTaskActive(task.id)}
            label={`Toggle ${task.name} active`}
          />
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <StatusDot status={task.lastStatus} withLabel />
        <span className="font-mono tabular text-caption text-text-muted">
          {runCount} {runCount === 1 ? "run" : "runs"}
        </span>
      </div>
    </Card>
  );
}
