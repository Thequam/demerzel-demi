import type { Model } from "@/types";
import { Card, Badge, Button, CapabilityBadges, ProgressBar } from "@/components/ui";
import { cn, formatBytes } from "@/lib/utils";
import { Check, Download, AlertTriangle, ArrowUpCircle } from "lucide-react";

const LIVE_CYAN = "#43D8F7";

export interface PullState {
  percent: number;
  caption: string;
  layer: string;
}

function Dot() {
  return <span className="text-text-muted">·</span>;
}

function Affordance({ model }: { model: Model }) {
  switch (model.installState) {
    case "available":
      return (
        <Button size="sm">
          <Download size={14} />
          Pull
        </Button>
      );
    case "installed":
      return (
        <span
          className="inline-flex items-center gap-1.5 text-small font-medium"
          style={{ color: "var(--success)" }}
        >
          <Check size={15} />
          Installed
        </span>
      );
    case "loaded":
      return (
        <div className="inline-flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-small font-medium text-text">
            <span
              className="h-2 w-2 rounded-full animate-live-pulse"
              style={{ background: LIVE_CYAN }}
              aria-hidden
            />
            Loaded
          </span>
          <Button variant="ghost" size="sm">
            Unload
          </Button>
        </div>
      );
    case "update":
      return (
        <Button variant="accent" size="sm">
          <ArrowUpCircle size={14} />
          Update available
        </Button>
      );
  }
}

export function ModelCard({
  model,
  pull,
  className,
}: {
  model: Model;
  pull?: PullState;
  className?: string;
}) {
  const isCloud = model.kind === "cloud";
  const pulling = pull !== undefined;

  return (
    <Card className={cn("flex flex-col gap-3 p-4 animate-fade-in", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate font-mono text-body font-medium text-text">{model.name}</div>
          <div className="text-caption text-text-muted">{model.provider}</div>
        </div>
        {!pulling && (
          <div className="shrink-0">
            <Affordance model={model} />
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

      {pull && (
        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-caption">
            <span className="inline-flex items-center gap-1.5 font-medium text-text">
              <span
                className="h-2 w-2 rounded-full animate-live-pulse"
                style={{ background: LIVE_CYAN }}
                aria-hidden
              />
              Pulling
            </span>
            <span className="font-mono tabular text-text-secondary">{pull.percent}%</span>
          </div>
          <ProgressBar value={pull.percent} color={LIVE_CYAN} />
          <div className="font-mono tabular text-caption text-text-muted">{pull.caption}</div>
          <div className="font-mono text-caption text-text-muted">{pull.layer}</div>
        </div>
      )}
    </Card>
  );
}
