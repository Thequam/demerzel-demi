import type { ChatMessage } from "@/types";
import { models, sampleArtifact } from "@/data/mock";
import { ThinkingTrace } from "./ThinkingTrace";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";
import { Copy, RotateCcw, ThumbsUp, FileCode2 } from "lucide-react";

function ModelBadge({ modelId, effort }: { modelId?: string; effort?: string }) {
  if (!modelId) return null;
  const m = models.find((x) => x.id === modelId);
  if (!m) return null;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-caption text-text-muted"
      title={`${m.provider} · ${effort ?? "Medium"} effort`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: m.kind === "local" ? "var(--success)" : "var(--info)" }}
      />
      {m.name}
      {effort && <span className="text-text-muted/70">· {effort}</span>}
    </span>
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const { toggleArtifactPanel } = useAppStore();
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end animate-fade-in">
        <div className="max-w-[80%] rounded-lg bg-gun-100 px-4 py-2.5 text-body text-text dark:bg-gun-700">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-2 animate-fade-in">
      {message.thinking && <ThinkingTrace text={message.thinking} />}
      <div className="max-w-[720px] text-body leading-relaxed text-text">{message.content}</div>

      {message.artifactId && (
        <button
          onClick={() => toggleArtifactPanel(true)}
          className="mt-1 inline-flex w-fit items-center gap-2.5 rounded-md border border-border bg-surface px-3 py-2 text-left transition-colors hover:bg-bg-subtle"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-gradient text-white">
            <FileCode2 size={16} />
          </span>
          <span className="leading-tight">
            <span className="block text-small font-medium text-text">{sampleArtifact.title}</span>
            <span className="block text-caption text-text-muted">
              HTML · v{sampleArtifact.version} · click to preview
            </span>
          </span>
        </button>
      )}

      <div className="flex items-center gap-3 pt-0.5">
        <ModelBadge modelId={message.modelId} effort={message.effort} />
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <ActionIcon icon={<Copy size={14} />} />
          <ActionIcon icon={<RotateCcw size={14} />} />
          <ActionIcon icon={<ThumbsUp size={14} />} />
        </div>
      </div>
    </div>
  );
}

function ActionIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-bg-subtle hover:text-text"
      )}
    >
      {icon}
    </button>
  );
}
