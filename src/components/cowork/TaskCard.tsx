import { cn } from "@/lib/utils";
import type { ScheduledTask } from "@/types";
import { Card, Pill, StatusDot } from "@/components/ui";
import { CalendarClock } from "lucide-react";

/* ---------------- Toggle (shared custom switch) ---------------- */
export function Toggle({
  checked,
  onChange,
  label,
  className,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-pressed={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200 ease-enter",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        checked ? "bg-primary" : "bg-border-strong",
        className
      )}
    >
      <span
        className={cn(
          "inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-enter",
          checked ? "translate-x-[18px]" : "translate-x-[3px]"
        )}
      />
    </button>
  );
}

/* ---------------- TaskCard ---------------- */
export function TaskCard({
  task,
  selected,
  onSelect,
  onToggleActive,
}: {
  task: ScheduledTask;
  selected: boolean;
  onSelect: () => void;
  onToggleActive: (next: boolean) => void;
}) {
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
        <Toggle
          checked={task.active}
          onChange={onToggleActive}
          label={`Toggle ${task.name} active`}
        />
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
