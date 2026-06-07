import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { ModelCard } from "./ModelCard";
import { SegmentedControl, Pill, EmptyState, Button } from "@/components/ui";
import { pullCatalog } from "@/data/catalog";
import { Search, Cpu, PackageSearch, Download, RefreshCw, WifiOff, Loader2 } from "lucide-react";

type Filter = "all" | "local" | "cloud";

function PullBox() {
  const [tag, setTag] = useState("");
  const pullTag = useAppStore((s) => s.pullTag);
  const pulling = useAppStore((s) => s.pulling);
  const installed = useAppStore((s) => s.ollamaInstalled);

  const go = (t: string) => {
    const v = t.trim();
    if (!v) return;
    pullTag(v);
    setTag("");
  };

  const suggestions = pullCatalog
    .filter((c) => !installed.includes(c.tag) && pulling[c.tag] == null)
    .slice(0, 6);

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2">
        <Download size={15} aria-hidden className="text-primary" />
        <h2 className="text-small font-semibold text-text">Pull a model</h2>
      </div>
      <p className="mt-1 text-caption text-text-muted">
        Download any model from the Ollama library by tag — e.g.{" "}
        <span className="font-mono">gemma3:4b</span>,{" "}
        <span className="font-mono">deepseek-r1:8b</span>,{" "}
        <span className="font-mono">qwen3:8b</span>.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && go(tag)}
          placeholder="model:tag"
          aria-label="Model tag to pull"
          className="h-9 flex-1 rounded-md border border-border bg-bg-subtle px-3 font-mono text-small text-text placeholder:text-text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
        />
        <Button size="sm" onClick={() => go(tag)} disabled={!tag.trim()}>
          <Download size={14} aria-hidden /> Pull
        </Button>
      </div>
      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((c) => (
            <button
              key={c.tag}
              onClick={() => go(c.tag)}
              title={c.blurb}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-caption text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              {c.tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectionBanner() {
  const status = useAppStore((s) => s.ollamaStatus);
  if (status === "online" || status === "checking" || status === "unknown") return null;
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gold-500/30 bg-gold-500/10 p-4">
      <WifiOff size={18} className="mt-0.5 shrink-0" style={{ color: "var(--warning)" }} aria-hidden />
      <div className="text-small">
        <p className="font-medium text-text">Ollama not detected on this machine.</p>
        <p className="mt-1 text-text-secondary">
          Install Ollama and start it, then allow this browser origin so Demi can reach it. In a
          terminal:
        </p>
        <pre className="mt-2 overflow-x-auto rounded-md bg-bg-subtle p-2.5 font-mono text-caption text-text-secondary">
{`# 1. install from https://ollama.com  then:
$ ollama serve

# 2. allow the browser to call it (then restart Ollama)
#   macOS/Linux:
$ export OLLAMA_ORIGINS="*"
#   Windows (PowerShell):
> setx OLLAMA_ORIGINS "*"`}
        </pre>
        <p className="mt-2 text-text-muted">
          Until then, pulls and chat run in a simulated demo mode.
        </p>
      </div>
    </div>
  );
}

export function ModelsView() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const models = useAppStore((s) => s.models);
  const status = useAppStore((s) => s.ollamaStatus);
  const refresh = useAppStore((s) => s.refreshOllama);

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
          <div className="flex items-center gap-2">
            <Pill className="border border-border bg-bg-subtle text-text-secondary">
              <Cpu size={13} aria-hidden />
              <span className="font-mono tabular">Detected: 24 GB VRAM · 64 GB RAM</span>
            </Pill>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void refresh()}
              title="Re-check Ollama connection and installed models"
            >
              {status === "checking" ? (
                <Loader2 size={14} aria-hidden className="animate-spin" />
              ) : (
                <RefreshCw size={14} aria-hidden />
              )}
              Refresh
            </Button>
          </div>
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
        <div className="mb-5 flex flex-col gap-4">
          <ConnectionBanner />
          {filter !== "cloud" && <PullBox />}
        </div>
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
