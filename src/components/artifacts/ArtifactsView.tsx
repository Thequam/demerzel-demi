import { useState } from "react";
import type { Artifact } from "@/types";
import { sampleArtifact } from "@/data/mock";
import { Card, IconButton, Badge, SegmentedControl } from "@/components/ui";
import { relativeTime } from "@/lib/utils";
import { Globe, FileText, Code2, Shapes, Workflow, Copy, Download, ExternalLink } from "lucide-react";

const LIVE_CYAN = "#43D8F7";

const ago = (mins: number) => new Date(Date.now() - mins * 60000);

const extraArtifacts: Artifact[] = [
  {
    id: "art-2",
    title: "Getting Started Guide",
    type: "markdown",
    version: 2,
    updatedAt: ago(35),
    content: "# Getting Started\n\nRun any Ollama model in a first-class agent harness.",
  },
  {
    id: "art-3",
    title: "useDebounce hook",
    type: "code",
    version: 1,
    updatedAt: ago(120),
    content: "export function useDebounce<T>(value: T, ms: number) { /* … */ }",
  },
  {
    id: "art-4",
    title: "Orbit Logo Mark",
    type: "svg",
    version: 4,
    updatedAt: ago(540),
    content: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="20"/></svg>',
  },
  {
    id: "art-5",
    title: "Agent Loop Flow",
    type: "mermaid",
    version: 1,
    live: true,
    updatedAt: ago(4),
    content: "flowchart LR\n  A[Prompt] --> B[Tool call] --> C[Result]",
  },
];

const allArtifacts: Artifact[] = [sampleArtifact, ...extraArtifacts];

type ArtType = Artifact["type"];

const typeIcon: Record<ArtType, React.ReactNode> = {
  html: <Globe size={16} />,
  markdown: <FileText size={16} />,
  code: <Code2 size={16} />,
  svg: <Shapes size={16} />,
  mermaid: <Workflow size={16} />,
};

const typeColor: Record<ArtType, string> = {
  html: "var(--info)",
  markdown: "var(--text-secondary)",
  code: "var(--success)",
  svg: "var(--warning)",
  mermaid: LIVE_CYAN,
};

const typeLabel: Record<ArtType, string> = {
  html: "HTML",
  markdown: "MD",
  code: "CODE",
  svg: "SVG",
  mermaid: "MERMAID",
};

type Filter = "all" | ArtType;

function ArtifactCard({ artifact }: { artifact: Artifact }) {
  return (
    <Card className="flex flex-col gap-3 p-4 transition-colors duration-200 ease-enter hover:border-border-strong animate-fade-in">
      <div className="flex items-start gap-3">
        <div
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-bg-subtle"
          style={{ color: typeColor[artifact.type] }}
          aria-hidden
        >
          {typeIcon[artifact.type]}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-body font-medium text-text">{artifact.title}</div>
          <div className="flex items-center gap-2 text-caption text-text-muted">
            <Badge>{typeLabel[artifact.type]}</Badge>
            <span className="font-mono tabular">v{artifact.version}</span>
            <span>·</span>
            <span>{relativeTime(artifact.updatedAt)}</span>
          </div>
        </div>
        {artifact.live && (
          <span className="inline-flex shrink-0 items-center gap-1.5 text-caption font-medium text-text">
            <span
              className="h-2 w-2 rounded-full animate-live-pulse"
              style={{ background: LIVE_CYAN }}
              aria-hidden
            />
            live
          </span>
        )}
      </div>

      <div className="flex items-center gap-1 border-t border-border pt-2">
        <IconButton aria-label="Copy artifact" title="Copy">
          <Copy size={15} />
        </IconButton>
        <IconButton aria-label="Download artifact" title="Download">
          <Download size={15} />
        </IconButton>
        <IconButton aria-label="Open artifact" title="Open">
          <ExternalLink size={15} />
        </IconButton>
      </div>
    </Card>
  );
}

export function ArtifactsView() {
  const [filter, setFilter] = useState<Filter>("all");

  const filtered =
    filter === "all" ? allArtifacts : allArtifacts.filter((a) => a.type === filter);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="border-b border-border px-6 py-4">
        <div className="mb-4">
          <h1 className="text-h2 text-text">Artifacts</h1>
          <p className="text-small text-text-secondary">
            Generated HTML, docs, code, and diagrams. Preview, copy, download, or open in your browser.
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
            <ArtifactCard key={a.id} artifact={a} />
          ))}
        </div>
      </div>
    </div>
  );
}
