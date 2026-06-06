import { useEffect, useRef, useState } from "react";
import { cn, relativeTime } from "@/lib/utils";
import type { CanvasDoc } from "@/types";
import { projects, sampleCanvas } from "@/data/mock";
import { useAppStore } from "@/store/useAppStore";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  SectionLabel,
  StatusDot,
} from "@/components/ui";
import { TaskCard } from "./TaskCard";
import { RunHistory } from "./RunHistory";
import {
  ArrowUp,
  Check,
  ChevronDown,
  FileBox,
  FolderGit2,
  Radio,
  Sparkles,
} from "lucide-react";

/* ---------------- Live canvases mock ---------------- */
const liveCanvases: CanvasDoc[] = [
  sampleCanvas,
  {
    id: "art-live-2",
    title: "Competitor Digest",
    type: "markdown",
    version: 7,
    updatedAt: new Date(Date.now() - 60 * 60000),
    live: true,
    content: "# Weekly Competitor Digest\n\nAuto-updated by the Cowork agent each Monday.",
  },
];

/* ---------------- Project selector ---------------- */
function ProjectSelector({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (id: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const selected = projects.find((p) => p.id === value);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "inline-flex h-8 items-center gap-1.5 rounded-md border border-border px-2.5 text-small text-text-secondary",
          "transition-colors duration-200 hover:bg-bg-subtle hover:text-text",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        )}
      >
        <FolderGit2 size={14} />
        <span className="max-w-[140px] truncate">
          {selected ? selected.name : "Work in a project"}
        </span>
        <ChevronDown size={14} className="text-text-muted" />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute bottom-full left-0 z-20 mb-2 w-60 animate-fade-in rounded-md border border-border bg-surface-raised p-1 shadow-md"
        >
          <button
            type="button"
            role="option"
            aria-selected={value === null}
            onClick={() => {
              onChange(null);
              setOpen(false);
            }}
            className={cn(
              "flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-left text-small",
              "transition-colors hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
              value === null ? "text-text" : "text-text-secondary"
            )}
          >
            No project
            {value === null && <Check size={14} className="text-primary" />}
          </button>
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              role="option"
              aria-selected={p.id === value}
              onClick={() => {
                onChange(p.id);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center justify-between gap-2 rounded-sm px-2.5 py-1.5 text-left text-small",
                "transition-colors hover:bg-bg-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring",
                p.id === value ? "text-text" : "text-text-secondary"
              )}
            >
              <span className="truncate">{p.name}</span>
              {p.id === value && <Check size={14} className="shrink-0 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Live canvas card ---------------- */
function LiveCanvasCard({ canvas }: { canvas: CanvasDoc }) {
  return (
    <Card className="flex items-center gap-3 p-3 transition-colors duration-200 hover:border-border-strong animate-fade-in">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-gradient text-white">
        <FileBox size={16} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-small font-medium text-text">{canvas.title}</span>
          <span className="inline-flex items-center gap-1 text-caption text-info">
            <Radio size={11} className="animate-live-pulse" />
            Live
          </span>
        </div>
        <div className="mt-0.5 flex items-center gap-2 text-caption text-text-muted">
          <Badge>v{canvas.version}</Badge>
          <span className="font-mono tabular">{relativeTime(canvas.updatedAt)}</span>
        </div>
      </div>
    </Card>
  );
}

/* ---------------- CoworkView ---------------- */
export function CoworkView() {
  const tasks = useAppStore((s) => s.tasks);
  const [selectedId, setSelectedId] = useState<string | null>(tasks[0]?.id ?? null);
  const [composerValue, setComposerValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);

  // Look the selected task up from the live store list so toggles + new runs appear immediately.
  const selectedTask = tasks.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl px-6 py-8">
          {/* Header + agentic composer */}
          <header className="mb-8">
            <h1 className="text-h1 text-text">Cowork</h1>
            <p className="mt-1 text-body text-text-secondary">
              Knock something off your list. Demi plans and executes with tools — once, or on a schedule.
            </p>

            <div className="mt-5">
              <div
                className={cn(
                  "rounded-lg border bg-surface-raised shadow-md transition-shadow duration-200",
                  focused ? "border-focus-ring shadow-glow" : "border-border"
                )}
              >
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <Sparkles size={17} className="shrink-0 text-text-muted" />
                  <input
                    value={composerValue}
                    onChange={(e) => setComposerValue(e.target.value)}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    placeholder="Knock something off your list…"
                    aria-label="Describe a task to dispatch"
                    className="min-w-0 flex-1 bg-transparent text-body text-text outline-none placeholder:text-text-muted"
                  />
                  <ProjectSelector value={projectId} onChange={setProjectId} />
                  <Button variant="primary" size="sm" disabled={!composerValue.trim()}>
                    <ArrowUp size={14} />
                    Dispatch
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
            {/* Left: scheduled tasks */}
            <div className="flex flex-col gap-3">
              <SectionLabel>Scheduled tasks</SectionLabel>
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  selected={task.id === selectedId}
                  onSelect={() => setSelectedId(task.id)}
                />
              ))}
            </div>

            {/* Right: detail panel */}
            <Card className="p-5">
              {selectedTask ? (
                <RunHistory task={selectedTask} />
              ) : (
                <EmptyState
                  icon={<Sparkles size={28} />}
                  title="No task selected"
                  description="Select a scheduled task on the left to see its instructions and run history."
                />
              )}
            </Card>
          </div>

          {/* Live canvas */}
          <section className="mt-10">
            <div className="flex items-center gap-2">
              <StatusDot status="running" />
              <SectionLabel>Live canvas</SectionLabel>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {liveCanvases.map((canvas) => (
                <LiveCanvasCard key={canvas.id} canvas={canvas} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
