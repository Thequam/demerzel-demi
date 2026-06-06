import { useState } from "react";
import type { FileNode } from "@/types";
import { fileTree } from "@/data/mock";
import { Badge, Button, Card, Pill, SectionLabel, SegmentedControl } from "@/components/ui";
import { FileTree } from "./FileTree";
import { EditorPane } from "./EditorPane";
import { TerminalPane } from "./TerminalPane";
import { UsageDashboard } from "./UsageDashboard";
import {
  Sparkles,
  Bot,
  ArrowUp,
  Repeat2,
  GitPullRequestArrow,
  TestTube2,
  FileSearch,
} from "lucide-react";

type CodeTab = "workspace" | "usage";

const DEFAULT_FILE = "demi-site/src/components/Hero.tsx";

function findByPath(nodes: FileNode[], path: string): FileNode | undefined {
  for (const node of nodes) {
    if (node.path === path) return node;
    if (node.children) {
      const found = findByPath(node.children, path);
      if (found) return found;
    }
  }
  return undefined;
}

const routines = [
  { icon: <GitPullRequestArrow size={13} />, label: "Open PR from changes" },
  { icon: <TestTube2 size={13} />, label: "Run test suite" },
  { icon: <FileSearch size={13} />, label: "Review & explain file" },
];

const agentMessages = [
  {
    id: "a1",
    role: "user" as const,
    text: "Add a pricing tiers section under the Hero and wire the CTA to it.",
  },
  {
    id: "a2",
    role: "assistant" as const,
    text: "Edited Hero.tsx to add a scroll-linked CTA and created Pricing.tsx with three tiers. Ran the dev server — it compiles cleanly.",
    edits: ["Hero.tsx", "Pricing.tsx"],
  },
  {
    id: "a3",
    role: "assistant" as const,
    text: "Tip: I can extract the tier data into a typed constant if you want to reuse it on the docs page.",
  },
];

export function CodeView() {
  const [tab, setTab] = useState<CodeTab>("workspace");
  const [selectedPath, setSelectedPath] = useState<string>(DEFAULT_FILE);

  const selected = findByPath(fileTree, selectedPath);
  const fileName = selected?.name ?? "untitled";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Top bar: toggle + routines */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
        <SegmentedControl<CodeTab>
          value={tab}
          onChange={setTab}
          options={[
            { value: "workspace", label: "Workspace" },
            { value: "usage", label: "Usage" },
          ]}
        />
        <div className="flex items-center gap-2">
          <SectionLabel className="hidden sm:block">Routines</SectionLabel>
          <div className="flex flex-wrap items-center gap-1.5">
            {routines.map((r) => (
              <button
                key={r.label}
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-bg-subtle px-2.5 py-1 text-caption font-medium text-text-secondary transition-colors hover:bg-surface hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
              >
                <Repeat2 size={12} className="text-text-muted" />
                <span className="flex items-center gap-1">
                  {r.icon}
                  {r.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === "usage" ? (
        <div className="min-h-0 flex-1 overflow-y-auto bg-bg">
          <UsageDashboard />
        </div>
      ) : (
        <div className="flex min-h-0 flex-1">
          {/* Left: file tree */}
          <aside className="flex w-60 shrink-0 flex-col overflow-y-auto border-r border-border bg-surface">
            <div className="px-3 py-2">
              <SectionLabel>Explorer</SectionLabel>
            </div>
            <FileTree
              nodes={fileTree}
              activePath={selectedPath}
              onSelect={(n) => setSelectedPath(n.path)}
            />
          </aside>

          {/* Center: editor + terminal */}
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-hidden">
              <EditorPane fileName={fileName} />
            </div>
            <div className="h-56 shrink-0 border-t border-border">
              <TerminalPane />
            </div>
          </div>

          {/* Right: agent panel */}
          <aside className="flex w-80 shrink-0 flex-col border-l border-border bg-surface">
            <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-gradient text-white">
                <Bot size={14} />
              </span>
              <span className="text-small font-semibold text-text">Coding agent</span>
              <Badge className="ml-auto" dotColor="var(--success)">
                qwen3-coder-next
              </Badge>
            </div>

            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
              {agentMessages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-lg bg-gun-100 px-3 py-2 text-small text-text dark:bg-gun-700">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex flex-col gap-2">
                    <div className="text-small leading-relaxed text-text">{m.text}</div>
                    {m.edits && (
                      <div className="flex flex-wrap gap-1.5">
                        {m.edits.map((f) => (
                          <Badge key={f}>
                            <Sparkles size={10} className="text-primary" />
                            {f}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Composer */}
            <div className="shrink-0 border-t border-border p-3">
              <Card raised className="flex items-end gap-2 p-2">
                <label htmlFor="agent-task" className="sr-only">
                  Describe a coding task
                </label>
                <textarea
                  id="agent-task"
                  rows={2}
                  placeholder="Describe a coding task…"
                  className="min-h-0 flex-1 resize-none bg-transparent text-small text-text placeholder:text-text-muted focus:outline-none"
                />
                <Button
                  size="sm"
                  aria-label="Send coding task"
                  className="h-8 w-8 shrink-0 p-0"
                >
                  <ArrowUp size={15} />
                </Button>
              </Card>
              <div className="mt-2 flex items-center gap-1.5">
                <Pill className="bg-bg-subtle text-text-muted">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--success)" }} />
                  ~/code/demi-site
                </Pill>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
