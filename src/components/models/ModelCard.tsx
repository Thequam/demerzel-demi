import type { Model } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Card, Badge, Button, CapabilityBadges, ProgressBar } from "@/components/ui";
import { cn, formatBytes } from "@/lib/utils";
import { Check, Download, AlertTriangle, ArrowUpCircle, Trash2 } from "lucide-react";

const LIVE_CYAN = "#43D8F7";

/** Rough, simulated download ETA derived from remaining percent and model size. */
function formatEta(sizeBytes: number, pct: number): string {
  // Nominal ~220 MB/s, clamped so tiny/huge models still read sensibly.
  const totalSec = Math.max(6, sizeBytes / (220 * 1024 * 1024));
  const remainingSec = (totalSec * (100 - pct)) / 100;
  if (remainingSec < 60) return `~${Math.max(1, Math.round(remainingSec))}s left`;
  return `~${Math.round(remainingSec / 60)}m left`;
}

function Dot() {
  return <span className="text-text-muted">·</span>;
}

export function ModelCard({
  model,
  className,
}: {
  model: Model;
  className?: string;
}) {
  const pct = useAppStore((s) => s.pulling[model.id]);
  const pullModel = useAppStore((s) => s.pullModel);
  const setModelLoaded = useAppStore((s) => s.setModelLoaded);
  const deleteModel = useAppStore((s) => s.deleteModel);

  const isCloud = model.kind === "cloud";
  const isPulling = pct != null;

  return (
    <Card className={cn("flex flex-col gap-3 p-4 animate-fade-in", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-mono text-body font-medium text-text">{model.name}</div>
          <div className="text-caption text-text-muted">{model.provider}</div>
        </div>

        {/* Header affordance — reflects live install state. */}
        {!isCloud && !isPulling && (
          <div className="shrink-0">
            {model.installState === "available" && (
              <Button size="sm" onClick={() => pullModel(model.id)}>
                <Download size={14} aria-hidden />
                Pull
              </Button>
            )}
            {model.installState === "update" && (
              <Button variant="accent" size="sm" onClick={() => pullModel(model.id)}>
                <ArrowUpCircle size={14} aria-hidden />
                Update available
              </Button>
            )}
            {model.installState === "installed" && (
              <span
                className="inline-flex items-center gap-1.5 text-small font-medium"
                style={{ color: "var(--success)" }}
              >
                <Check size={15} aria-hidden />
                Installed
              </span>
            )}
            {model.installState === "loaded" && (
              <span className="inline-flex items-center gap-1.5 text-small font-medium text-text">
                <span
                  className="h-2 w-2 rounded-full animate-live-pulse"
                  style={{ background: LIVE_CYAN }}
                  aria-hidden
                />
                Loaded
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-small text-text-secondary">
        <span className="font-mono tabular">{model.params}</span>
        <Dot />
        <span className="font-mono tabular">{model.context} ctx</span>
        <Dot />
        {isCloud ? (
          <Badge dotColor="var(--info)">Cloud</Badge>
        ) : (
          <span className="font-mono tabular">
            {formatBytes(model.sizeBytes)}
            {model.estVramGb ? ` · ~${model.estVramGb} GB VRAM` : ""}
          </span>
        )}
      </div>

      <CapabilityBadges caps={model.capabilities} />

      {model.description && (
        <p className="text-small text-text-secondary">{model.description}</p>
      )}

      {!isCloud && model.fitsHardware === false && (
        <div
          className="flex items-center gap-2 rounded-sm bg-gold-500/10 px-2.5 py-1.5 text-caption font-medium"
          style={{ color: "var(--warning)" }}
        >
          <AlertTriangle size={13} aria-hidden />
          Exceeds detected VRAM (~{model.estVramGb} GB)
        </div>
      )}

      {/* Live pull progress (cyan), driven by store `pulling[id]`. */}
      {isPulling && (
        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-caption">
            <span className="inline-flex items-center gap-1.5 font-medium text-text">
              <span
                className="h-2 w-2 rounded-full animate-live-pulse"
                style={{ background: LIVE_CYAN }}
                aria-hidden
              />
              Pulling…
            </span>
            <span className="font-mono tabular text-text-secondary">{Math.round(pct)}%</span>
          </div>
          <ProgressBar value={pct} color={LIVE_CYAN} />
          <div className="font-mono tabular text-caption text-text-muted">
            {formatBytes((model.sizeBytes * pct) / 100)} / {formatBytes(model.sizeBytes)} ·{" "}
            {formatEta(model.sizeBytes, pct)}
          </div>
        </div>
      )}

      {/* Footer actions for installed / loaded states. */}
      {!isCloud && !isPulling && model.installState === "installed" && (
        <div className="mt-1 flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setModelLoaded(model.id, true)}>
            Load
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteModel(model.id)}
            className="text-text-muted hover:text-danger"
          >
            <Trash2 size={14} aria-hidden />
            Delete
          </Button>
        </div>
      )}

      {!isCloud && !isPulling && model.installState === "loaded" && (
        <div className="mt-1 flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setModelLoaded(model.id, false)}>
            Unload
          </Button>
        </div>
      )}
    </Card>
  );
}
