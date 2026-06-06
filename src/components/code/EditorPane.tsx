import { sampleCode } from "@/data/mock";
import { cn } from "@/lib/utils";
import { FileCode2, X, Circle } from "lucide-react";

export function EditorPane({ fileName }: { fileName: string }) {
  const lines = sampleCode.replace(/\n$/, "").split("\n");

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-surface">
      {/* Tab bar */}
      <div className="flex shrink-0 items-stretch border-b border-border bg-bg-subtle">
        <div className="flex items-center gap-2 border-r border-border bg-surface px-3 py-2">
          <FileCode2 size={14} className="text-primary" />
          <span className="font-mono text-small text-text">{fileName}</span>
          <Circle size={7} className="ml-1 fill-text-muted text-text-muted" aria-label="unsaved changes" />
          <button
            type="button"
            aria-label={`Close ${fileName}`}
            className={cn(
              "ml-1 flex h-4 w-4 items-center justify-center rounded-sm text-text-muted transition-colors",
              "hover:bg-bg-subtle hover:text-text",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
            )}
          >
            <X size={12} />
          </button>
        </div>
      </div>

      {/* Code area */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="flex min-w-full font-mono text-[13px] leading-[1.6]">
          {/* Gutter */}
          <div
            aria-hidden="true"
            className="select-none border-r border-border bg-surface px-3 py-3 text-right tabular text-text-muted"
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          {/* Content */}
          <pre className="flex-1 overflow-x-auto px-4 py-3 text-text">
            <code>
              {lines.map((line, i) => (
                <div key={i} className="whitespace-pre">
                  {line.length === 0 ? "\u00A0" : line}
                </div>
              ))}
            </code>
          </pre>
        </div>
      </div>
    </div>
  );
}
