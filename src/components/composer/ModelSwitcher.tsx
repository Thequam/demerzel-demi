import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { models } from "@/data/mock";
import { cn } from "@/lib/utils";
import { CapabilityBadges } from "@/components/ui";
import { Search, Check, Download, CircleDot, AlertTriangle, ChevronDown } from "lucide-react";

export function ModelSwitcher() {
  const { activeModelId, setModel, effort, setEffort, modelSwitcherOpen, toggleModelSwitcher } =
    useAppStore();
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const active = models.find((m) => m.id === activeModelId)!;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) toggleModelSwitcher(false);
    }
    if (modelSwitcherOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [modelSwitcherOpen, toggleModelSwitcher]);

  const filtered = models.filter((m) =>
    (m.name + m.provider).toLowerCase().includes(query.toLowerCase())
  );
  const local = filtered.filter((m) => m.kind === "local");
  const cloud = filtered.filter((m) => m.kind === "cloud");

  return (
    <div className="relative" ref={ref}>
      {/* The chip */}
      <button
        onClick={() => toggleModelSwitcher()}
        className={cn(
          "group inline-flex items-center gap-2 rounded-full border border-border-strong bg-surface px-3 py-1.5 transition-all duration-200",
          modelSwitcherOpen && "shadow-glow"
        )}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{ background: active.kind === "local" ? "var(--success)" : "var(--info)" }}
        />
        <span className="font-mono text-small font-medium text-text">{active.name}</span>
        <span className="rounded-full bg-bg-subtle px-1.5 py-0.5 text-caption text-text-secondary">
          {effort}
        </span>
        <ChevronDown size={14} className="text-text-muted" />
      </button>

      {/* Popover */}
      {modelSwitcherOpen && (
        <div className="absolute bottom-full right-0 z-40 mb-2 w-[380px] animate-fade-in rounded-lg border border-border bg-surface-raised shadow-lg">
          {/* Search */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <Search size={15} className="text-text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models…"
              className="w-full bg-transparent text-body text-text outline-none placeholder:text-text-muted"
            />
          </div>

          {/* Effort */}
          <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
            <span className="text-caption font-semibold uppercase tracking-wide text-text-muted">
              Reasoning effort
            </span>
            <div className="ml-auto inline-flex rounded-md border border-border bg-bg-subtle p-0.5">
              {(["Low", "Medium", "High"] as const).map((e) => (
                <button
                  key={e}
                  onClick={() => setEffort(e)}
                  className={cn(
                    "rounded-[7px] px-2.5 py-1 text-caption font-medium transition-colors",
                    effort === e ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
                  )}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[340px] overflow-y-auto p-2">
            <Group label="Local" dot="var(--success)" models={local} active={activeModelId} onPick={setModel} />
            <Group label="Cloud" dot="var(--info)" models={cloud} active={activeModelId} onPick={setModel} />
          </div>
        </div>
      )}
    </div>
  );
}

function Group({
  label,
  dot,
  models: list,
  active,
  onPick,
}: {
  label: string;
  dot: string;
  models: typeof models;
  active: string;
  onPick: (id: string) => void;
}) {
  if (list.length === 0) return null;
  return (
    <div className="mb-1">
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: dot }} />
        <span className="text-caption font-semibold uppercase tracking-wide text-text-muted">
          {label}
        </span>
      </div>
      {list.map((m) => {
        const isActive = m.id === active;
        const cannotFit = m.kind === "local" && m.fitsHardware === false;
        return (
          <button
            key={m.id}
            onClick={() => onPick(m.id)}
            className={cn(
              "flex w-full flex-col gap-1 rounded-md px-2 py-2 text-left transition-colors",
              isActive ? "bg-bg-subtle" : "hover:bg-bg-subtle"
            )}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-small font-medium text-text">{m.name}</span>
              <span className="text-caption text-text-muted">
                {m.params} · {m.context}
              </span>
              <span className="ml-auto flex items-center gap-2">
                {m.installState === "loaded" && (
                  <CircleDot size={13} className="animate-live-pulse text-cyan-500" />
                )}
                {m.installState === "available" && m.kind === "local" && (
                  <span className="inline-flex items-center gap-1 text-caption text-primary">
                    <Download size={12} /> Pull
                  </span>
                )}
                {isActive && <Check size={15} className="text-primary" />}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <CapabilityBadges caps={m.capabilities} />
              {cannotFit && (
                <span className="inline-flex items-center gap-1 text-caption text-warning">
                  <AlertTriangle size={11} /> ~{m.estVramGb}GB VRAM
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
