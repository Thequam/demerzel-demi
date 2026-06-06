import { useState } from "react";
import type { CanvasDoc } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Card, IconButton, Badge, SegmentedControl } from "@/components/ui";
import { relativeTime } from "@/lib/utils";
import { Globe, FileText, Code2, Shapes, Workflow, Copy, Download, ExternalLink } from "lucide-react";

const LIVE_CYAN = "#43D8F7";

type CanvasType = CanvasDoc["type"];

const typeIcon: Record<CanvasType, React.ReactNode> = {
  html: <Globe size={16} />,
  markdown: <FileText size={16} />,
  code: <Code2 size={16} />,
  svg: <Shapes size={16} />,
  mermaid: <Workflow size={16} />,
};

const typeColor: Record<CanvasType, string> = {
  html: "var(--brand-teal)",
  markdown: "var(--text-secondary)",
  code: "var(--success)",
  svg: "var(--warning)",
  mermaid: LIVE_CYAN,
};

const typeLabel: Record<CanvasType, string> = {
  html: "HTML",
  markdown: "MD",
  code: "CODE",
  svg: "SVG",
  mermaid: "MERMAID",
};

type Filter = "all" | CanvasType;

function CanvasCard({ doc, onOpen }: { doc: CanvasDoc; onOpen: () => void }) {
  return (
    <Card className="flex flex-col gap-3 p-4 transition-colors duration-200 ease-enter hover:border-border-strong animate-fade-in">
      <button onClick={onOpen} className="flex items-start gap-3 text-left">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg-subtle"
          style={{ color: typeColor[doc.type] }}
          aria-hidden
        >
          {typeIcon[doc.type]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-body font-medium text-text">{doc.title}</div>
          <div className="flex items-center gap-2 text-caption text-text-muted">
            <Badge>{typeLabel[doc.type]}</Badge>
            <span className="font-mono tabular">v{doc.version}</span>
            <span>·</span>
            <span>{relativeTime(doc.updatedAt)}</span>
          </div>
        </div>
        {doc.live && (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-caption font-medium text-text">
            <span
              className="h-2 w-2 rounded-full animate-live-pulse"
              style={{ background: LIVE_CYAN }}
              aria-hidden
            />
            live
          </span>
        )}
      </button>

      <div className="flex items-center gap-1 border-t border-border pt-2">
        <IconButton aria-label="Open canvas" title="Open" onClick={onOpen}>
          <ExternalLink size={15} />
        </IconButton>
        <IconButton
          aria-label="Copy canvas"
          title="Copy"
          onClick={() => navigator.clipboard?.writeText(doc.content)}
        >
          <Copy size={15} />
        </IconButton>
        <IconButton aria-label="Download canvas" title="Download">
          <Download size={15} />
        </IconButton>
      </div>
    </Card>
  );
}

export function CanvasView() {
  const [filter, setFilter] = useState<Filter>("all");
  const canvasDocs = useAppStore((s) => s.canvasDocs);
  const setActiveCanvas = useAppStore((s) => s.setActiveCanvas);
  const setView = useAppStore((s) => s.setView);

  const filtered = filter === "all" ? canvasDocs : canvasDocs.filter((a) => a.type === filter);

  const open = (id: string) => {
    setActiveCanvas(id);
    setView("chat");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="mb-4">
          <h1 className="text-h2 text-text">Canvas</h1>
          <p className="text-small text-text-secondary">
            Generated HTML, docs, code, and diagrams. Open one to preview it in the canvas panel.
          </p>
        </div>
        <SegmentedControl<Filter>
          size="sm"
          value={filter}
          onChange={setFilter}
          options={[
            { value: "all", label: "All" },
            { value: "html", label: "HTML" },
            { value: "markdown", label: "MD" },
            { value: "code", label: "Code" },
            { value: "svg", label: "SVG" },
            { value: "mermaid", label: "Mermaid" },
          ]}
        />
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <CanvasCard key={a.id} doc={a} onOpen={() => open(a.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}
