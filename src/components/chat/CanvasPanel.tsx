import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { cn, relativeTime } from "@/lib/utils";
import { Badge, EmptyState } from "@/components/ui";
import { Code2, Eye, Copy, Download, ExternalLink, X, History, LayoutPanelLeft } from "lucide-react";

export function CanvasPanel() {
  const toggleCanvasPanel = useAppStore((s) => s.toggleCanvasPanel);
  const canvasDocs = useAppStore((s) => s.canvasDocs);
  const activeCanvasId = useAppStore((s) => s.activeCanvasId);
  const [tab, setTab] = useState<"preview" | "source">("preview");

  const a = canvasDocs.find((d) => d.id === activeCanvasId) ?? canvasDocs[0];

  if (!a) {
    return (
      <aside className="flex w-[440px] shrink-0 flex-col border-l border-border bg-surface">
        <EmptyState
          icon={<LayoutPanelLeft size={28} />}
          title="No canvas yet"
          description="Ask Demi to build something — a dashboard, page, or component — and it will render here."
        />
      </aside>
    );
  }

  return (
    <aside className="flex w-[440px] shrink-0 flex-col border-l border-border bg-surface animate-fade-in">
      {/* Gradient header */}
      <div className="flex items-center gap-2 bg-brand-gradient-teal px-4 py-3 text-white">
        <div className="min-w-0 flex-1">
          <div className="truncate text-small font-semibold">{a.title}</div>
          <div className="flex items-center gap-2 text-caption text-white/85">
            <span className="rounded-sm bg-white/20 px-1.5 font-mono uppercase">{a.type}</span>
            <span>v{a.version}</span>
            {a.live && (
              <span className="inline-flex items-center gap-1">
                <span className="h-1.5 w-1.5 animate-live-pulse rounded-full bg-white" /> live
              </span>
            )}
          </div>
        </div>
        <button
          onClick={() => toggleCanvasPanel(false)}
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/90 transition-colors hover:bg-white/20"
          aria-label="Close canvas panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border px-3 py-2">
        <div className="inline-flex rounded-md border border-border bg-bg-subtle p-0.5">
          <ToolbarTab active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye size={14} />}>
            Preview
          </ToolbarTab>
          <ToolbarTab active={tab === "source"} onClick={() => setTab("source")} icon={<Code2 size={14} />}>
            Source
          </ToolbarTab>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <ToolIcon icon={<History size={15} />} label="Versions" />
          <ToolIcon icon={<Copy size={15} />} label="Copy" onClick={() => navigator.clipboard?.writeText(a.content)} />
          <ToolIcon icon={<Download size={15} />} label="Download" />
          <ToolIcon icon={<ExternalLink size={15} />} label="Open in browser" />
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-auto bg-bg-subtle">
        {tab === "preview" ? (
          a.type === "html" ? (
            <iframe
              title={a.title}
              srcDoc={a.content}
              className="h-full w-full border-0 bg-white"
              sandbox="allow-scripts"
            />
          ) : (
            <pre className="overflow-auto whitespace-pre-wrap p-4 font-mono text-small leading-relaxed text-text-secondary">
              <code>{a.content}</code>
            </pre>
          )
        ) : (
          <pre className="overflow-auto p-4 font-mono text-small leading-relaxed text-text-secondary">
            <code>{a.content}</code>
          </pre>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <Badge dotColor="var(--success)">Auto-saved to project</Badge>
        <span className="text-caption text-text-muted">Updated {relativeTime(a.updatedAt)}</span>
      </div>
    </aside>
  );
}

function ToolbarTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-[7px] px-2.5 py-1 text-caption font-medium transition-colors",
        active ? "bg-surface text-text shadow-sm" : "text-text-muted hover:text-text"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function ToolIcon({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-subtle hover:text-text"
    >
      {icon}
    </button>
  );
}
