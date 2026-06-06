import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ModelCard } from "./ModelCard";
import { SegmentedControl, Pill, EmptyState } from "@/components/ui";
import { Search, Cpu, PackageSearch } from "lucide-react";

type Filter = "all" | "local" | "cloud";

export function ModelsView() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const models = useAppStore((s) => s.models);

  const loadedCount = models.filter((m) => m.installState === "loaded").length;
  const installedCount = models.filter((m) => m.installState === "installed").length;

  const q = query.trim().toLowerCase();
  const filtered = models.filter((m) => {
    if (filter === "local" && m.kind !== "local") return false;
    if (filter === "cloud" && m.kind !== "cloud") return false;
    if (q && !`${m.name} ${m.provider} ${m.id}`.toLowerCase().includes(q)) return false;
    return true;
  });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-h2 text-text">Model Manager</h1>
            <p className="text-small text-text-secondary">
              Browse, pull, and manage local Ollama models and cloud providers.
            </p>
          </div>
          <Pill className="border border-border bg-bg-subtle text-text-secondary">
            <Cpu size={13} aria-hidden />
            <span className="font-mono tabular">Detected: 24 GB VRAM · 64 GB RAM</span>
          </Pill>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search
              size={15}
              aria-hidden
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search models…"
              aria-label="Search models"
              className="h-9 w-64 rounded-md border border-border bg-surface pl-9 pr-3 text-small text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            />
          </div>
          <SegmentedControl<Filter>
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "local", label: "Local" },
              { value: "cloud", label: "Cloud" },
            ]}
          />
          <span className="ml-auto text-caption text-text-muted">
            <span className="font-mono tabular text-text-secondary">{loadedCount}</span> loaded ·{" "}
            <span className="font-mono tabular text-text-secondary">{installedCount}</span> installed
          </span>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<PackageSearch size={32} />}
            title="No models match"
            description="Try a different search term or filter."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((m) => (
              <ModelCard key={m.id} model={m} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
